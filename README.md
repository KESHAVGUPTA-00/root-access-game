# root-access-game

> **Prank / Mini-Game Simulation Only:** This project is a harmless browser-based prank and code-cracking game built for fun and learning. It does not access real files, hardware, or system data.

A browser-based hacker simulation and passcode-cracking game built with **HTML**, **CSS**, and **JavaScript**. It starts with a player login screen, triggers a fullscreen breach alert using the entered player and PC details, and challenges the user to crack a 4-digit kill-switch PIN before the countdown runs out.

## Live Demo
Once GitHub Pages is enabled on `main` (`/ (root)`), your live link will be available at:
`https://KESHAVGUPTA-00.github.io/root-access-game/`

## Features
- **Player Login Trap Screen:** Collects player name, PC label, difficulty mode, and generates a unique session code before launching fullscreen mode.
- **Full-Screen Breach Takeover:** Displays simulated alert banners, countdown timers, file-encryption logs, and glitch effects.
- **4-Digit Kill-Switch Cracker (`crack`):** Guess the unique 4-digit PIN within the allowed tries and timer to purge the simulated breach (`EXACT` and `MISPLACED` clues).
- **Helper & Fun Commands:** Includes `help`, `hint`, `scan`, `trace`, `typer`, `matrix`, `safeexit`, and `clear`.
- **Themes & Sound Effects:** Switch between `RED`, `GRN`, `CYB`, and `AMB` themes with optional Web Audio API sound effects.

## Project Structure
- `index.html` — Page structure for the login screen, breach overlay, terminal HUD, and game-over screen.
- `style.css` — Themes, animations, CRT scanlines, glitch effects, and responsive layout.
- `script.js` — Session logic, countdown timer, PIN cracker game, Matrix rain, radar canvas, and sound effects.

## How to Run Locally
1. Clone or download the repository files (`index.html`, `style.css`, and `script.js`) into the same folder.
2. Open `index.html` in any modern web browser (or run it via **Live Server** in VS Code).
3. Enter test details on the login screen and click **LAUNCH MATCH & FULLSCREEN**.

## How to Exit Anytime
- Press `Esc` or `F11` to exit browser fullscreen.
- Click `EXIT FS` in the top bar or run `safeexit` in the terminal to exit fullscreen and pause the timer.
-
