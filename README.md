# BasePulse | Superagent Feedback OS & Generative UI Engine

> Built for the Base44 Meetup: An autonomous feedback intelligence platform demonstrating the systems-engineering blueprint behind Base44, Lovable, and Bolt.new.

---

## 🌟 Key Architecture & Highlights

BasePulse implements a miniature version of a modern AI app builder platform's execution pipeline:

1. **Deterministic 6-Stage State Machine**:
   `INGESTING` ➔ `TRIAGING` ➔ `BATCH_BUFFER` ➔ `SYNTHESIZING` ➔ `VALIDATING` ➔ `LIVE_DEPLOY`
   Deterministic state transitions managed via TypeScript state machines rather than loose LLM autonomy.

2. **Scratchpad Diagnostic & Self-Healing Reflection Loop**:
   - Enforces strict runtime validation via **Zod schema contracts**.
   - Captures invalid AST or hallucinated type tokens pre-render.
   - Automatically diffs the schema error and prompts the model reflection loop to auto-correct before live deployment.
   - Includes an interactive **"Test Reflection Self-Heal"** simulator in the UI!

3. **Declarative Generative UI vs Fragile JSX**:
   - Eliminates syntax hallucinations and CSS misalignment by generating structured JSON widget specs that map directly to pre-built, robust **Recharts** and Tailwind components.
   - Features:
     - Net Sentiment & NPS Trajectory Area Chart with custom dark glass tooltips & multi-stop gradients
     - Payback & Retention Cumulative Distribution Function (CDF) Curve with median reference lines
     - Root-Cause Category Breakdown Composed Bar Chart
     - 1-Click Linear & GitHub Issue Generator

4. **Base44 Deno Subhosting & MongoDB Bridge**:
   - Ready-to-paste Base44 Deno Serverless Edge Functions (`feedback_ingest.ts`, `triage_superagent.ts`).
   - MongoDB-compatible NoSQL collection definitions with built-in **Row-Level Security (RLS)**.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev

# 3. Open in browser
http://localhost:5173/
```

To build for production:
```bash
npm run build
```

---

## 🎪 Demo Script for the Base44 Meetup

1. **The Problem & Value**:
   - Open `http://localhost:5173/` on the **Generative Dashboard** tab.
   - Highlight how multi-channel user feedback (Discord, GitHub, App Store, Intercom, Telemetry) is automatically ingested and synthesized into actionable engineering targets.

2. **The "Under-The-Hood" Systems Pitch**:
   - Switch to the **Superagent Inspector** tab.
   - Walk through the 6-stage deterministic state machine (`INGESTING` ➔ `LIVE_DEPLOY`).
   - Click **"Test Reflection Self-Heal"** in the top navbar:
     - Watch Zod flag the injected contract violations (e.g. probability > 1.0, invalid color tokens).
     - Show the **Reflection Prompt Diff** generated in the scratchpad.
     - Show how the model self-corrects on iteration 2 and deploys with zero downtime!

3. **The Base44 Connection**:
   - Switch to the **Base44 Architecture & Deno** tab.
   - Explain why Deno V8 micro-isolates (&lt;5ms boot) outperform heavy Docker containers for ephemeral agent tools.
   - Show the 1-click exportable Deno Edge Function and MongoDB collection schema with Row-Level Security rules.
