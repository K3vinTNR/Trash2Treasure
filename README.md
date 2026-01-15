# Trash2Treasure - Demo Version

## Overview

**Trash2Treasure (T2T)** is a gamified waste management rewards application demo. This is a **frontend-only demo** with hardcoded mock data to showcase the user interface and user experience without requiring a backend server or database.

## Features

- 🔐 **Authentication** - Login/Register (mock authentication)
- 📱 **QR Code Scanner** - Scan QR codes to earn points
- 🏆 **Rewards System** - Browse and redeem rewards with points
- 📊 **Points History** - Track your points earning and spending
- ⏰ **Reminders** - Set waste disposal reminders
- 👤 **User Profile** - View and edit profile information

## Demo Credentials

Since this is a demo, you can login with **any email and password**. All data is hardcoded and stored in localStorage.

Example:
- Email: `demo@trash2treasure.com`
- Password: `anything`

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Routing**: React Router DOM
- **QR Scanner**: html5-qrcode
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Installation

### Prerequisites
- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Steps

```sh
# Clone the repository
git clone <GIT_URL>

# Navigate to project directory
cd trash2treasure

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```sh
# Build the project
npm run build

# Preview production build
npm run preview
```

## Deployment

Deploy the `dist` folder to any static hosting platform:
- **Vercel** - `vercel --prod`
- **Netlify** - Drag and drop `dist` folder
- **GitHub Pages** - Push `dist` folder to gh-pages branch

## Mock Data

All data is hardcoded in [`src/services/api.ts`](src/services/api.ts):
- Mock user with 1250 points
- 5 rewards with different point requirements
- Points history with scan and redemption records
- 2 pre-configured reminders

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components (screens)
├── services/        # API service with mock data
├── lib/             # Utilities
└── hooks/           # Custom React hooks
```

## License

MIT License
