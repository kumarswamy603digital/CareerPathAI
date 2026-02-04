<p align="center">
  <img src="src/assets/logo_career_path.png" alt="CareerPath Logo" width="120" />
</p>

<h1 align="center">CareerPath</h1>

<p align="center">
  <strong>🚀 AI-Powered Career Discovery Platform</strong>
</p>

<p align="center">
  Discover your ideal career path through intelligent AI conversations, interactive visualizations, and personalized recommendations.
</p>

<p align="center">
  <a href="https://career-path-ai-three.vercel.app/">🌐 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠️ Tech Stack</a> •
  <a href="#getting-started">🏁 Getting Started</a>
</p>

---

## 🎯 Problem Statement

Millions of students and professionals struggle with career decisions due to:
- **Information Overload**: Too many career options without personalized guidance
- **Lack of Self-Awareness**: Difficulty understanding how personality traits align with careers
- **Static Resources**: Traditional career counseling is expensive and inaccessible
- **No Visual Context**: Hard to see career progression paths and relationships

## 💡 Our Solution

**CareerPath** revolutionizes career discovery through:

1. **🎙️ AI Voice Career Advisor** - Have natural voice conversations with an AI that understands your interests, personality, and goals to recommend perfect career matches

2. **🌳 Interactive Career Tree** - Explore 60+ careers in a beautiful, interactive flowchart visualization with smart filtering

3. **📊 Real-Time Market Data** - Access live salary data and job market demand statistics powered by BLS/Glassdoor APIs

4. **🧠 Personality-Based Matching** - Take our personality quiz to discover careers aligned with your unique traits

5. **👥 Community Forum** - Connect with others on similar career journeys, share experiences, and get advice

---

## ✨ Features

### 🤖 AI-Powered Discovery
| Feature | Description |
|---------|-------------|
| **Voice Conversations** | Real-time voice chat with AI career advisor using ElevenLabs |
| **Smart Recommendations** | AI analyzes your interests & personality to suggest ideal careers |
| **Text Chat Option** | Prefer typing? Use our text-based career chat assistant |

### 📈 Data-Driven Insights
| Feature | Description |
|---------|-------------|
| **Live Salary Data** | Real-time salary ranges from industry sources |
| **Job Market Demand** | Current hiring trends and growth projections |
| **Career Comparisons** | Side-by-side comparison of multiple careers |

### 🎨 Interactive Visualization
| Feature | Description |
|---------|-------------|
| **Career Tree** | Beautiful flowchart with 60+ interconnected careers |
| **Smart Filters** | Filter by personality type, interests, salary range |
| **Mobile-Optimized** | Touch-friendly controls with zoom and pan |

### 👤 Personalization
| Feature | Description |
|---------|-------------|
| **Assessment History** | Track your career exploration journey |
| **Career Shortlist** | Save and compare your top career picks |
| **PDF Export** | Download your results for offline reference |
| **Public Profiles** | Share your career journey with others |

### 🌐 Community
| Feature | Description |
|---------|-------------|
| **Discussion Forum** | Ask questions and share experiences |
| **Referral System** | Invite friends and grow the community |
| **Dark/Light Themes** | Comfortable viewing in any environment |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom design system
- **shadcn/ui** - Beautiful, accessible component library
- **React Flow** - Interactive node-based career visualization
- **Framer Motion** - Smooth animations and transitions

### Backend (Lovable Cloud)
- **Supabase** - PostgreSQL database with Row Level Security
- **Edge Functions** - Serverless API endpoints (Deno runtime)
- **Real-time Subscriptions** - Live data updates

### AI & APIs
- **Lovable AI Gateway** - Gemini 2.5 Flash for intelligent conversations
- **ElevenLabs** - Natural voice synthesis for AI advisor
- **BLS/Glassdoor APIs** - Live salary and job market data

### Infrastructure
- **Vite** - Lightning-fast build tooling
- **Vercel** - Edge deployment with global CDN

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│  Voice Chat │ Career Tree │  Dashboard  │  Community Forum │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬─────────┘
       │             │             │               │
       ▼             ▼             ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Edge Functions                    │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│career-advisor│ career-chat │ salary-data │   job-demand    │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬─────────┘
       │             │             │               │
       ▼             ▼             ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services & Database                    │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│  Lovable AI │ ElevenLabs  │  BLS API    │ Supabase Postgres│
└─────────────┴─────────────┴─────────────┴──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/career-path-ai.git

# Navigate to project directory
cd career-path-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

---

## 📱 Screenshots

### Home Page
The welcoming landing page introduces users to CareerPath's three core features: AI Career Advisor, Visual Career Tree, and Smart Filters.

### AI Voice Advisor
Real-time voice conversations with an AI that understands you and recommends careers based on your unique profile.

### Interactive Career Tree
Explore careers visually with our beautiful flowchart featuring 60+ careers, smart filters, and detailed information panels.

### Personalized Dashboard
Track your career exploration journey with assessment history, shortlisted careers, and exportable reports.

---

## 🎯 Key Differentiators

| Traditional Career Counseling | CareerPath |
|------------------------------|------------|
| ❌ Expensive ($100-500/session) | ✅ Free & accessible 24/7 |
| ❌ Limited availability | ✅ Instant AI conversations |
| ❌ Static, outdated information | ✅ Real-time market data |
| ❌ Text-heavy, boring interfaces | ✅ Beautiful visual exploration |
| ❌ One-size-fits-all advice | ✅ Personalized recommendations |
| ❌ No community support | ✅ Active discussion forum |

---

## 🔐 Security

- **Row Level Security (RLS)** - All database tables protected with granular access policies
- **Authentication** - Secure email-based auth with Supabase Auth
- **Data Privacy** - Users control their profile visibility
- **API Security** - Edge functions with proper CORS and validation

---

## 🗺️ Roadmap

- [ ] **Mobile App** - Native iOS/Android apps
- [ ] **LinkedIn Integration** - Import profile for better recommendations
- [ ] **Mentor Matching** - Connect with professionals in target careers
- [ ] **Learning Paths** - Curated courses for career transitions
- [ ] **Resume Builder** - AI-powered resume tailored to target careers

---

## 👥 Team

Built with ❤️ for the hackathon by passionate developers who believe everyone deserves access to quality career guidance.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>⭐ Star this repo if CareerPath helped you discover your path!</strong>
</p>

<p align="center">
  <a href="https://career-path-ai-three.vercel.app/">Try CareerPath Now →</a>
</p>
