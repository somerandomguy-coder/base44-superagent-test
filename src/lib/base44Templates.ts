export const BASE44_DENO_INGEST_FUNCTION = `// Base44 Deno Serverless Edge Function: feedback_ingest.ts
// Runtime: Deno Deploy / V8 Micro-Isolates (<5ms cold start)
// Handles multi-channel webhooks (Discord, GitHub, App Store, Telemetry)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

// 1. Strict Payload Validation Contract
const IngestPayloadSchema = z.object({
  source: z.enum(["discord", "github", "appstore", "intercom", "base44_telemetry"]),
  author: z.string().min(1),
  content: z.string().min(3),
  metadata: z.record(z.unknown()).optional(),
});

// 2. MongoDB-Compatible Connection Pooling Singleton
const client = new MongoClient();
const MONGO_URI = Deno.env.get("BASE44_MONGO_URI") || "mongodb://localhost:27017";
await client.connect(MONGO_URI);
const db = client.database("base44_superagent");
const feedbackCollection = db.collection("feedbacks");

serve(async (req: Request) => {
  // CORS & Security Handlers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const rawBody = await req.json();
    const validated = IngestPayloadSchema.parse(rawBody);

    const doc = {
      ...validated,
      triaged: false,
      sentimentScore: null,
      severity: "medium",
      createdAt: new Date(),
    };

    const insertedId = await feedbackCollection.insertOne(doc);

    // Broadcast WebSocket event to live clients
    // (Base44 native realtime sync)
    return new Response(JSON.stringify({ 
      success: true, 
      id: insertedId, 
      stage: "INGESTING",
      timestamp: new Date().toISOString()
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
`;

export const BASE44_DENO_SUPERAGENT_FUNCTION = `// Base44 Deno Serverless Edge Function: triage_superagent.ts
// Implements the deterministic 6-stage State Machine & Scratchpad Reflection Loop

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

interface AgentReActState {
  stage: "TRIAGING" | "SYNTHESIZING" | "VALIDATING" | "LIVE_DEPLOY";
  scratchpad: string[];
  iteration: number;
}

// Zod Schema Guard for Generative UI output
const SpecSchema = z.object({
  version: z.string(),
  summary: z.object({
    headline: z.string(),
    overallSentimentScore: z.number().min(0).max(100),
    statusHealth: z.enum(["healthy", "warning", "critical"]),
  }),
  kpis: z.array(z.object({
    id: z.string(),
    title: z.string(),
    value: z.union([z.string(), z.number()]),
    trend: z.enum(["up", "down", "neutral"]),
    color: z.enum(["violet", "cyan", "emerald", "amber", "rose"]),
  })).min(2),
});

serve(async (req: Request) => {
  // Step 1: Synthesize Dashboard Spec via LLM Tool Call
  // Step 2: Scratchpad Diagnostic & Reflection Loop
  let attempts = 0;
  const maxAttempts = 3;
  let validatedSpec = null;
  const reflectionLogs = [];

  while (attempts < maxAttempts) {
    attempts++;
    // Call LLM with prompt + current reflection diagnostics
    const candidateJson = await callSynthesizerModel();

    const parseResult = SpecSchema.safeParse(candidateJson);
    if (parseResult.success) {
      validatedSpec = parseResult.data;
      reflectionLogs.push({ iteration: attempts, status: "PASSED_SCHEMA" });
      break;
    } else {
      // Reflection error feed-back
      reflectionLogs.push({
        iteration: attempts,
        status: "SCHEMA_RETRY",
        errors: parseResult.error.errors,
      });
    }
  }

  return new Response(JSON.stringify({
    success: true,
    deployedSpec: validatedSpec,
    reflectionLogs,
  }), {
    headers: { "Content-Type": "application/json" }
  });
});

async function callSynthesizerModel() {
  // Connects to Base44 Model Router (OpenAI / Anthropic / Gemini)
  return { /* structured generative UI spec */ };
}
`;

export const BASE44_MONGODB_SCHEMA = `// Base44 MongoDB Collection Schemas & Row-Level Security (RLS)
// File: entities/FeedbackEntities.json

{
  "entities": {
    "Feedback": {
      "collection": "feedbacks",
      "indexes": [
        { "fields": { "source": 1, "createdAt": -1 } },
        { "fields": { "sentiment": 1 } },
        { "fields": { "churnRisk": 1 } },
        { "fields": { "severity": 1 } }
      ],
      "rowLevelSecurity": {
        "read": "auth.role in ['admin', 'product_manager', 'developer']",
        "write": "true", // Public ingest webhooks
        "delete": "auth.role == 'admin'"
      },
      "properties": {
        "source": { "type": "string", "enum": ["discord", "github", "appstore", "intercom", "base44_telemetry"] },
        "author": { "type": "string" },
        "content": { "type": "string" },
        "sentimentScore": { "type": "number", "minimum": 0, "maximum": 1 },
        "severity": { "type": "string", "enum": ["low", "medium", "high", "urgent"] },
        "triaged": { "type": "boolean" },
        "churnRisk": { "type": "boolean" },
        "tags": { "type": "array", "items": { "type": "string" } },
        "createdAt": { "type": "date" }
      }
    },
    "GenerativeDashboardSnapshot": {
      "collection": "dashboard_snapshots",
      "properties": {
        "version": { "type": "string" },
        "spec": { "type": "object" },
        "generatedAt": { "type": "date" },
        "reflectionIterations": { "type": "number" },
        "active": { "type": "boolean" }
      }
    }
  }
}
`;
