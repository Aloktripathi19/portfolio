export const profile = {
  name: "Alok Ram Tripathi",
  firstName: "Alok",
  role: "Full-Stack Software Engineer",
  cert: "AWS Certified Developer – Associate",
  location: "India",
  email: "tripathialok1919@gmail.com",
  phone: "+91 96213 01339",
  phoneHref: "tel:+919621301339",
  resume: "/Alok_Ram_Tripathi_Resume.pdf",
  siteUrl: "https://alok-tripathi.vercel.app",
  socials: {
    github: "https://github.com/Aloktripathi19",
    linkedin: "https://www.linkedin.com/in/alok-tripathi19",
    hackerrank: "https://www.hackerrank.com/profile/tripathialok1919",
  },
  summary:
    "Full-stack software engineer and AWS Certified Developer (Associate) with 2+ years of professional experience architecting and shipping production web applications used by 10,000+ people. I take full ownership of features end to end: SEO-optimized React and Next.js frontends, REST APIs engineered in Python and Node.js, and PostgreSQL data models for real business workflows, deployed as containerized services on AWS with Docker and CI/CD.",
  rotatingRoles: [
    "production web apps",
    "RAG pipelines with pgvector",
    "SEO-first Next.js frontends",
    "REST APIs in Python & Node",
    "containerized services on AWS",
  ],
};

export const stats = [
  { value: 10000, suffix: "+", label: "Production users across products I ship" },
  { value: 3, suffix: "", label: "Production client products owned" },
  { value: 2, suffix: "+ yrs", label: "Professional engineering experience" },
  { value: 30, suffix: "+", label: "Public repositories on GitHub" },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  type: string;
  highlights: string[];
  stack: string[];
  stackGroups?: { label: string; items: string[] }[];
};

export const experience: Experience[] = [
  {
    role: "Software Engineer",
    company: "MandS Consulting",
    period: "May 2025 — Nov 2026",
    type: "Full-time",
    highlights: [
      "Drove end-to-end ownership of features for three client products, including Braided (5,500+ users) and Hey Coach (4,000+ users, growing monthly), from design review to production release.",
      "Built a production RAG pipeline on Braided using OpenAI embeddings and a pgvector store, with semantic chunking and similarity search to ground LLM responses in product data, cut hallucinations, and stream cited answers to users.",
      "Engineered SEO-optimized, server-rendered interfaces in Next.js and React, strengthening search crawlability and cutting page-load times on high-traffic product pages.",
      "Architected a shared library of reusable, responsive Tailwind CSS components that accelerates feature delivery and enforces one design system across products.",
      "Architected and optimized PostgreSQL schemas, indexes, and queries powering complex business workflows, driving faster query responses and stronger reliability as usage scales.",
      "Engineered backend services and REST APIs in Python that powered data exchange across the frontend, backend, and database layers for 10,000+ combined users.",
      "Delivered a cross-platform mobile app in Flutter with a responsive UI and full REST API integration.",
      "Overhauled legacy modules to eliminate technical debt and accelerate page loads, partnering with product and design to scope and ship requirements on time.",
    ],
    stack: ["Next.js", "React", "Python", "PostgreSQL", "pgvector", "OpenAI", "Tailwind CSS", "Flutter", "AWS", "Docker"],
    stackGroups: [
      {
        label: "AI / GenAI",
        items: ["RAG", "OpenAI", "LLM APIs", "Embeddings", "pgvector", "Semantic Search", "Semantic Chunking", "Streaming Responses"],
      },
      { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "SSR / SEO", "Flutter"] },
      { label: "Backend & Data", items: ["Python", "REST APIs", "Node.js", "PostgreSQL", "Schema Design", "Query Tuning"] },
      {
        label: "Cloud & DevOps",
        items: ["AWS ECS", "ECR", "EC2", "ALB", "Route 53", "IAM", "CodePipeline", "CodeBuild", "Docker", "CI/CD"],
      },
      { label: "Workflow", items: ["Git", "Bitbucket", "Jira", "Agile / Scrum", "Code Review"] },
    ],
  },
  {
    role: "MERN Stack Developer Intern",
    company: "Vector India Pvt. Ltd.",
    period: "Jun 2024 — Mar 2025",
    type: "Internship",
    highlights: [
      "Engineered full-stack applications with MongoDB, Express.js, React.js, and Node.js, implementing JWT authentication, CRUD REST APIs, and client-side routing.",
      "Shipped applications to Vercel and Render through Git and GitHub workflows, contributing to peer code reviews and clean-code standards.",
    ],
    stack: ["MongoDB", "Express.js", "React", "Node.js", "JWT", "Vercel", "Render"],
  },
];

export type FeaturedWork = {
  name: string;
  tagline: string;
  metric: string;
  metricLabel: string;
  description: string;
  points: string[];
  stack: string[];
  accent: "cyan" | "violet";
};

export const featuredWork: FeaturedWork[] = [
  {
    name: "Braided",
    tagline: "AI-grounded product experience",
    metric: "5,500+",
    metricLabel: "active users",
    description:
      "Client product where I own features from design review to release, including a production retrieval-augmented generation pipeline that answers questions from real product data.",
    points: [
      "OpenAI embeddings + pgvector with semantic chunking and similarity search",
      "Streamed, cited answers that cut LLM hallucinations",
      "Python REST services and tuned PostgreSQL schemas",
    ],
    stack: ["RAG", "OpenAI", "Embeddings", "pgvector", "Next.js", "Python", "PostgreSQL"],
    accent: "cyan",
  },
  {
    name: "Hey Coach",
    tagline: "Coaching platform, web + mobile",
    metric: "4,000+",
    metricLabel: "users, growing monthly",
    description:
      "Client product spanning server-rendered web dashboards and a cross-platform Flutter app, backed by REST APIs and a shared Tailwind design system.",
    points: [
      "SEO-optimized, server-rendered Next.js interfaces",
      "Shared Tailwind component library across products",
      "Flutter mobile app with full REST API integration",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Flutter", "REST APIs"],
    accent: "violet",
  },
];

export type Project = {
  name: string;
  description: string;
  stack: string[];
  repo: string;
  live?: string;
  category: "AI" | "Backend" | "Full-Stack" | "Mobile" | "Tooling";
  featured?: boolean;
};

const gh = (r: string) => `https://github.com/Aloktripathi19/${r}`;

export const projects: Project[] = [
  {
    name: "Docent — RAG Knowledge Assistant",
    description:
      "Chat with your documents and get answers with receipts. Upload PDFs, text or Markdown; answers are grounded only in your files, streamed in real time, and every claim links back to the exact passage and page. Choose OpenAI GPT or Claude on AWS Bedrock.",
    stack: ["Next.js 15", "FastAPI", "pgvector", "OpenAI", "AWS Bedrock", "Tailwind 4"],
    repo: gh("Rag-Assistant"),
    category: "AI",
    featured: true,
  },
  {
    name: "Flutter GPT Realtime Assistant",
    description:
      "Cross-platform voice assistant on OpenAI's Realtime API over WebSockets, with speech-to-text input, streamed GPT replies, audio playback and a chat-style UI across Android, iOS, web and desktop.",
    stack: ["Flutter", "Dart", "OpenAI Realtime", "WebSockets"],
    repo: gh("flutter-gpt-realtime-assistant"),
    category: "Mobile",
    featured: true,
  },
  {
    name: "Trip Management API",
    description:
      "Backend service for creating trips and moving them through a validated status lifecycle, with migrations, a Dockerized Postgres stack, OpenAPI docs and a pytest suite.",
    stack: ["Python", "FastAPI", "SQLAlchemy 2", "PostgreSQL", "Alembic", "Docker"],
    repo: gh("Trip-Management"),
    category: "Backend",
    featured: true,
  },
  {
    name: "Lead Tracker",
    description:
      "Full-stack lead pipeline: create leads, update status, search and list. Typed Express API with a testable app/server split and an in-memory Mongo for zero-setup runs.",
    stack: ["TypeScript", "React", "Vite", "Express", "MongoDB"],
    repo: gh("lead-tracker"),
    category: "Full-Stack",
  },
  {
    name: "Spin-Cycle — Laundry Platform",
    description:
      "Marketplace to browse laundry shops, compare services and prices, and contact owners via WhatsApp or phone, with an admin dashboard to verify and approve listings.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    repo: gh("Shop-Cycle"),
    live: "https://shop-cycle.vercel.app",
    category: "Full-Stack",
  },
  {
    name: "dspyFlow",
    description:
      "CLI that rewrites vague prompts into precise questions, answers with chain-of-thought reasoning, and summarizes results into concise bullet points.",
    stack: ["Python", "DSPy", "Typer", "OpenAI"],
    repo: gh("dspyFlow"),
    category: "AI",
  },
  {
    name: "Agent Health Checker",
    description:
      "Async CLI that checks agent health against an API with concurrent aiohttp requests, env-based config, verbose logging and pytest coverage.",
    stack: ["Python", "asyncio", "aiohttp", "FastAPI", "pytest"],
    repo: gh("agent-health-checker"),
    category: "Tooling",
  },
  {
    name: "Post Management",
    description:
      "MERN CRUD application for creating, editing and managing posts, deployed to Vercel through a GitHub workflow.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    repo: gh("Post-Management"),
    live: "https://post-management-sigma.vercel.app",
    category: "Full-Stack",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "SQL", "HTML5", "CSS3"] },
  {
    group: "Frontend",
    items: ["React.js", "Next.js", "Tailwind CSS", "Bootstrap", "Flutter", "Responsive UI", "SEO-Optimized UI"],
  },
  { group: "Backend", items: ["Node.js", "Express.js", "REST APIs", "JWT Authentication"] },
  {
    group: "AI / GenAI",
    items: ["RAG Pipelines", "pgvector", "Embeddings", "Semantic Search", "LLM APIs", "OpenAI", "LLM Integration"],
  },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  {
    group: "Cloud & DevOps",
    items: ["AWS ECS", "ECR", "EC2", "VPC", "Route 53", "ALB", "IAM", "CodePipeline", "CodeBuild", "Docker", "CI/CD"],
  },
  { group: "Tools", items: ["Git", "GitHub", "Bitbucket", "Jira", "Postman", "Agile / Scrum", "Code Review"] },
];

export const certifications: { title: string; issuer: string; highlight?: boolean; tag?: string }[] = [
  { title: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", highlight: true },
  { title: "Building with the Claude API", issuer: "Anthropic Academy · Aug 2026", tag: "AI" },
  { title: "Model Context Protocol: Advanced Topics", issuer: "Anthropic Academy · Aug 2026", tag: "AI" },
  { title: "Claude with Amazon Bedrock", issuer: "Anthropic Academy · Aug 2026", tag: "AI · AWS" },
  { title: "Frontend Developer (React)", issuer: "HackerRank · Mar 2025 · ID F7B45AE4CB72" },
  { title: "MERN Stack Full-Stack Web Development Training", issuer: "Vector India Pvt. Ltd." },
  { title: "AI/ML for Geodata Analysis — Participation", issuer: "ISRO" },
];

export const education = {
  degree: "B.Tech, Information Technology",
  school: "Mahakal Institute of Technology",
  location: "Ujjain, Madhya Pradesh",
  period: "Aug 2019 — May 2023",
  grade: "CGPA 7.50 / 10",
};

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "play", label: "Play" },
  { id: "contact", label: "Contact" },
];
