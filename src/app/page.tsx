import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  AudioLines,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  Eye,
  FileText,
  LockKeyhole,
  Menu,
  Mic2,
  Play,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
} from "lucide-react";

const customerMarks = ["Northwind Labs", "Aurora Media", "Brightroom", "Signal & Co", "Loop Studio", "Vertex Films"];

const questions = [
  ["Does GazePrompter upload or store my video?", "No. Your camera feed is processed in your browser. Recording stays on your device until you choose to download it."],
  ["How does the teleprompter follow my voice?", "Speech recognition tracks your place in the script as you talk. It pauses with you and catches up when you skip or rephrase a line."],
  ["Do I need to install anything?", "No installation or plugin is needed. Open GazePrompter in a modern browser, allow camera access, and start recording."],
  ["Which cameras and browsers work best?", "GazePrompter works with built-in and external webcams in current desktop browsers. Chrome and Edge provide the smoothest experience."],
];

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="gp-wordmark" aria-label="GazePrompter home">
      <span className="gp-mark"><Eye size={19} strokeWidth={2.1} /></span>
      <span>Gaze<span className="gp-wordmark-light">Prompter</span></span>
      {!compact && <span className="gp-wordmark-dot">®</span>}
    </Link>
  );
}

function Header() {
  return (
    <header className="gp-header">
      <nav className="gp-nav" aria-label="Main navigation">
        <Wordmark />
        <div className="gp-nav-links">
          <a href="#product">Product <ChevronDown size={13} /></a>
          <a href="#how-it-works">How it works</a>
          <a href="#stories">Customer stories</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="gp-nav-actions">
          <Link href="/login" className="gp-signin">Log in</Link>
          <Link href="/login" className="gp-button gp-button-dark gp-nav-cta">Start for free <ArrowRight size={15} /></Link>
        </div>
        <details className="gp-mobile-menu">
          <summary aria-label="Open navigation"><Menu size={21} /></summary>
          <div className="gp-mobile-menu-panel">
            <a href="#product">Product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#stories">Customer stories</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
        </details>
      </nav>
    </header>
  );
}

function StudioPreview() {
  return (
    <div className="studio-stage" aria-label="GazePrompter studio interface preview">
      <div className="stage-grain" />
      <div className="studio-window">
        <div className="studio-topbar">
          <div className="studio-brand"><span className="studio-mini-eye"><Eye size={13} /></span> GazePrompter <span className="studio-chevron">⌄</span></div>
          <div className="studio-top-actions"><span className="studio-save"><span /> All changes saved</span><button>Share</button><button className="studio-close">×</button></div>
        </div>
        <div className="studio-workspace">
          <div className="studio-left">
            <div className="camera-view">
              <div className="camera-corner corner-tl" /><div className="camera-corner corner-tr" /><div className="camera-corner corner-bl" /><div className="camera-corner corner-br" />
              <div className="camera-glow" />
              <div className="person-art">
                <div className="person-hair" />
                <div className="person-face"><span className="eye-left" /><span className="eye-right" /><span className="nose" /><span className="smile" /></div>
                <div className="person-neck" /><div className="person-shirt" />
              </div>
              <span className="gaze-pill"><span /> Eye contact on</span>
              <div className="camera-caption"><span className="record-live"><i /> REC</span><span>00:24</span></div>
            </div>
            <div className="record-toolbar"><span><Video size={13} /> FaceTime HD Camera <ChevronDown size={11} /></span><span><Mic2 size={13} /> MacBook Pro Microphone <ChevronDown size={11} /></span><button className="record-button"><span /></button><span className="settings-dot">•••</span></div>
          </div>
          <div className="prompter-panel">
            <div className="prompter-heading"><div><FileText size={14} /> <span>MY SCRIPT</span></div><span className="more">•••</span></div>
            <h3>Why the best videos feel like a conversation</h3>
            <div className="script-copy"><p>There&apos;s a small difference between speaking to a camera and speaking to a person.</p><p className="script-current">When you can keep your eyes on the lens, your audience feels like you&apos;re right there with them.</p><p>That&apos;s why we built GazePrompter: to help you focus on what you want to say.</p></div>
            <div className="voice-follow"><AudioLines size={14} /><span>Following your voice</span><span className="voice-pulse"><i /><i /><i /><i /><i /></span></div>
            <div className="script-progress"><span /></div><div className="script-time"><span>Script progress</span><b>42%</b></div>
          </div>
        </div>
        <div className="studio-bottom"><span><span className="green-dot" /> Camera ready</span><span>Private session <LockKeyhole size={11} /></span><span>1080p <ChevronDown size={10} /></span></div>
      </div>
      <div className="float-card float-card-left"><span className="float-icon"><ScanEye size={16} /></span><span><b>Eyes on the lens</b><small>Real-time gaze correction</small></span><Check size={15} className="float-check" /></div>
      <div className="float-card float-card-right"><span className="float-icon purple"><AudioLines size={16} /></span><span><b>Voice synced</b><small>Script follows naturally</small></span><span className="tiny-eq"><i /><i /><i /><i /></span></div>
    </div>
  );
}

function Hero() {
  return (
    <section className="gp-hero">
      <div className="gp-hero-inner">
        <div className="hero-copy">
          <div className="review-badge"><span className="review-stars">★★★★★</span><span>Built for your best on-camera take</span></div>
          <h1>Look at the lens.<br />Say it <em>your way.</em></h1>
          <p className="hero-description">A teleprompter that follows your voice, with AI eye contact correction built in. Make every video feel more natural, right from your browser.</p>
          <div className="hero-actions">
            <Link href="/login" className="gp-button gp-button-blue">Start recording for free <ArrowRight size={16} /></Link>
            <a href="#product" className="gp-watch"><span><Play size={13} fill="currentColor" /></span> See how it works</a>
          </div>
          <div className="hero-footnote"><span><Check size={13} /> No downloads</span><span><Check size={13} /> No credit card</span><span><Check size={13} /> Your video stays yours</span></div>
        </div>
        <StudioPreview />
      </div>
      <a className="hero-scroll" href="#trusted"><span>Scroll to explore</span><ArrowDownRight size={15} /></a>
    </section>
  );
}

function TrustStrip() {
  return <section id="trusted" className="trust-strip"><p>MADE FOR PEOPLE WHO CREATE ON CAMERA</p><div>{customerMarks.map((x) => <span key={x}>{x}</span>)}</div></section>;
}

function FeatureCards() {
  return (
    <section id="product" className="section-wrap product-section">
      <div className="section-heading"><span className="eyebrow">ONE STUDIO. BETTER TAKES.</span><h2>Everything you need to feel<br className="desktop-break" /> at home on camera.</h2><p>From the first line to the final download, GazePrompter keeps your focus where it belongs: on your audience.</p></div>
      <div className="feature-grid">
        <article className="feature-card feature-card-wide">
          <div className="feature-text"><span className="feature-icon blue"><ScanEye size={19} /></span><span className="feature-kicker">01 · EYE CONTACT</span><h3>Keep your eyes<br />on the conversation.</h3><p>AI gaze correction gently guides your eyes to the camera while you read, so every take feels direct and connected.</p><a href="#how-it-works">Explore eye contact <ArrowRight size={14} /></a></div>
          <div className="eye-demo"><div className="eye-demo-bg"><div className="focus-ring"><span /><i /></div><div className="eye-caption"><span className="live-dot" /> GAZE LOCKED <b>98%</b></div></div><div className="demo-float"><ScanEye size={15} /><span>Looking at camera</span><Check size={14} /></div></div>
        </article>
        <article className="feature-card">
          <span className="feature-icon lavender"><AudioLines size={19} /></span><span className="feature-kicker">02 · VOICE TRACKING</span><h3>Prompts at<br />your own pace.</h3><p>Your script moves as you speak. Pause, take a breath, go off-script — it keeps your place.</p><div className="waveform" aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <i key={i} style={{ height: `${10 + ((i * 17) % 25)}px` }} />)}</div>
        </article>
        <article className="feature-card feature-card-private">
          <span className="feature-icon green"><ShieldCheck size={19} /></span><span className="feature-kicker">03 · PRIVATE BY DESIGN</span><h3>Your footage stays<br />right where it is.</h3><p>Recording and correction happen locally in your browser. Your raw video isn&apos;t sent to a server.</p><div className="privacy-note"><LockKeyhole size={14} /><span>Processed on this device</span><span className="privacy-status">LOCAL</span></div>
        </article>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section id="how-it-works" className="workflow-section">
      <div className="workflow-inner">
        <div className="workflow-copy"><span className="eyebrow eyebrow-light">A SIMPLER WAY TO SHOW UP</span><h2>From script<br />to <em>your best take.</em></h2><p>Everything works together in one calm, focused recording space.</p><Link href="/login" className="gp-button gp-button-white">Try GazePrompter free <ArrowRight size={15} /></Link><div className="workflow-trust"><ShieldCheck size={15} /> No setup. No editing. No awkward eye-line.</div></div>
        <div className="workflow-steps">
          <div className="workflow-line" />
          <article><span className="step-no">01</span><div><h3>Bring your words</h3><p>Paste your script or jot down a few talking points. Your prompter is ready in seconds.</p></div><span className="step-icon"><FileText size={18} /></span></article>
          <article><span className="step-no">02</span><div><h3>Talk like yourself</h3><p>Press record. Your script follows your voice while eye contact correction works quietly in the background.</p></div><span className="step-icon"><Mic2 size={18} /></span></article>
          <article><span className="step-no">03</span><div><h3>Keep the take</h3><p>Download your recording and share it wherever your audience is waiting.</p></div><span className="step-icon"><Download size={18} /></span></article>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="showcase-section section-wrap">
      <div className="showcase-head"><div><span className="eyebrow">A STUDIO THAT GETS OUT OF THE WAY</span><h2>Less looking down.<br /><em>More connection.</em></h2></div><p>Good videos don&apos;t feel read. They feel like you. GazePrompter gives you a little more room to be present.</p></div>
      <div className="showcase-board">
        <div className="showcase-sidebar"><div className="showcase-brand"><span><Eye size={15} /></span> GazePrompter</div><span className="side-label">YOUR WORKSPACE</span><div className="side-item active"><FileText size={14} /> My scripts <span>3</span></div><div className="side-item"><Video size={14} /> Recordings</div><div className="side-item"><Sparkles size={14} /> Eye correction</div><div className="side-separator" /><div className="side-label">RECENT SCRIPTS</div><div className="recent-script"><span /> My intro video <small>Edited just now</small></div><div className="recent-script"><span className="violet" /> Product update <small>Yesterday</small></div><div className="recent-script"><span className="orange" /> Creator tips <small>Oct 28</small></div><div className="sidebar-user"><div>AR</div><span>Alex Rivera<small>Free plan</small></span><ChevronDown size={13} /></div></div>
        <div className="showcase-main"><div className="showcase-toolbar"><span>My intro video <ChevronDown size={12} /></span><span className="autosave"><Check size={12} /> Saved</span><button>Share</button><button className="toolbar-dots">•••</button></div><div className="editor-layout"><div className="editor-video"><div className="video-scene"><div className="scene-sun" /><div className="scene-person"><div className="scene-head" /><div className="scene-body" /></div><div className="video-status"><span><i /> CAMERA READY</span><span>00:00</span></div><span className="video-eye"><Eye size={13} /> Eye contact on</span></div><div className="video-controls"><button className="control-swap">↻</button><span><Video size={12} /> Camera</span><span><Mic2 size={12} /> Microphone</span><button className="big-record"><i /></button><span className="control-quality">1080p</span><button className="control-dots">•••</button></div></div><div className="editor-script"><div className="script-title-row"><span><FileText size={14} /> SCRIPT</span><button>•••</button></div><h4>Welcome to my channel</h4><p>Hey everyone, thanks for being here. Today I want to share something I&apos;ve been working on for a while.</p><p className="active-line">It&apos;s a new way to record videos that feels more like a conversation and a lot less like reading from a page.</p><p>Let me show you what I mean.</p><div className="script-listening"><AudioLines size={13} /><span>Listening to your voice</span><b>•••••</b></div><div className="editor-progress"><i /></div><span className="progress-label">Script progress <b>38%</b></span></div></div><div className="editor-bottom"><span><span className="green-dot" /> Everything looks good</span><span><LockKeyhole size={12} /> Your video is private</span></div></div>
      </div>
      <div className="showcase-caption"><span><span className="caption-dot" /> YOUR CAMERA, SCRIPT, AND TOOLS IN ONE PLACE</span><span>Built for a natural take <ArrowRight size={14} /></span></div>
    </section>
  );
}

function Stories() {
  return (
    <section id="stories" className="stories-section">
      <div className="section-wrap"><div className="stories-heading"><div><span className="eyebrow">MADE FOR THE MOMENTS THAT MATTER</span><h2>Show up as <em>yourself.</em></h2></div><div className="story-rating"><span>★★★★★</span><b>Made for better conversations</b><small>For creators, educators, and teams</small></div></div>
        <div className="quote-grid"><figure><div className="quote-stars">★★★★★</div><blockquote>“I used to reshoot a 3-minute intro eight times. With GazePrompter I nail it in one take — my eyes never leave the lens.”</blockquote><figcaption><span className="avatar avatar-blue">MC</span><span><b>Maya Chen</b><small>YouTuber · 1.2M subscribers</small></span><ArrowUpRightIcon /></figcaption></figure><figure><div className="quote-stars">★★★★★</div><blockquote>“The voice-tracked prompter is eerily good. It actually pauses when I pause and catches up when I rephrase a sentence.”</blockquote><figcaption><span className="avatar avatar-orange">DO</span><span><b>Daniel Okafor</b><small>Founder, Loop Studio</small></span><ArrowUpRightIcon /></figcaption></figure><figure className="quote-last"><div className="quote-stars">★★★★★</div><blockquote>“We recorded an entire 12-module course without a single retake for eye-line issues. It paid for itself in week one.”</blockquote><figcaption><span className="avatar avatar-green">SM</span><span><b>Sofia Martins</b><small>Course creator</small></span><ArrowUpRightIcon /></figcaption></figure></div>
      </div>
    </section>
  );
}

function ArrowUpRightIcon() { return <ArrowRight className="quote-arrow" size={15} />; }

function Privacy() {
  return <section id="privacy" className="privacy-band"><div className="privacy-band-inner"><div className="privacy-orbit"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core"><LockKeyhole size={24} /></div><span className="orbit-chip orbit-chip-a"><Video size={13} /></span><span className="orbit-chip orbit-chip-b"><Eye size={13} /></span><span className="orbit-chip orbit-chip-c"><Mic2 size={13} /></span></div><div className="privacy-copy"><span className="eyebrow eyebrow-light">YOUR CAMERA. YOUR CONTROL.</span><h2>Private from<br />the <em>first frame.</em></h2><p>GazePrompter processes your camera feed directly in your browser. Your raw footage stays on your device, so you can focus on what you&apos;re saying.</p><div className="privacy-checks"><span><Check size={14} /> In-browser processing</span><span><Check size={14} /> No raw video uploads</span><span><Check size={14} /> You choose what to download</span></div></div></div></section>;
}

function Pricing() {
  return <section id="pricing" className="section-wrap pricing-section"><div className="section-heading"><span className="eyebrow">SIMPLE, CREATOR-FRIENDLY PRICING</span><h2>Start free. Find your flow.</h2><p>Try the whole recording experience, then choose what works for you.</p></div><div className="pricing-card"><div><span className="pricing-tag">FREE TO START</span><h3>Make a better take today.</h3><p>No commitment. No card details. Just open the studio and press record.</p></div><div className="pricing-right"><span><b>$0</b> / to get started</span><Link href="/login" className="gp-button gp-button-blue">Start recording for free <ArrowRight size={15} /></Link><small>Camera and microphone access required</small></div></div></section>;
}

function FAQ() {
  return <section id="faq" className="faq-section"><div className="section-wrap faq-wrap"><div className="faq-heading"><span className="eyebrow">GOOD QUESTIONS</span><h2>Before you hit record.</h2><p>Everything you need to know to feel ready.</p><span className="faq-help"><CircleHelp size={16} /> Still curious? <a href="mailto:hello@gazeprompter.com">Talk to our team <ArrowRight size={13} /></a></span></div><div className="faq-list">{questions.map(([q, a]) => <details key={q}><summary>{q}<span><ChevronDown size={15} /></span></summary><p>{a}</p></details>)}</div></div></section>;
}

function FinalCTA() {
  return <section className="final-cta"><div className="final-cta-inner"><div className="cta-glow" /><span className="eyebrow eyebrow-light">THE CAMERA IS WAITING</span><h2>Let them see <em>you.</em></h2><p>Make your next video feel more natural, from the very first take.</p><Link href="/login" className="gp-button gp-button-white">Start recording for free <ArrowRight size={16} /></Link><span className="cta-note"><Check size={13} /> Free to start · No downloads</span></div></section>;
}

function Footer() {
  return <footer className="gp-footer"><div className="footer-main"><div className="footer-brand"><Wordmark /><p>Show up with confidence.<br />We'll keep your place.</p><span className="footer-social">in <span>𝕏</span> ▶</span></div><div className="footer-column"><b>Product</b><a href="#product">Eye contact AI</a><a href="#product">Voice prompter</a><a href="#pricing">Pricing</a></div><div className="footer-column"><b>Explore</b><a href="#how-it-works">How it works</a><a href="#stories">Customer stories</a><a href="#faq">Help center</a></div><div className="footer-column"><b>Company</b><a href="mailto:hello@gazeprompter.com">Contact</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div><div className="footer-note"><span className="footer-eye"><Eye size={18} /></span><p>Good videos start with<br /><b>being present.</b></p><a href="#top">Back to top ↑</a></div></div><div className="footer-bottom"><span>© 2026 GazePrompter. All rights reserved.</span><span><i /> Your video stays on your device</span><span>Made for your next great take <Star size={12} /></span></div></footer>;
}

export default function LandingPage() {
  return <main id="top" className="gazeprompter-home"><Header /><Hero /><TrustStrip /><FeatureCards /><Workflow /><Showcase /><Stories /><Privacy /><Pricing /><FAQ /><FinalCTA /><Footer /></main>;
}
