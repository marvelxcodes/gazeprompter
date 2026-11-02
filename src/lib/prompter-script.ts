// Script model shared by the teleprompter UI and the word-sync engine.

export interface PromptLine {
  /** Stable id for React keys / scroll anchoring */
  id: string;
  text: string;
}

/**
 * Splits a raw script into prompt lines. Paragraph breaks become larger gaps;
 * single newlines become line breaks so the teleprompter scrolls naturally.
 */
export function parseScript(raw: string): PromptLine[] {
  return raw
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((text, i) => ({ id: `line-${i}`, text }));
}

/** Total word count across all lines (used to estimate duration). */
export function countWords(lines: PromptLine[]): number {
  return lines.reduce(
    (acc, l) => acc + l.text.split(/\s+/).filter(Boolean).length,
    0
  );
}

/** Normalise a word for fuzzy matching against transcription output. */
export function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim();
}

/**
 * Flattens lines into an ordered array of normalized words with a back-
 * reference to their line index — this is the haystack the word-sync
 * algorithm searches through.
 */
export interface IndexedWord {
  word: string; // normalized
  raw: string; // original token (for display/debugging)
  lineIndex: number;
}

export function flattenWords(lines: PromptLine[]): IndexedWord[] {
  const out: IndexedWord[] = [];
  lines.forEach((line, lineIndex) => {
    line.text
      .split(/\s+/)
      .filter(Boolean)
      .forEach((raw) => {
        const word = normalizeWord(raw);
        if (word) out.push({ word, raw, lineIndex });
      });
  });
  return out;
}

/**
 * Word-sync: given the list of recognized words spoken so far (from the
 * speech recognizer), advance a pointer through the script using tolerant
 * subsequence matching.
 *
 * Strategy: walk the expected words; whenever the next spoken word matches
 * (or fuzzy-matches) the expected word, consume both. On mismatch we skip
 * ahead in the *spoken* stream (the speaker may have ad-libbed or the
 * recognizer misheard) but never regress in the script. Returns the index of
 * the furthest script line reached.
 */
export function findCurrentLine(
  expected: IndexedWord[],
  spokenNormalized: string[]
): number {
  if (expected.length === 0) return 0;
  let e = 0; // pointer into expected words
  let s = 0; // pointer into spoken words
  let lastLine = 0;

  while (e < expected.length && s < spokenNormalized.length) {
    const exp = expected[e].word;
    const spo = spokenNormalized[s];

    if (exp === spo || fuzzyMatch(exp, spo)) {
      lastLine = expected[e].lineIndex;
      e++;
      s++;
    } else {
      // Look ahead a few spoken words for a re-sync opportunity.
      let resynced = false;
      for (let la = 1; la <= 4 && s + la < spokenNormalized.length; la++) {
        if (exp === spokenNormalized[s + la] || fuzzyMatch(exp, spokenNormalized[s + la])) {
          s += la;
          resynced = true;
          break;
        }
      }
      if (!resynced) s++; // treat current spoken word as noise/ad-lib
    }
  }

  return lastLine;
}

/** Levenshtein-light fuzzy match: allow small edits on longer words. */
function fuzzyMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  const maxEdits = a.length >= 7 ? 2 : 1;
  return levenshtein(a, b) <= maxEdits;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = curr;
  }
  return prev[n];
}

export const DEFAULT_SCRIPT = `Hey, welcome back to the channel!

Today we're diving into something I've been experimenting with for the past few weeks, and honestly, it completely changed how I record my videos.

Here's the problem. When you read from a teleprompter, your eyes scan across the screen instead of looking at the lens. Viewers notice it immediately. It breaks trust, and it makes even great content feel scripted and distant.

So here's what I do now. I keep the script moving with my voice, and the eye-contact layer keeps me locked onto the camera. The result feels natural, conversational, and professional at the same time.

Notice how I'm not hunting for the next line anymore. The moment I finish a sentence, the prompter advances automatically. No pausing. No losing my place. No awkward silence on camera.

And that's really the whole point. Technology should disappear. You should just talk, like you're talking to one person sitting right on the other side of the lens.

If this approach resonates with you, hit subscribe. I drop a new deep-dive every week. Now go record something great.`;
