<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GrandmasterStream - Chess with AI Commentary

Play chess, create rooms, and get AI-powered commentary for your games.

🌐 **Live Site**: https://adityaaryan.me/GrandmasterStream/

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your Gemini API key (optional, for AI commentary):
   ```bash
   export API_KEY=your_gemini_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173/GrandmasterStream/ in your browser

## Deploy to GitHub Pages

### Option 1: Manual Deployment (Recommended)

Run the deployment script:
```bash
./deploy.sh
```

This will:
1. Build the project
2. Deploy to the `gh-pages` branch
3. Make your site live at your GitHub Pages URL

### Option 2: GitHub Actions (Automatic)

The workflow in `.github/workflows/deploy.yml` will automatically deploy when you push to `main` (if GitHub Actions deployment is enabled in settings).

### Initial Setup (One-time)

⚠️ **Important**: After running `./deploy.sh` for the first time, you must configure GitHub Pages:

1. Go to your repository settings: https://github.com/Aditya-Aryan-6914/GrandmasterStream/settings/pages
2. Under "Build and deployment" → "Source"
3. Change from "main" to "**gh-pages**"
4. Select "/ (root)" as the folder
5. Click Save

Your site will be live within 1-2 minutes!

## Project Structure

```
├── components/        # React components (ChessBoard, Modal, etc.)
├── services/         # API services (Gemini AI)
├── views/           # Page components (Home, GameRoom)
├── App.tsx          # Main app component
├── index.tsx        # Entry point
└── vite.config.ts   # Build configuration
```

## Technologies

- React 19
- TypeScript
- Tailwind CSS
- Vite
- Google Gemini AI
- React Router

## Features

- ♟️ Full chess gameplay
- 🎮 Room-based multiplayer
- 🤖 AI commentary with Gemini
- 📱 Responsive design
- 🎨 Modern chess.com-inspired UI

