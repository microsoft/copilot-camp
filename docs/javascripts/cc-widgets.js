/**
 * cc-widgets.js  —  Copilot Camp lab UI widgets
 * Drop into: docs/javascripts/cc-widgets.js
 * Add to mkdocs.yml extra_javascript: [javascripts/cc-widgets.js]
 *
 * HOW IT WORKS
 * ────────────
 * MkDocs Material uses instant navigation (XHR page swaps). Inline <script>
 * tags in markdown DO NOT re-run after navigation. So instead of calling
 * widget functions from inline scripts, we read configuration from
 * data-* attributes on placeholder <div>s, then render them.
 *
 * The render pass is triggered:
 *   1. On initial DOMContentLoaded
 *   2. On every MkDocs instant-navigation via document$.subscribe()
 *
 * USAGE IN MARKDOWN
 * ─────────────────
 * Place a single <div> with data-widget="name" and data-* config attrs.
 * No <script> tags needed anywhere.
 *
 * ─── WIDGET REFERENCE ────────────────────────────────────────────────────
 *
 * Hero:
 *   <div data-widget="hero"
 *        data-badge="Prerequisites · Lab E0+"
 *        data-badge-color="amber"
 *        data-icon="🔧"
 *        data-title="Prerequisites & Concepts"
 *        data-subtitle="Install every tool…"
 *        data-time="45–60 min"
 *        data-requires="None — first lab"
 *        data-toolkit="Windows / Mac / Linux"></div>
 *
 * Checklist ("What you'll have by the end"):
 *   Items are pipe-separated; main~sub within each item (sub optional).
 *   <div data-widget="checklist"
 *        data-items="M365 tenant configured~Custom app uploads enabled|Node.js 22 LTS~Verified with node -v"></div>
 *
 * Concepts grid (each card has its own color):
 *   Cards are || separated; each card = label::color::title::body
 *   body may contain HTML.
 *   <div data-widget="concepts"
 *        data-cards="Microsoft 365 Copilot::blue::The AI host::The underlying LLM…||Declarative Agent::purple::Your focused persona::A set of three JSON files…"></div>
 *
 * Architecture diagram:
 *   Rows are || separated. Each row is either:
 *     label::<text>
 *     row::<box1title>::<box1color>::<box1sub>|<box2title>::<box2color>::<box2sub>|…
 *   <div data-widget="arch"
 *        data-rows="row::Microsoft 365 Copilot::copilot::Receives user query|Declarative Agent::agent::declarativeAgent.json + instruction.txt||label::reads ai-plugin.json → calls MCP tool||row::Dev Tunnel::tunnel::Public HTTPS ↔ localhost:3001|MCP Server::mcp::Handles tool calls|Azurite::data::Table Storage emulator"></div>
 *
 * Callout:
 *   type: info | tip | warn | concept
 *   <div data-widget="callout"
 *        data-type="tip"
 *        data-title="Optional title"
 *        data-body="Body text, may contain &lt;code&gt;HTML&lt;/code&gt;."></div>
 *
 * Step header:
 *   <div data-widget="step" data-n="1" data-title="Enable custom app uploads"></div>
 *
 * Verify box (teal, dark-green code block):
 *   Lines starting with # are dimmed. Use \n in data-cmd for line breaks.
 *   <div data-widget="verify"
 *        data-label="Node.js version"
 *        data-cmd="node -v\n# Expected: v22.x.x"></div>
 *
 * Terminal (macOS chrome):
 *   <div data-widget="terminal"
 *        data-label="install azurite"
 *        data-cmd="npm install -g azurite\nazurite --version\n# Expected: 3.x.x"></div>
 *
 * File tree:
 *   Lines are | separated. Within a line, wrap segments in [hi:text] or [dim:text].
 *   <div data-widget="tree"
 *        data-lines="appPackage/|├── declarativeAgent.json   [dim:# lists ai-plugin.json]|├── [hi:ai-plugin.json]          [dim:# generated]|├── instruction.txt|└── manifest.json"></div>
 *
 * Lab nav (prev/next footer):
 *   <div data-widget="labnav"
 *        data-prev="prereq-lab.md"
 *        data-prev-label="E0+ Prerequisites"
 *        data-next="e-intro-lab.md"
 *        data-next-label="Lab E-Intro"></div>
 *
 * Bundle card:
 *   <div data-widget="bundle"
 *        data-icon="🔌"
 *        data-label="Bundle A"
 *        data-label-color="teal"
 *        data-title="MCP Foundations: Build it, then secure it"
 *        data-tagline="Stand up a real MCP server…"
 *        data-time="~4 hrs"
 *        data-lab1-badge="Lab E8"
 *        data-lab1-badge-color="blue"
 *        data-lab1-title="Connect Declarative Agent to MCP Server"
 *        data-lab1-items="Run Azurite + seed claims data|Start the Zava MCP server (15 tools)|Scaffold agent with Agents Toolkit"
 *        data-transition="add auth"
 *        data-lab2-badge="Lab E10"
 *        data-lab2-badge-color="purple"
 *        data-lab2-title="OAuth-Protected MCP Server"
 *        data-lab2-items="Register app in Microsoft Entra ID|Add client secret + expose API scope|Rebuild server with JWT validation"
 *        data-arc="Here's a working MCP server — now make it production-grade"
 *        data-start-url="https://microsoft.github.io/…"></div>
 *
 * Bundle sequence stepper (landing page or bundle overview):
 *   Each step: labKey::badge::badgeColor::title::item1~item2~item3::url
 *   Steps are pipe-separated. Completion tracked in localStorage.
 *   <div data-widget="bundleseq"
 *        data-steps="e1::Lab E1::blue::Build a Declarative Agent::Create agent~Add instructions~Test in Copilot::./01-typespec-declarative-agent/|e3::Lab E3::teal::Add Declarative Agent & Plugin::Scaffold plugin~Wire actions~Provision::./03-add-declarative-agent/|e4::Lab E4::purple::Enhance API & Plugin::Add auth~Improve responses~Re-test::./04-enhance-api-plugin/"></div>
 */

(function () {
  "use strict";

  /* ── palette ─────────────────────────────────────────────────────────── */
  const P = {
    blue:   { light:"#E6F1FB", mid:"#378ADD", dark:"#0C447C", text:"#185FA5" },
    teal:   { light:"#E1F5EE", mid:"#1D9E75", dark:"#085041", text:"#0F6E56" },
    amber:  { light:"#FAEEDA", mid:"#EF9F27", dark:"#633806", text:"#854F0B" },
    green:  { light:"#EAF3DE", mid:"#639922", dark:"#27500A", text:"#3B6D11" },
    purple: { light:"#EEEDFE", mid:"#7F77DD", dark:"#3C3489", text:"#534AB7" },
    coral:  { light:"#FAECE7", mid:"#D85A30", dark:"#712B13", text:"#993C1D" },
    gray:   { light:"#F1EFE8", mid:"#B4B2A9", dark:"#444441", text:"#5F5E5A" },
  };

  const ARCH_COLORS = {
    copilot: { bg:"#E6F1FB", border:"#378ADD", strong:"#0C447C" },
    agent:   { bg:"#EEEDFE", border:"#7F77DD", strong:"#534AB7" },
    mcp:     { bg:"#E1F5EE", border:"#1D9E75", strong:"#0F6E56" },
    tunnel:  { bg:"#F1EFE8", border:"rgba(0,0,0,.15)", strong:"#5F5E5A" },
    data:    { bg:"#FAEEDA", border:"#EF9F27", strong:"#854F0B" },
  };

  /* ── style injection (once) ──────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById("ccw-styles")) return;
    const s = document.createElement("style");
    s.id = "ccw-styles";
    s.textContent = `
/* ─────────────────────────────────────────────────────────────────────────
   cc-widgets — font-size philosophy:
   Body copy inherits the site's 16px base throughout (no overrides).
   Only structural chrome gets explicit sizes: badges, labels, step numbers,
   code blocks, and tiny metadata pills — things intentionally smaller than
   body text. Everything else is layout + color only.
───────────────────────────────────────────────────────────────────────── */

/* ── hero ── */
.ccw-hero{padding:32px 0 24px;border-bottom:.5px solid rgba(0,0,0,.1);margin-bottom:28px}
.ccw-badge{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;
  padding:4px 12px;border-radius:20px;margin-bottom:14px;line-height:1}
.ccw-hero h1{margin:0 0 10px;line-height:1.2}
.ccw-hero-sub{color:var(--md-default-fg-color--light,#5F5E5A);margin:0 0 20px;
  max-width:600px;line-height:1.6}
.ccw-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
.ccw-pill{font-size:.75rem;color:var(--md-default-fg-color--light,#5F5E5A);
  background:var(--md-default-bg-color,#fff);border:.5px solid rgba(0,0,0,.12);
  border-radius:20px;padding:3px 12px;display:inline-flex;align-items:center;gap:5px}
.ccw-pill strong{color:var(--md-default-fg-color,#1a1a18);font-weight:600}

/* ── hero path breadcrumb ── */
.ccw-hero-path{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:20px}
.ccw-path-step{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;
  background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.12);border-radius:20px;padding:5px 12px;
  color:var(--md-default-fg-color--light,#5F5E5A)}
.ccw-path-step.active{background:#E6F1FB;border-color:#378ADD;color:#185FA5}
.ccw-path-num{width:20px;height:20px;border-radius:50%;background:#185FA5;
  color:#fff;font-size:.7rem;font-weight:700;display:flex;align-items:center;
  justify-content:center;flex-shrink:0}
.ccw-path-arrow{color:#B4B2A9}

/* ── checklist ── */
.ccw-checklist{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  padding:20px 24px;margin-bottom:32px}
.ccw-checklist h2{font-weight:600;margin:0 0 14px}
.ccw-cl-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ccw-cl-item{display:flex;align-items:flex-start;gap:10px;padding:9px 12px;
  border-radius:8px;background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.1)}
.ccw-cl-dot{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(0,0,0,.2);
  flex-shrink:0;margin-top:3px}
.ccw-cl-main{display:block;font-weight:600;
  color:var(--md-default-fg-color,#1a1a18)}
.ccw-cl-sub{display:block;font-size:.8rem;
  color:var(--md-default-fg-color--light,#888780);margin-top:1px}
.ccw-checklist.soft{border:.5px solid rgba(0,0,0,.08);padding:14px 16px;margin-bottom:20px}
.ccw-checklist.soft h2{font-size:.92rem;font-weight:600;margin:0 0 10px;color:var(--md-default-fg-color--light,#6F6E68)}
.ccw-checklist.soft .ccw-cl-grid{gap:6px}
.ccw-checklist.soft .ccw-cl-item{padding:7px 9px;background:rgba(0,0,0,.015);border:.5px solid rgba(0,0,0,.07)}
.ccw-checklist.soft .ccw-cl-dot{width:14px;height:14px;margin-top:2px;border-width:1.25px;opacity:.75}
.ccw-checklist.soft .ccw-cl-main{font-size:.88rem;font-weight:500}
.ccw-checklist.soft .ccw-cl-sub{font-size:.76rem;color:var(--md-default-fg-color--light,#7C7B75)}

/* ── concept grid ── */
.ccw-concept-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0 28px}
.ccw-concept{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:8px;padding:16px}
.ccw-con-label{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;margin-bottom:6px}
.ccw-concept h4{font-weight:600;margin:0 0 6px}
.ccw-concept p{color:var(--md-default-fg-color--light,#5F5E5A);
  margin:0;line-height:1.55}

/* ── arch diagram ── */
.ccw-arch{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  padding:20px;margin:20px 0;display:flex;flex-direction:column;gap:10px}
.ccw-arch-row{display:flex;align-items:stretch;gap:10px}
.ccw-arch-box{flex:1;border-radius:8px;padding:10px 14px;
  border:.5px solid rgba(0,0,0,.12)}
.ccw-arch-box strong{display:block;font-weight:600;margin-bottom:3px}
.ccw-arch-box span{font-size:.8rem;
  color:var(--md-default-fg-color--light,#5F5E5A);line-height:1.4}
.ccw-arch-arrow{color:#B4B2A9;font-size:1.2rem;
  flex:0 0 24px;display:flex;align-items:center;justify-content:center}
.ccw-arch-label{font-size:.8rem;color:#888780;text-align:center;
  padding:0;font-style:italic}

/* ── callout ── */
.ccw-callout{border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;
  line-height:1.6;border-left:3px solid}
.ccw-callout strong{display:block;margin-bottom:4px;font-weight:600}
.ccw-callout a{color:inherit;text-decoration:underline}
.ccw-callout code{font-size:.85em;padding:1px 5px;border-radius:4px;
  background:rgba(0,0,0,.1)}
.ccw-callout.info   {background:#E6F1FB;border-color:#378ADD;color:#0C447C}
.ccw-callout.tip    {background:#E1F5EE;border-color:#1D9E75;color:#0F6E56}
.ccw-callout.warn   {background:#FAEEDA;border-color:#EF9F27;color:#854F0B}
.ccw-callout.concept{background:#EEEDFE;border-color:#7F77DD;color:#534AB7}
.ccw-callout.prereqs{background:transparent;border:none;border-radius:0;padding:14px 0 0;margin:20px 0 6px;color:inherit}
.ccw-callout.prereqs strong{display:block;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#64748b;margin-bottom:6px}
.ccw-callout.prereqs a{color:inherit;text-decoration:underline}
.ccw-callout.prereqs code{font-size:.85em;padding:1px 5px;border-radius:4px;background:rgba(0,0,0,.07);color:inherit}

/* ── step header ── */
.ccw-step{display:flex;align-items:center;gap:12px;margin:28px 0 10px}
.ccw-step-num{width:28px;height:28px;border-radius:50%;background:#185FA5;color:#fff;
  font-size:.75rem;font-weight:700;display:flex;align-items:center;
  justify-content:center;flex-shrink:0}
.ccw-step h3{margin:0;font-weight:600}

/* ── verify box ── */
.ccw-verify{background:#E1F5EE;border:.5px solid #1D9E75;border-radius:8px;
  padding:14px 18px;margin:20px 0}
.ccw-verify-label{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:#0F6E56;margin-bottom:10px}
.ccw-code-block{background:#0a2e22;border-radius:6px;padding:12px 16px;margin:0;
  overflow-x:auto;white-space:pre;
  font-family:var(--md-code-font,ui-monospace,monospace);
  font-size:var(--md-code-font-size,.85em);line-height:1.6;color:#c8fae0}
.ccw-dim{color:#5DCAA5;font-style:italic}

/* ── terminal ── */
.ccw-terminal{margin:16px 0 24px;border-radius:8px;overflow:hidden}
.ccw-term-bar{background:#3a3a38;padding:8px 14px;display:flex;align-items:center;gap:6px}
.ccw-term-dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0}
.ccw-term-label{font-size:.7rem;color:#888780;margin-left:6px;
  font-family:var(--md-code-font,ui-monospace,monospace)}
.ccw-term-body{background:#2C2C2A;padding:14px 18px;overflow-x:auto;
  white-space:pre;font-family:var(--md-code-font,ui-monospace,monospace);
  font-size:var(--md-code-font-size,.85em);line-height:1.6;color:#e8e6de}

/* ── file tree ── */
.ccw-tree{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:8px;
  padding:14px 18px;margin:12px 0 20px;
  font-family:var(--md-code-font,ui-monospace,monospace);
  font-size:var(--md-code-font-size,.85em);line-height:1.8}
.ccw-tree .ccw-hi {color:#185FA5;font-weight:600}
.ccw-tree .ccw-dim{color:#888780}

/* ── lab nav ── */
.ccw-lab-nav-wrap{margin-top:52px;padding-top:24px;
  border-top:.5px solid rgba(0,0,0,.12)}
.ccw-bundle-context{border:.5px solid;border-radius:8px;
  padding:10px 16px;margin-bottom:14px;display:flex;
  align-items:center;gap:12px;flex-wrap:wrap;
  background:var(--md-default-bg-color--light,#F9F8F5)}
.ccw-context-label{font-size:.75rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em}
.ccw-context-pos{font-size:.8rem;color:#888780;margin-left:auto}
.ccw-pips{display:flex;gap:4px;align-items:center}
.ccw-pip{width:8px;height:8px;border-radius:50%;
  background:rgba(0,0,0,.15);transition:background .2s}
.ccw-pip.active{width:10px;height:10px}
.ccw-lab-nav{display:flex;justify-content:space-between;align-items:center;
  gap:12px;flex-wrap:wrap}
.ccw-lab-nav a{text-decoration:none;border-radius:8px;padding:8px 16px;
  border:.5px solid rgba(0,0,0,.15);color:#185FA5;
  background:var(--md-default-bg-color,#fff)}
.ccw-lab-nav a.ccw-next{background:#185FA5;color:#fff;border-color:#185FA5}
.ccw-lab-nav a.ccw-done{background:#0F6E56;border-color:#0F6E56;font-size:.875rem}
.ccw-lab-nav a:hover{opacity:.85}
/* bundle picker (no bundle set, multiple options) */
.ccw-bundle-picker{padding:16px;background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.12);border-radius:8px}
.ccw-picker-label{display:block;font-weight:600;margin-bottom:10px}
.ccw-picker-btns{display:flex;gap:8px;flex-wrap:wrap}
.ccw-bundle-pick{border:.5px solid;border-radius:8px;padding:7px 16px;
  font-size:.875rem;font-weight:600;cursor:pointer;font-family:inherit}
.ccw-bundle-pick:hover{opacity:.85}
/* "also in" switcher */
.ccw-bundle-switcher{display:flex;align-items:center;gap:8px;
  margin-top:12px;flex-wrap:wrap}
.ccw-switcher-label{font-size:.75rem;color:#888780}
.ccw-switcher-btn{border:.5px solid;border-radius:6px;padding:3px 10px;
  font-size:.75rem;font-weight:600;cursor:pointer;font-family:inherit}
.ccw-switcher-btn:hover{opacity:.85}

/* ── bundle card ── */
.ccw-bundle{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  overflow:hidden;margin:16px 0 32px}
.ccw-bundle-head{padding:18px 22px 14px;border-bottom:.5px solid rgba(0,0,0,.1);
  display:flex;align-items:flex-start;gap:14px}
.ccw-bicon{width:38px;height:38px;border-radius:8px;font-size:1.2rem;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ccw-blabel{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;margin-bottom:3px}
.ccw-bundle-head h2{margin:0 0 3px;font-weight:600}
.ccw-bsub{color:var(--md-default-fg-color--light,#5F5E5A);margin:0}
.ccw-btime{font-size:.75rem;color:#888780;
  background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.1);border-radius:12px;padding:3px 10px;
  white-space:nowrap;margin-left:auto;flex-shrink:0;align-self:flex-start}
.ccw-bundle-labs{display:grid;grid-template-columns:1fr 36px 1fr;
  align-items:center;padding:18px 22px;background:rgba(0,0,0,.04);border-radius:0}
.ccw-lab-card{background:#fff;
  border:.5px solid rgba(0,0,0,.12);border-radius:8px;padding:14px 16px;
  box-shadow:0 2px 6px rgba(0,0,0,.07)}
.ccw-lab-card .ccw-ln{font-size:.7rem;font-weight:700;padding:2px 8px;
  border-radius:10px;display:inline-block;margin-bottom:8px}
.ccw-lab-card h3{font-weight:600;margin:0 0 8px}
.ccw-lab-card ul{list-style:none;padding:0;margin:0}
.ccw-lab-card li{color:var(--md-default-fg-color--light,#5F5E5A);
  padding:2px 0 2px 14px;position:relative;font-size:.875rem}
.ccw-lab-card li::before{content:"·";position:absolute;left:4px;color:#B4B2A9}
.ccw-bundle-trans{text-align:center;color:#B4B2A9;line-height:1.3;font-size:.8rem}
.ccw-bundle-foot{border-top:.5px solid rgba(0,0,0,.1);padding:12px 22px;
  display:flex;align-items:center;justify-content:space-between;
  background:var(--md-default-bg-color--light,#F9F8F5);
  flex-wrap:wrap;gap:10px}
.ccw-bundle-foot em{color:var(--md-default-fg-color--light,#5F5E5A)}
.ccw-bundle-foot a{color:#185FA5;text-decoration:none;
  background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:7px;
  padding:6px 14px;font-weight:600}

/* ── da compare ── */
.ccw-explainer{background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  padding:24px 28px;margin-bottom:32px}
.ccw-explainer h2{font-weight:600;margin:0 0 14px}
.ccw-cmp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
.ccw-cmp-box{background:var(--md-default-bg-color--light,#F9F8F5);
  border:.5px solid rgba(0,0,0,.12);border-radius:8px;padding:14px}
.ccw-cmp-box.good{border-color:#1D9E75}
.ccw-cmp-lbl{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:#888780;margin-bottom:8px}
.ccw-cmp-box.good .ccw-cmp-lbl{color:#0F6E56}
.ccw-cmp-box p{color:var(--md-default-fg-color--light,#5F5E5A);margin:0;line-height:1.55}
.ccw-explainer-note{color:var(--md-default-fg-color--light,#5F5E5A);margin:0;line-height:1.6}

/* ── onramp strip ── */
.ccw-onramp{background:rgba(0,0,0,.04);
  border:.5px solid rgba(0,0,0,.12);border-radius:12px;
  padding:24px 28px 20px;margin-bottom:32px}
.ccw-onramp-title{font-weight:600;margin:0 0 4px}
.ccw-onramp-sub{color:var(--md-default-fg-color--light,#5F5E5A);margin:0 0 18px}
.ccw-onramp-row{display:flex;align-items:stretch;gap:10px;flex-wrap:nowrap}
.ccw-ostep{flex:1 1 0;min-width:0;display:flex;flex-direction:column;
  background:#fff;
  border:.5px solid rgba(0,0,0,.12);border-radius:10px;padding:16px 18px;
  box-shadow:0 2px 6px rgba(0,0,0,.07)}
.ccw-ostep-badge{font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:10px;
  display:inline-block;margin-bottom:8px;align-self:flex-start}
.ccw-ostep h3{font-weight:600;margin:0 0 8px;line-height:1.35}
.ccw-ostep p{color:var(--md-default-fg-color--light,#5F5E5A);
  margin:0 0 12px;line-height:1.5;font-size:.875rem;flex:1}
.ccw-ostep a{color:#185FA5;text-decoration:none;font-weight:600;font-size:.875rem;
  align-self:flex-start}
.ccw-onramp-arr{flex:0 0 22px;display:flex;align-items:center;justify-content:center;
  color:#B4B2A9;font-size:1rem}

/* ── bundle sequence stepper ── */
.ccw-bseq{padding:8px 0}
.ccw-bseq-step{display:flex;gap:16px;margin-bottom:0}
.ccw-bseq-indicator{display:flex;flex-direction:column;align-items:center;
  flex-shrink:0;width:32px}
.ccw-bseq-dot{width:32px;height:32px;border-radius:50%;display:flex;
  align-items:center;justify-content:center;font-size:.8rem;font-weight:700;
  flex-shrink:0;z-index:1}
.ccw-bseq-step.done    .ccw-bseq-dot{background:#1D9E75;color:#fff}
.ccw-bseq-step.current .ccw-bseq-dot{background:#185FA5;color:#fff;
  box-shadow:0 0 0 4px #E6F1FB}
.ccw-bseq-step.upcoming .ccw-bseq-dot{background:#E8E6DF;color:#888780}
.ccw-bseq-line{flex:1;width:2px;background:#E8E6DF;margin:4px 0;min-height:24px}
.ccw-bseq-step.done .ccw-bseq-line{background:#1D9E75}
.ccw-bseq-card{flex:1;background:var(--md-default-bg-color,#fff);
  border:.5px solid rgba(0,0,0,.1);border-radius:10px;padding:16px 18px;
  margin-bottom:16px;transition:border-color .15s,box-shadow .15s}
.ccw-bseq-step.current .ccw-bseq-card{border-color:#378ADD;
  box-shadow:0 2px 12px rgba(55,138,221,.12)}
.ccw-bseq-step.done    .ccw-bseq-card{opacity:.7}
.ccw-bseq-step.upcoming .ccw-bseq-card{opacity:.5}
.ccw-bseq-card h3{font-weight:600;margin:6px 0 8px}
.ccw-bseq-card ul{list-style:none;padding:0;margin:0 0 12px}
.ccw-bseq-card li{color:var(--md-default-fg-color--light,#5F5E5A);
  padding:2px 0 2px 14px;position:relative;font-size:.875rem}
.ccw-bseq-card li::before{content:"·";position:absolute;left:4px;color:#B4B2A9}
.ccw-bseq-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:8px}
.ccw-bseq-cta{font-weight:600;font-size:.875rem;color:#185FA5;text-decoration:none}
.ccw-bseq-cta.active{background:#185FA5;color:#fff;padding:6px 14px;border-radius:6px}
.ccw-bseq-cta.revisit{color:#888780;font-size:.875rem;text-decoration:none}
.ccw-bseq-btn{border:none;background:transparent;cursor:pointer;font-size:.75rem;
  color:#888780;padding:4px 8px;border-radius:4px;border:.5px solid #D9D8D1;
  font-family:inherit}
.ccw-bseq-btn:hover{background:#F1EFE8}
.ccw-bseq-complete{margin-top:8px;padding:16px 20px;background:#E1F5EE;
  border-radius:10px;font-weight:600;color:#0F6E56;text-align:center}
.ccw-bseq-complete a{color:#0F6E56;margin-left:8px}

/* ── section label ── */
.ccw-section-label{font-size:.7rem;font-weight:700;letter-spacing:.09em;
  text-transform:uppercase;color:#888780;margin:0 0 12px;display:block}

/* ── footer note ── */
.ccw-footer-note{margin-top:32px;color:#888780;text-align:center;line-height:1.6;
  font-size:.875rem}

/* ── responsive ── */
@media(max-width:600px){
  .ccw-cl-grid,.ccw-concept-grid,.ccw-bundle-labs,.ccw-cmp-grid{grid-template-columns:1fr}
  .ccw-arch-row{flex-direction:column}
  .ccw-bundle-trans,.ccw-onramp-arr{display:none}
  .ccw-onramp-row{flex-direction:column}
}
    `;
    document.head.appendChild(s);
  }

  /* ── helpers ─────────────────────────────────────────────────────────── */
  function esc(s) {
    return String(s || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  /* render cmd string: escape, then dim lines starting with # */
  function renderCmd(cmd) {
    const raw = String(cmd).replace(/\\n/g, "\n");
    return raw.split("\n").map(line => {
      const safe = esc(line);
      return line.trimStart().startsWith("#")
        ? `<span class="ccw-dim">${safe}</span>` : safe;
    }).join("\n");
  }

  /* parse tree line: "[hi:text]" / "[dim:text]" markers → spans */
  function renderTreeLine(line) {
    return esc(line)
      .replace(/\[hi:([^\]]+)\]/g, (_, t) => `<span class="ccw-hi">${t}</span>`)
      .replace(/\[dim:([^\]]+)\]/g, (_, t) => `<span class="ccw-dim">${t}</span>`);
  }

  /* ── renderers ───────────────────────────────────────────────────────── */

  function renderHero(el) {
    const d = el.dataset;
    const c = P[d.badgeColor] || P.amber;
    const pills = [
      d.time     && `<span class="ccw-pill">⏱ <strong>${esc(d.time)}</strong></span>`,
      d.requires && `<span class="ccw-pill">📋 Requires: <strong>${esc(d.requires)}</strong></span>`,
      d.toolkit  && `<span class="ccw-pill">🧰 <strong>${esc(d.toolkit)}</strong></span>`,
      d.extra    && `<span class="ccw-pill">${d.extra}</span>`,
    ].filter(Boolean).join("");
    el.innerHTML = `
      <div class="ccw-hero">
        <div class="ccw-badge" style="background:${c.light};color:${c.dark}">
          ${d.icon || ""} ${esc(d.badge)}
        </div>
        <h1>${esc(d.title)}</h1>
        <p class="ccw-hero-sub">${esc(d.subtitle)}</p>
        ${pills ? `<div class="ccw-meta">${pills}</div>` : ""}
      </div>`;
  }

  function renderChecklist(el) {
    const title = (el.dataset.title || "✅ What you'll have by the end").trim();
    const variant = (el.dataset.variant || "").trim().toLowerCase();
    const checklistClass = variant === "soft" ? "ccw-checklist soft" : "ccw-checklist";
    const items = (el.dataset.items || "").split("|").filter(Boolean).map(raw => {
      const [main, sub] = raw.split("~");
      return `
        <div class="ccw-cl-item">
          <div class="ccw-cl-dot"></div>
          <div>
            <span class="ccw-cl-main">${esc(main.trim())}</span>
            ${sub ? `<span class="ccw-cl-sub">${esc(sub.trim())}</span>` : ""}
          </div>
        </div>`;
    }).join("");
    el.innerHTML = `
      <div class="${checklistClass}">
        <h2>${esc(title)}</h2>
        <div class="ccw-cl-grid">${items}</div>
      </div>`;
  }

  function renderConcepts(el) {
    const cards = (el.dataset.cards || "").split("||").filter(Boolean).map(raw => {
      const [label, color, title, ...bodyParts] = raw.split("::");
      const body = bodyParts.join("::");
      const c = P[color] || P.blue;
      return `
        <div class="ccw-concept">
          <div class="ccw-con-label" style="color:${c.text}">${esc(label.trim())}</div>
          <h4>${esc(title.trim())}</h4>
          <p>${body.trim()}</p>
        </div>`;
    }).join("");
    el.innerHTML = `<div class="ccw-concept-grid">${cards}</div>`;
  }

  function renderArch(el) {
    const rows = (el.dataset.rows || "").split("||").filter(Boolean).map(raw => {
      const trimmed = raw.trim();
      if (trimmed.startsWith("label::")) {
        return `<div class="ccw-arch-label">${esc(trimmed.slice(7))}</div>`;
      }
      // row::title::color::sub|title::color::sub|…
      const parts = trimmed.replace(/^row::/, "").split("|");
      const boxes = parts.map((b, i) => {
        const [title, color, sub] = b.split("::");
        const c = ARCH_COLORS[color] || ARCH_COLORS.tunnel;
        const arrow = i < parts.length - 1
          ? `<div class="ccw-arch-arrow">→</div>` : "";
        return `
          <div class="ccw-arch-box" style="background:${c.bg};border-color:${c.border}">
            <strong style="color:${c.strong}">${esc(title.trim())}</strong>
            ${sub ? `<span>${esc(sub.trim())}</span>` : ""}
          </div>${arrow}`;
      }).join("");
      return `<div class="ccw-arch-row">${boxes}</div>`;
    }).join("");
    el.innerHTML = `<div class="ccw-arch">${rows}</div>`;
  }

  function renderCallout(el) {
    const d = el.dataset;
    el.innerHTML = `
      <div class="ccw-callout ${esc(d.type || "info")}">
        ${d.title ? `<strong>${esc(d.title)}</strong>` : ""}
        ${d.body || ""}
      </div>`;
  }

  function renderStep(el) {
    el.innerHTML = `
      <div class="ccw-step">
        <div class="ccw-step-num">${esc(el.dataset.n)}</div>
        <h3>${esc(el.dataset.title)}</h3>
      </div>`;
  }

  function renderVerify(el) {
    el.innerHTML = `
      <div class="ccw-verify">
        <div class="ccw-verify-label">✓ ${esc(el.dataset.label)}</div>
        <div class="ccw-code-block">${renderCmd(el.dataset.cmd || "")}</div>
      </div>`;
  }

  function renderTerminal(el) {
    el.innerHTML = `
      <div class="ccw-terminal">
        <div class="ccw-term-bar">
          <span class="ccw-term-dot" style="background:#E24B4A"></span>
          <span class="ccw-term-dot" style="background:#EF9F27"></span>
          <span class="ccw-term-dot" style="background:#639922"></span>
          ${el.dataset.label
            ? `<span class="ccw-term-label">${esc(el.dataset.label)}</span>` : ""}
        </div>
        <div class="ccw-term-body">${renderCmd(el.dataset.cmd || "")}</div>
      </div>`;
  }

  function renderTree(el) {
    const lines = (el.dataset.lines || "").split("|").map(renderTreeLine).join("<br>");
    el.innerHTML = `<div class="ccw-tree">${lines}</div>`;
  }

  /* ── Bundle navigation system ───────────────────────────────────────────
   *
   * BUNDLE MAP — define every bundle and its ordered lab sequence here.
   * url: the MkDocs page path (relative, must match href MkDocs generates)
   * label: short display name used in prev/next buttons
   *
   * Landing page bundle card start links call ccwSetBundle("a") etc.
   * via data-bundle attribute on the start button — see renderBundle().
   *
   * Each lab page has ONE labnav widget. The widget:
   *   1. Reads active bundle from localStorage
   *   2. Matches current page URL to a position in that bundle's lab list
   *   3. Renders contextual prev / next with bundle name shown
   *   4. Shows a "switch bundle" pill if multiple bundles contain this lab
   *   5. Falls back to a bundle picker if no bundle is set yet
   * ─────────────────────────────────────────────────────────────────────── */

  const BUNDLES = {
    a: {
      name: "Bundle A — MCP Foundations",
      color: "teal",
      labs: [
        { url: "08-mcp-server/", label: "Lab E8 - Connect Declarative Agent to MCP Server" },
        { url: "10-mcp-auth/", label: "Lab E10 - OAuth-Protected MCP Server" },
      ],
    },
    b: {
      name: "Bundle B — Multi-Agent Workflows",
      color: "coral",
      labs: [
        { url: "08-mcp-server/", label: "Lab E8 - Connect Declarative Agent to MCP Server" },
        { url: "09-connected-agent/", label: "Lab E9 - Connected Agents Orchestration" },
      ],
    },
    c: {
      name: "Bundle C — MCP App",
      color: "green",
      labs: [
        { url: "11-mcp-app/", label: "Lab E11 - MCP App with Interactive Widgets" },
      ],
    },
    d: {
      name: "Bundle D — API-Based Declarative Agent",
      color: "blue",
      labs: [
        { url: "02-build-the-api/", label: "Lab E2 - Build a Backend API" },
        { url: "03-add-declarative-agent/", label: "Lab E3 - Add Declarative Agent and API Plugin" },
        { url: "04-enhance-api-plugin/", label: "Lab E4 - Enhance API and Plugin" },
        { url: "05-add-adaptive-card/", label: "Lab E5 - Add Adaptive Cards" },
        { url: "06a-add-authentication-ttk/", label: "Lab E6a - Add Entra ID Authentication" },
      ],
    },
    e: {
      name: "Bundle E — Declarative Agents with Copilot Connectors",
      color: "purple",
      labs: [
        { url: "02-build-the-api/", label: "Lab E2 - Build a Backend API" },
        { url: "03-add-declarative-agent/", label: "Lab E3 - Add Declarative Agent and API Plugin" },
        { url: "04-enhance-api-plugin/", label: "Lab E4 - Enhance API and Plugin" },
        { url: "07-add-graphconnector/", label: "Lab E7 - Add Copilot Connector" },
      ],
    },
    f: {
      name: "Bundle F — DA + CLI Tools",
      color: "gray",
      labs: [
        { url: "12-da-cli-wiqd/", label: "Lab E12 - DA CLI with WIQD Tooling" },
        { url: "13-da-cli-evals/", label: "Lab E13 - DA CLI with Evals Tooling" },
      ],
    },
  };

  const BUNDLE_STORAGE_KEY = "ccw-active-bundle";

  /* Normalise a URL to just its last path segment(s) for loose matching.
     MkDocs may render /pages/extend-m365-copilot/04-enhance-api-plugin/
     but the bundle map might store "04-enhance-api-plugin/".
     We match on the last non-empty segment so both resolve. */
  function urlSegment(url) {
    return url.replace(/\/$/, "").split("/").pop() || "";
  }

  function currentSegment() {
    return urlSegment(window.location.pathname);
  }

  function bundleColor(key) {
    return P[BUNDLES[key]?.color] || P.blue;
  }

  function getBundleFromQuery() {
    try {
      const key = new URLSearchParams(window.location.search).get("bundle") || "";
      return BUNDLES[key] ? key : "";
    } catch {
      return "";
    }
  }

  function withBundleQuery(url, key) {
    const u = String(url || "").trim();
    if (!u || !key || !BUNDLES[key]) return u;
    if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("#")) {
      return u;
    }
    if (/([?&])bundle=/.test(u)) {
      return u;
    }
    return u + (u.includes("?") ? "&" : "?") + `bundle=${encodeURIComponent(key)}`;
  }

  /* Preserve bundle context when building href links */
  function bundleHref(url) {
    const u = String(url || "").trim();
    if (!u) return "";

    let resolved = u;
    if (!(u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/") || u.startsWith("../") || u.startsWith("./"))) {
      // Bundle lab URLs are siblings under /extend-m365-copilot/, not children of current lab route.
      resolved = `../${u}`;
    }

    return withBundleQuery(resolved, getBundle());
  }

  window.ccwSetBundle = function (key) {
    try { localStorage.setItem(BUNDLE_STORAGE_KEY, key); } catch (e) {}
  };

  function getBundle() {
    const fromQuery = getBundleFromQuery();
    if (fromQuery) {
      try { localStorage.setItem(BUNDLE_STORAGE_KEY, fromQuery); } catch (e) {}
      return fromQuery;
    }
    try { return localStorage.getItem(BUNDLE_STORAGE_KEY) || ""; } catch (e) { return ""; }
  }

  /* Find which bundles contain the current page and the position within each */
  function findPositions() {
    const seg = currentSegment();
    const results = [];
    for (const [key, bundle] of Object.entries(BUNDLES)) {
      const idx = bundle.labs.findIndex(l => urlSegment(l.url) === seg);
      if (idx !== -1) results.push({ key, bundle, idx });
    }
    return results;
  }

  function renderLabNav(el) {
    const positions  = findPositions();
    const activeKey  = getBundle();

    /* ── case 1: no bundle set yet, and this page is in multiple bundles ── */
    if (!activeKey && positions.length > 1) {
      const picks = positions.map(({ key, bundle }) => {
        const c = bundleColor(key);
        return `
          <button class="ccw-bundle-pick"
            style="background:${c.light};color:${c.dark};border-color:${c.mid}"
            onclick="ccwSetBundle('${key}');location.reload()">
            ${esc(bundle.name)}
          </button>`;
      }).join("");
      el.innerHTML = `
        <div class="ccw-lab-nav">
          <div class="ccw-bundle-picker">
            <span class="ccw-picker-label">Which bundle are you following?</span>
            <div class="ccw-picker-btns">${picks}</div>
          </div>
        </div>`;
      return;
    }

    /* ── case 2: bundle set (or only one option) ── */
    const pos = positions.find(p => p.key === activeKey) || positions[0];

    /* not in any bundle — fall back to simple static nav */
    if (!pos) {
      const d = el.dataset;
      el.innerHTML = `
        <div class="ccw-lab-nav">
          ${d.prev ? `<a href="${esc(d.prev)}">← ${esc(d.prevLabel)}</a>` : "<span></span>"}
          ${d.next ? `<a href="${esc(d.next)}" class="ccw-next">${esc(d.nextLabel)} →</a>` : ""}
        </div>`;
      return;
    }

    const { key, bundle, idx } = pos;
    const c      = bundleColor(key);
    const prev   = bundle.labs[idx - 1] || null;
    const next   = bundle.labs[idx + 1] || null;
    const isLast = idx === bundle.labs.length - 1;

    /* "also in" switcher — other bundles that share this lab */
    const others = positions.filter(p => p.key !== key);
    const switcherHtml = others.length ? `
      <div class="ccw-bundle-switcher">
        <span class="ccw-switcher-label">Also in:</span>
        ${others.map(({ key: ok, bundle: ob }) => {
          const oc = bundleColor(ok);
          return `<button class="ccw-switcher-btn"
            style="background:${oc.light};color:${oc.dark};border-color:${oc.mid}"
            onclick="ccwSetBundle('${ok}');location.reload()">${esc(ob.name)}</button>`;
        }).join("")}
      </div>` : "";

    /* progress pip strip */
    const pips = bundle.labs.map((l, i) => `
      <span class="ccw-pip${i === idx ? " active" : ""}"
        style="${i === idx ? `background:${c.mid}` : ""}"></span>`
    ).join("");

    el.innerHTML = `
      <div class="ccw-lab-nav-wrap">
        <div class="ccw-bundle-context" style="border-color:${c.mid}">
          <span class="ccw-context-label" style="color:${c.dark}">
            ${esc(bundle.name)}
          </span>
          <span class="ccw-context-pos" style="color:${c.text}">
            Lab ${idx + 1} of ${bundle.labs.length}
          </span>
          <div class="ccw-pips">${pips}</div>
        </div>
        <div class="ccw-lab-nav">
          ${prev
            ? `<a href="${bundleHref(prev.url)}">← ${esc(prev.label)}</a>`
            : "<span></span>"}
          ${isLast
            ? `<a href="../bundles/" class="ccw-next ccw-done"
                onclick="ccwSetBundle('')">
                ✓ Bundle complete — back to overview
              </a>`
            : next
              ? `<a href="${bundleHref(next.url)}" class="ccw-next">
                  ${esc(next.label)} →
                </a>`
              : ""}
        </div>
        ${switcherHtml}
      </div>`;
  }

  function renderBundlePrelude(el) {
    const activeKey = getBundle();
    const positions = findPositions();
    const key = (activeKey && BUNDLES[activeKey])
      ? activeKey
      : (positions.length === 1 ? positions[0].key : "");

    const baseMatch = window.location.pathname.match(/^(.*)\/pages\/extend-m365-copilot\//);
    const siteBase = baseMatch?.[1] || "";
    const extendBase = `${siteBase}/pages/extend-m365-copilot/`;

    const current = currentSegment();
    const currentHref = `${window.location.pathname}${window.location.search || ""}`;

    function youAreHere(url) {
      return urlSegment(url) === current ? '<span class="you-are-here">YOU&nbsp;ARE&nbsp;HERE</span>' : "";
    }

    if (key && BUNDLES[key]) {
      const bundle = BUNDLES[key];
      const labs = bundle.labs.map(lab => {
        const href = withBundleQuery(`${extendBase}${lab.url.replace(/\/$/, "")}`, key);
        return `<li><a href="${esc(href)}">${esc(lab.label)}</a>${youAreHere(lab.url)}</li>`;
      }).join("");

      const bundleStart = withBundleQuery(`${extendBase}bundle-${key}`, key);
      const overview = withBundleQuery(`${extendBase}bundles`, key);
      const welcome = withBundleQuery(`${extendBase}index`, key);

      el.innerHTML = `
        <div class="cc-lab-toc e-path">
          <img src="/copilot-camp/assets/images/path-icons/E-path-heading.png" alt="Extend path" />
          <div>
            <p>Focused path: ${esc(bundle.name)}. Navigation is scoped to this bundle.</p>
            <ul>
              <li><strong><a href="${esc(welcome)}">🏁 Welcome</a></strong></li>
              <li><strong><a href="${esc(overview)}">🧩 Bundle overview</a></strong></li>
              <li><strong>🚦 Mandatory on-ramp</strong>
                <ul>
                  <li><a href="${esc(withBundleQuery(`${extendBase}00-prerequisites`, key))}">Lab E0 - Prerequisites</a>${youAreHere("00-prerequisites/")}</li>
                  <li><a href="${esc(withBundleQuery(`${extendBase}01-first-agent-new`, key))}">Lab E1 - Choose Foundation Path</a>${youAreHere("01-first-agent-new/")}</li>
                  <li><a href="${esc(withBundleQuery(`${extendBase}01-first-agent-builder`, key))}">Lab E1A - Declarative Agent Foundation with Agent Builder</a>${youAreHere("01-first-agent-builder/")}</li>
                  <li><a href="${esc(withBundleQuery(`${extendBase}01-first-agent-toolkit`, key))}">Lab E1B - Declarative Agent Foundation with Agents Toolkit</a>${youAreHere("01-first-agent-toolkit/")}</li>
                </ul>
              </li>
              <li><strong>${esc(bundle.name)}</strong>
                <ul>
                  <li><a href="${esc(bundleStart)}">Start ${esc(bundle.name)}</a></li>
                  ${labs}
                </ul>
              </li>
            </ul>
          </div>
        </div>`;
      return;
    }

    const pickButtons = positions.length > 1
      ? positions.map(({ key: pk, bundle }) => {
          const c = bundleColor(pk);
          const pickHref = withBundleQuery(window.location.pathname, pk);
          return `<a class="ccw-bundle-pick"
            style="display:inline-block;text-decoration:none;background:${c.light};color:${c.dark};border-color:${c.mid}"
            href="${esc(pickHref)}"
            onclick="ccwSetBundle('${pk}')">${esc(bundle.name)}</a>`;
        }).join("")
      : Object.entries(BUNDLES).map(([bk, bundle]) => {
          const c = bundleColor(bk);
          const startHref = withBundleQuery(`${extendBase}bundle-${bk}`, bk);
          return `<a class="ccw-bundle-pick"
            style="display:inline-block;text-decoration:none;background:${c.light};color:${c.dark};border-color:${c.mid}"
            href="${esc(startHref)}"
            onclick="ccwSetBundle('${bk}')">${esc(bundle.name)}</a>`;
        }).join("");

    el.innerHTML = `
      <div class="cc-lab-toc e-path">
        <img src="/copilot-camp/assets/images/path-icons/E-path-heading.png" alt="Extend path" />
        <div>
          <p>Choose a bundle to see a focused lab path in this prelude.</p>
          <div class="ccw-picker-btns">${pickButtons}</div>
        </div>
      </div>`;
  }

  function renderBundle(el) {
    const d = el.dataset;
    const lc = P[d.labelColor] || P.teal;

    function labCard(prefix) {
      const badge = d[prefix + "Badge"] || "";
      const badgeColor = d[prefix + "BadgeColor"] || "blue";
      const title = d[prefix + "Title"] || "";
      const items = (d[prefix + "Items"] || "").split("|").filter(Boolean)
        .map(i => `<li>${esc(i.trim())}</li>`).join("");
      const bc = P[badgeColor] || P.blue;
      return `
        <div class="ccw-lab-card">
          <span class="ccw-ln" style="background:${bc.light};color:${bc.dark}">
            ${esc(badge)}
          </span>
          <h3>${esc(title)}</h3>
          <ul>${items}</ul>
        </div>`;
    }

    el.innerHTML = `
      <div class="ccw-bundle">
        <div class="ccw-bundle-head">
          <div class="ccw-bicon" style="background:${lc.light}">${d.icon || ""}</div>
          <div>
            <div class="ccw-blabel" style="color:${lc.text}">${esc(d.label)}</div>
            <h2>${esc(d.title)}</h2>
            <p class="ccw-bsub">${esc(d.tagline)}</p>
          </div>
          <div class="ccw-btime">⏱ ${esc(d.time)}</div>
        </div>
        <div class="ccw-bundle-labs">
          ${labCard("lab1")}
          ${d.lab2Badge ? `<div class="ccw-bundle-trans">→<br><small>${esc(d.transition || "")}</small></div>${labCard("lab2")}` : ""}
        </div>
        <div class="ccw-bundle-foot">
          <em>${esc(d.arc)}</em>
          <a href="${esc(withBundleQuery(d.startUrl, d.bundleKey || ""))}"
             onclick="ccwSetBundle('${esc(d.bundleKey || "")}')">
            Start ${esc(d.label)} →
          </a>
        </div>
      </div>`;
  }

  /* landing hero — bigger h1 + path breadcrumb strip
     data-path = pipe-separated steps; prefix with * to mark active
     e.g. "0::Prerequisites (E0)|1::First Agent (E-Intro)|*A::Bundle A — MCP Foundations|*B::Bundle B — MCP at Scale"
  */
  function renderLandingHero(el) {
    const d = el.dataset;
    const c = P[d.badgeColor] || P.blue;
    const steps = (d.path || "").split("|").filter(Boolean).map(raw => {
      const active = raw.startsWith("*");
      const clean  = active ? raw.slice(1) : raw;
      const [num, ...labelParts] = clean.split("::");
      const label = labelParts.join("::");
      return `
        <div class="ccw-path-step${active ? " active" : ""}">
          <div class="ccw-path-num">${esc(num)}</div>
          ${esc(label)}
        </div>`;
    });
    /* interleave arrows */
    const pathHtml = steps.reduce((acc, s, i) =>
      acc + s + (i < steps.length - 1
        ? `<span class="ccw-path-arrow">${i === steps.length - 2 ? "+" : "→"}</span>`
        : ""), "");
    el.innerHTML = `
      <div class="ccw-hero">
        <div class="ccw-badge" style="background:${c.light};color:${c.dark}">
          ${d.icon || ""} ${esc(d.badge)}
        </div>
        <h1 style="font-size:2rem">${esc(d.title)}</h1>
        <p class="ccw-hero-sub">${esc(d.subtitle)}</p>
        ${pathHtml ? `<div class="ccw-hero-path">${pathHtml}</div>` : ""}
      </div>`;
  }

  /* DA compare — explainer box with two side-by-side comparison cards + note
     data-left-label, data-left-body, data-right-label, data-right-body, data-note
  */
  function renderDaCompare(el) {
    const d = el.dataset;
    el.innerHTML = `
      <div class="ccw-explainer">
        <h2>${esc(d.title || "What is a Declarative Agent?")}</h2>
        <div class="ccw-cmp-grid">
          <div class="ccw-cmp-box">
            <div class="ccw-cmp-lbl">${esc(d.leftLabel)}</div>
            <p>${d.leftBody}</p>
          </div>
          <div class="ccw-cmp-box good">
            <div class="ccw-cmp-lbl">${esc(d.rightLabel)}</div>
            <p>${d.rightBody}</p>
          </div>
        </div>
        ${d.note ? `<p class="ccw-explainer-note">${d.note}</p>` : ""}
      </div>`;
  }

  /* On-ramp strip — 3 step cards with arrows between them
     Each step: label::badgeColor::title::body::linkText::linkHref
     Steps are pipe-separated.
  */
  function renderOnramp(el) {
    const d = el.dataset;
    const steps = (d.steps || "").split("|").filter(Boolean);
    const BADGE_COLORS = {
      prereq: { bg:"#FAEEDA", color:"#854F0B" },
      lab:    { bg:"#E1F5EE", color:"#0F6E56" },
      bundle: { bg:"#E6F1FB", color:"#0C447C" },
    };
    const cards = steps.map((raw, i) => {
      const [label, badgeKey, title, body, linkText, linkHref] = raw.split("::");
      const bc = BADGE_COLORS[badgeKey] || BADGE_COLORS.lab;
      const arrow = i < steps.length - 1
        ? `<div class="ccw-onramp-arr">→</div>` : "";
      return `
        <div class="ccw-ostep">
          <span class="ccw-ostep-badge"
            style="background:${bc.bg};color:${bc.color}">${esc(label)}</span>
          <h3>${esc(title)}</h3>
          <p>${esc(body)}</p>
          ${linkText && linkHref
            ? `<a href="${esc(linkHref)}">${esc(linkText)} →</a>` : ""}
        </div>${arrow}`;
    }).join("");
    el.innerHTML = `
      <div class="ccw-onramp">
        <p class="ccw-onramp-title">${esc(d.title || "Start here before the bundles")}</p>
        <p class="ccw-onramp-sub">${esc(d.sub || "")}</p>
        <div class="ccw-onramp-row">${cards}</div>
      </div>`;
  }

  /* simple section label */
  function renderSectionLabel(el) {
    el.innerHTML = `<p class="ccw-section-label">${esc(el.dataset.text)}</p>`;
  }

  /* footer note */
  function renderFooterNote(el) {
    el.innerHTML = `<div class="ccw-footer-note">${el.dataset.text}</div>`;
  }

  /* Bundle sequence stepper — vertical timeline with localStorage progress tracking.
     Each step: labKey::badge::badgeColor::title::item1~item2~item3::url
     Steps are pipe-separated.
     - done    = learner marked it complete (green ✓ dot, faded card)
     - current = first non-done step (blue dot, highlighted card, "Start Lab" CTA)
     - upcoming = not yet reached (grey dot, dimmed card)
     Clicking "Mark done ✓" toggles localStorage and re-renders in place.
     Clicking any Start/Go/Revisit link stores the sequence in localStorage
     so the labnav widget on each lab page can resolve prev/next correctly.
  */
  function renderBundleSeq(el) {
    const d = el.dataset;
    const DONE_KEY    = k => `ccw-done-${k}`;
    const ACTIVE_SEQ  = "cc-active-bundle-seq";
    const ACTIVE_BUNDLE = BUNDLE_STORAGE_KEY;

    const steps = (d.steps || "").split("|").filter(Boolean).map(raw => {
      const parts = raw.split("::");
      return {
        key:        parts[0] || "",
        badge:      parts[1] || "",
        badgeColor: parts[2] || "blue",
        title:      parts[3] || "",
        items:      (parts[4] || "").split("~").filter(Boolean),
        url:        parts[5] || "#",
      };
    });

    function getSequencePaths() {
      return steps.map(step => {
        try { return new URL(step.url, window.location.href).pathname; }
        catch { return null; }
      }).filter(Boolean);
    }

    function isDone(key) {
      try { return localStorage.getItem(DONE_KEY(key)) === "true"; } catch { return false; }
    }

    function toggle(key) {
      try {
        localStorage.setItem(DONE_KEY(key), String(!isDone(key)));
      } catch {}
      render();
    }

    function render() {
      let foundCurrent = false;
      const stepsHtml = steps.map((step, i) => {
        const done     = isDone(step.key);
        const current  = !done && !foundCurrent;
        if (current) foundCurrent = true;
        const upcoming = !done && !current;
        const bc       = P[step.badgeColor] || P.blue;
        const isLast   = i === steps.length - 1;
        const cls      = done ? "done" : current ? "current" : "upcoming";
        const dot      = done ? "✓" : String(i + 1);
        const items    = step.items.map(it => `<li>${esc(it)}</li>`).join("");
        const ctaClass = done ? "revisit" : current ? "active" : "";
        const ctaText  = done ? "Revisit →" : current ? "Start Lab →" : "Go to Lab →";
        const bundleKey = (d.bundleKey || "").trim();
        const ctaHref = withBundleQuery(step.url, bundleKey);
        return `
          <div class="ccw-bseq-step ${cls}">
            <div class="ccw-bseq-indicator">
              <div class="ccw-bseq-dot">${dot}</div>
              ${!isLast ? `<div class="ccw-bseq-line"></div>` : ""}
            </div>
            <div class="ccw-bseq-card">
              <span class="ccw-ln"
                style="background:${bc.light};color:${bc.dark}">${esc(step.badge)}</span>
              <h3>${esc(step.title)}</h3>
              ${items ? `<ul>${items}</ul>` : ""}
              <div class="ccw-bseq-foot">
                <a href="${esc(ctaHref)}"
                   class="ccw-bseq-cta ${ctaClass}"
                   data-seq-link="true">${ctaText}</a>
                <button class="ccw-bseq-btn"
                  data-key="${esc(step.key)}">${done ? "Undo" : "Mark done ✓"}</button>
              </div>
            </div>
          </div>`;
      }).join("");

      const allDone = steps.every(s => isDone(s.key));
      const celebration = allDone
        ? `<div class="ccw-bseq-complete">
            🎉 Bundle complete!
            <a href="../">Choose another bundle →</a>
          </div>`
        : "";

      el.innerHTML = `<div class="ccw-bseq">${stepsHtml}${celebration}</div>`;

      /* toggle buttons */
      el.querySelectorAll(".ccw-bseq-btn").forEach(btn => {
        btn.addEventListener("click", () => toggle(btn.dataset.key));
      });

      /* store sequence paths when learner navigates so labnav can resolve them */
      el.querySelectorAll("[data-seq-link]").forEach(link => {
        link.addEventListener("click", () => {
          try {
            const bundleKey = (d.bundleKey || "").trim();
            localStorage.setItem(ACTIVE_SEQ, JSON.stringify({
              source:    window.location.pathname,
              paths:     getSequencePaths(),
              updatedAt: Date.now(),
            }));
            if (bundleKey) {
              localStorage.setItem(ACTIVE_BUNDLE, bundleKey);
            }
          } catch {}
        });
      });
    }

    render();
  }

  /* ── dispatch table ──────────────────────────────────────────────────── */
  const RENDERERS = {
    hero:          renderHero,
    landinghero:   renderLandingHero,
    dacompare:     renderDaCompare,
    onramp:        renderOnramp,
    sectionlabel:  renderSectionLabel,
    footernote:    renderFooterNote,
    checklist:     renderChecklist,
    concepts:      renderConcepts,
    arch:          renderArch,
    callout:       renderCallout,
    step:          renderStep,
    verify:        renderVerify,
    terminal:      renderTerminal,
    tree:          renderTree,
    bundleprelude: renderBundlePrelude,
    labnav:        renderLabNav,
    bundle:        renderBundle,
    bundleseq:     renderBundleSeq,
  };

  /* ── tab synchronization ────────────────────────────────────────────── */
  /* When learner selects a tab in one exercise, switch all matching tabs
     across the page to that same selection (e.g., "Agent Builder" everywhere) */
  function setupTabSync() {
    const tabInputs = document.querySelectorAll("input[type='radio'][id][name]");
    const tabLabels = document.querySelectorAll("label[for]");

    tabLabels.forEach(label => {
      label.addEventListener("click", (e) => {
        const forAttr = label.getAttribute("for");
        const clickedInput = document.getElementById(forAttr);
        if (!clickedInput || clickedInput.type !== "radio") return;

        // Extract the tab name (label text) from the clicked label
        const tabName = label.textContent.trim();
        if (!tabName) return;

        // Find all radio inputs with the same name prefix pattern (per pymdownx.tabbed group)
        // Then find their matching labels, and check if label text matches tabName
        tabInputs.forEach(input => {
          // Only sync within same "group" concept — tabs that share the same labeling scheme
          // Look for labels with matching text content
          const label2 = document.querySelector(`label[for="${input.id}"]`);
          if (!label2) return;

          const tabName2 = label2.textContent.trim();
          if (tabName2 === tabName && input.id !== forAttr) {
            // Click this input to switch its tab group to the same selection
            input.click();
          }
        });
      });
    });
  }

  /* ── main render pass ────────────────────────────────────────────────── */
  function renderAll() {
    injectStyles();
    setupTabSync();

    document.querySelectorAll("[data-widget]").forEach(el => {
      const name = el.dataset.widget;
      const fn = RENDERERS[name];
      if (fn) {
        try { fn(el); }
        catch (e) { console.warn("ccw: error rendering", name, e); }
      }
    });
  }

  /* ── MkDocs Material instant-nav hook ───────────────────────────────── */
  /* document$ is the RxJS observable exposed by MkDocs Material.          */
  /* It emits on every page load, including XHR navigations.               */
  if (typeof document$ !== "undefined") {
    document$.subscribe(renderAll);
  } else {
    /* Fallback for non-instant-nav or local preview */
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", renderAll);
    } else {
      renderAll();
    }
  }

})();