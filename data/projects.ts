import type { Project } from "@/types";

/**
 * Project catalog. Each project declares the loadouts it belongs to via `tags`
 * and is filtered with `byProfile` (see `lib/filterByProfile`). Set `repo` to a
 * GitHub repository name to cross-reference live stars/forks/language later.
 *
 * PLACEHOLDER content — replace with your real projects. The shape and tagging
 * are what matter; the switcher and filtering work automatically.
 */
export const projects: Project[] = [
  {
    id: "operator-hud",
    name: "Operator HUD Portfolio",
    desc: "This site: a sci-fi HUD with GSAP scroll choreography, a reactive WebGL particle field and a URL-driven loadout system.",
    tags: ["frontend"],
    stack: ["Next.js", "TypeScript", "GSAP", "react-three-fiber", "Tailwind"],
    href: "/",
    featured: true,
  },
  {
    id: "telemetry-dashboard",
    name: "Realtime Telemetry Dashboard",
    desc: "Streaming metrics dashboard with virtualized charts and 60fps canvas rendering over a websocket feed.",
    tags: ["frontend", "data"],
    stack: ["React", "WebSockets", "D3", "Web Workers"],
    featured: true,
  },
  {
    id: "feature-store",
    name: "Feature Store & Training Pipeline",
    desc: "Reproducible ML pipeline: ingestion, feature versioning and batch/online serving with drift monitoring.",
    tags: ["data"],
    stack: ["Python", "PyTorch", "Airflow", "DuckDB"],
    featured: true,
  },
  {
    id: "vector-search",
    name: "Semantic Vector Search API",
    desc: "Low-latency embedding search service with hybrid ranking and an evaluation harness for retrieval quality.",
    tags: ["data", "backend"],
    stack: ["Python", "FastAPI", "pgvector", "Redis"],
  },
  {
    id: "edge-gateway",
    name: "Edge API Gateway",
    desc: "Rate-limited, observable API gateway with token auth, request coalescing and structured tracing.",
    tags: ["backend"],
    stack: ["Go", "gRPC", "PostgreSQL", "OpenTelemetry"],
    featured: true,
  },
  {
    id: "event-sourcing",
    name: "Event-Sourced Ledger",
    desc: "Append-only ledger with CQRS projections, idempotent consumers and replayable state.",
    tags: ["backend"],
    stack: ["TypeScript", "Node", "Kafka", "PostgreSQL"],
  },
  {
    id: "design-system",
    name: "Motion Design System",
    desc: "Accessible component library with a documented motion language and reduced-motion fallbacks baked in.",
    tags: ["frontend"],
    stack: ["React", "Storybook", "Framer Motion", "Radix"],
  },
  {
    id: "anomaly-detection",
    name: "Anomaly Detection Service",
    desc: "Unsupervised anomaly detection on time-series with alerting and a feedback loop for label collection.",
    tags: ["data", "backend"],
    stack: ["Python", "scikit-learn", "Kafka", "Grafana"],
  },
];
