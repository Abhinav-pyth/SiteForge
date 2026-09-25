# SiteForge AI

AI-powered website builder that generates complete responsive websites from natural language descriptions.

## 🚀 Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/siteforge-ai)

### Manual Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the project**:
   ```bash
   vercel
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect the Vite configuration
5. Click "Deploy"

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
siteforge-ai/
├── src/
│   ├── components/      # React components
│   ├── lib/            # Utilities and AI logic
│   │   ├── ai.ts       # AI generation engine
│   │   ├── store.ts    # State management
│   │   ├── export.ts   # Export utilities
│   │   └── templates.ts # Template data
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies
```

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)

The project includes optimized Vercel configuration:
- **SPA Routing**: All routes redirect to `index.html` for client-side routing
- **Asset Caching**: Static assets cached for 1 year with immutable flag
- **Security Headers**: XSS protection and frame prevention

### Environment Variables

No environment variables required for basic functionality. The AI generation uses a mock engine by default.

To connect a real AI API in the future, add to `.env`:
```env
VITE_OPENAI_API_KEY=your_key_here
```

## 📦 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🎨 Features

- AI-powered website generation from natural language
- Live preview with desktop/tablet/mobile views
- 16 customizable section types
- 8 theme presets with full customization
- AI chat for real-time modifications
- Code export (HTML, React, JSON)
- Project management with localStorage persistence
- Undo/redo history
- Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+S)

## 📄 License

MIT
