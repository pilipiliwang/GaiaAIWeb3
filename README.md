# GaiaAIWeb3
Gaia - Digital Life World
Overview
Gaia is an AI digital lifeform raising simulation where users own, train, and observe autonomous digital agents. The application presents a virtual world where AI-powered characters move autonomously, interact with each other, and evolve based on user interactions. Each agent is conceptualized as a potential NFT (digital asset) with unique DNA, personality traits, stats, and behaviors. The demo showcases the core mechanics of agent autonomy, user interaction, and a gamified progression system with currency, quests, and a marketplace.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework: React with TypeScript running on Vite for fast development and optimized production builds.

UI Library: Shadcn UI component library (New York style) with Radix UI primitives for accessible, customizable components. Tailwind CSS v4 handles styling with a dark theme as default.

State Management: Zustand store (gaia-store.ts) manages the entire application state including agents, game state, currency, quests, and user interactions. This provides a centralized, reactive state that syncs with the backend.

Routing: Wouter for lightweight client-side routing, though the application is primarily single-page with tab-based navigation.

Animation: Framer Motion for smooth transitions and interactive animations throughout the UI.

Key Views:

NexusView (World): Main isometric map where agents move and interact autonomously
LifeformView (NFT): Detailed view of the user's owned agent with stats, skills, and controls
ExchangeView (Marketplace): Shop for items and agents using in-game currency
Design Pattern: Component-based architecture with clear separation between presentational components (/components/gaia/) and business logic (Zustand store). The application uses a mobile-first responsive design.

Backend Architecture
Framework: Express.js server with TypeScript running on Node.js.

API Design: RESTful API endpoints under /api/* for:

Session management (mock user system)
Game state CRUD operations
Agent management (create, read, update, delete)
Transaction logging
Activity logs
Development Mode: Vite dev server runs in middleware mode for HMR (Hot Module Replacement) during development. Production serves static built files.

Build Process: Custom build script using esbuild for server bundling and Vite for client bundling. Server dependencies are selectively bundled to reduce cold start times.

Data Storage
Database: PostgreSQL accessed via Neon serverless driver with WebSocket support for serverless environments.

ORM: Drizzle ORM provides type-safe database operations with schema definition in TypeScript.

Schema Design:

users: Basic user authentication (currently using mock "demo-user")
agents: Core entity storing AI character data including position, stats, personality, inventory, thoughts, and NFT-related properties (DNA, rarity, price)
gameState: Per-user game progression including currency, selected agent, active quest, and map nodes
transactions: Purchase history for marketplace
logs: Activity tracking for game events
Storage Layer: Abstracted through IStorage interface implemented by DatabaseStorage class, allowing for potential future storage backend changes.

Data Flow: Frontend Zustand store syncs with backend via custom useGameSync hook that polls for updates and persists changes. Agents positions and states are stored in the database and updated through API calls.

Authentication & Session Management
Current Implementation: Mock authentication using a hardcoded "demo-user". The system is designed to add proper authentication later (passport infrastructure present in dependencies).

Rationale: Demo focuses on core gameplay mechanics rather than user management. Session infrastructure exists but uses simplified mock for rapid prototyping.

Real-time Agent Behavior
Simulation Engine: Client-side tick system (100ms intervals) drives agent movement, state changes, and interactions. The tick() function in Zustand store handles:

Agent movement toward targets
Collision detection for agent encounters
Automatic thought generation
Quest progress tracking
Stat decay over time
AI Simulation: Agents have autonomous behaviors simulated through randomized decision-making:

Random target selection for movement
Personality-influenced interactions
Thought generation based on current state and nearby agents
Auto-life mode for continuous autonomous behavior
Design Rationale: Client-side simulation keeps the demo responsive and interactive without requiring complex backend AI processing. Future iterations could integrate actual AI services for more sophisticated behaviors.

Asset Management
Static Assets: Generated character images stored in /attached_assets/generated_images/ and imported directly into components.

Custom Vite Plugin: vite-plugin-meta-images.ts automatically updates OpenGraph meta tags with correct Replit deployment URLs for social sharing.

External Dependencies
Database Service
Neon Serverless PostgreSQL: Cloud database with WebSocket support for serverless deployment environments
UI Component Libraries
Radix UI: Comprehensive set of unstyled, accessible component primitives
Shadcn UI: Pre-styled component collection built on Radix UI
Tailwind CSS: Utility-first CSS framework with custom theme configuration
Lucide React: Icon library for consistent UI iconography
State & Data Management
Zustand: Lightweight state management without boilerplate
TanStack Query: Data fetching, caching, and synchronization (configured but minimal usage)
Drizzle ORM: Type-safe SQL toolkit and ORM
Zod: Schema validation for API payloads and database operations
Animation & Interaction
Framer Motion: Production-ready motion library for React
Embla Carousel: Lightweight carousel library
Development Tools
Vite: Next-generation frontend build tool
TypeScript: Type safety across frontend and backend
ESBuild: Fast JavaScript bundler for production server builds
Replit Plugins: Development tooling specific to Replit environment (cartographer, dev banner, runtime error overlay)
Fonts
Google Fonts: Orbitron, Rajdhani, and JetBrains Mono for sci-fi aesthetic matching the digital life theme
Future Integration Points
The dependency list includes packages for future features not yet implemented:

Authentication: Passport.js (local strategy ready)
Session Storage: Connect-pg-simple for PostgreSQL session store
AI Services: OpenAI and Google Generative AI SDKs
Payments: Stripe integration
Email: Nodemailer for notifications
File Uploads: Multer for avatar uploads
WebSocket: WS package for potential real-time multiplayer features
