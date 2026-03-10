# EthCC Who's This Face?

A quiz game where you identify prominent Web3 and crypto figures attending **EthCC Cannes 2026**. A photo is shown with two name choices — pick the right one, earn confetti. Pick wrong, and learn who it actually was.

## Getting Started

```bash
npm install
npm run dev       # Start the dev server
npm run build     # Compile to a single HTML file
npm run preview   # Preview the production build
```

## How It Works

- 47 speakers from 30+ Web3 projects (Ethereum Foundation, Aave, Uniswap, Ledger, Safe, Morpho, etc.)
- Each round shows a hexagonal portrait with two name options (same gender to keep it fair)
- Correct answer triggers a confetti animation
- Wrong answer reveals the person's role, project, and sector
- Final score displayed at the end

## Tech Stack

- **TypeScript** + **Vite**
- Vanilla JS — no framework
- CSS with dark Web3 aesthetic (neon accents, Space Grotesk / Sora fonts)

## Project Structure

```
src/
├── main.ts       # Entry point, image preloading, start screen
├── types.ts      # TypeScript interfaces (Speaker, QuizOption, GameState)
├── data.ts       # Speaker database (47 entries)
├── game.ts       # Game logic, shuffling, option generation
├── ui.ts         # UI rendering (cards, feedback, end screen)
├── confetti.ts   # Canvas-based confetti animation
└── style.css     # Styling and animations
```
