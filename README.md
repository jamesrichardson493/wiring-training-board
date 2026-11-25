# 12V DC Residential Wiring Masterclass

14-panel beginner-friendly animated build storyboard, interactive parts encyclopedia, BOM knolling bench, hands-on wire-it-yourself terminal lab, and live 12V DC circuit simulator & fault troubleshooter.

> **CRITICAL SAFETY RULE:** Label the training board, both 12V DC E26 LED bulbs, and your DIY 2-prong polarized test plug **"12V DC ONLY"**. Never connect this training board or DIY test lamp to 120V AC household wall power.

## Architecture (Zero-Build Static)

- `index.html` — Studio HUD, 16:9 interactive SVG theater stage, director's script dock, and 14-panel storyboard grid
- `styles.css` — Dark anodized slate & light architectural drafting themes, glassmorphic HUD, and SVG path/flow animations
- `app.js` — 14 panel renderers, procedural Web Audio SFX (`SoundFX`), beginner physics/parts labs, live circuit solver, and 5-mode fault lab

## Highlights Across the 14 Panels

### Part 1 — Electricity & Parts Foundations (Beginner-Friendly)
1. **Electricity 101 (Water Pipe Analogy)**: Volts = pressure, Amps = flow, Load = work, and why electricity needs a closed loop.
2. **Meet the Wires & Romex Decoder**: `14/2` vs `14/3 NM-B` breakdown, Hot/Neutral/Ground color roles, plus a live Ground Fault demo.
3. **Anatomy of Every Part & Why We Need It**: 8-card parts encyclopedia + live `Normal 1.5A` vs `Overload 7A` fuse-melt simulation.
4. **Series vs. Parallel Experiment**: Side-by-side unplug test proving why residential outlets are always wired in parallel.

### Part 2 — Step-by-Step Build & Live Simulator
5. **Vision & Safety (`12V DC ONLY`)**: Blueprint laser scan + 3 clickable safety label stamps.
6. **Knolling Bench & 24-Item BOM**: Filterable parts & tools workbench with live completion progress.
7. **Step 1 · Framing & Boxes**: 4-beat animated `48" × 24"` plywood, `2×4` studs, Main Panel, nail-on boxes, and ceiling octagon box assembly.
8. **Step 2 · Main Panel Cutaway**: `+12V` blade fuse block, `-12V` Neutral Bus, Ground Bus, Main Bonding Jumper, and Main vs. Subpanel bonding toggle.
9. **Craft Lab 1 · Strip & Screw Torque**: `14/2` NM-B `5/8"` strip gauge + live Clockwise vs. Counter-Clockwise screw-torque physics simulator.
10. **Craft Lab 2 · Pigtails & Parallel Continuity**: Interactive Wago 221 levers / wire nuts + "Remove Outlet #1" live parallel-vs-series test.
11. **Step 3 · Circuit 1 (Parallel & Half-Hot)**: `14/2` routing + pliers animation to snap Outlet #3's brass hot tab while keeping silver neutral intact + NEC taped switch loop.
12. **Step 4 · Circuit 2 (3-Way Lighting)**: `14/2` + `14/3` travelers with synchronized X-ray SPDT blades and 4-state truth table.
13. **Hands-On Wire-It-Yourself Lab**: 3 progressive click-to-wire terminal challenges with real-time error feedback.
14. **Step 5 · Live Test Bench & Fault Lab**: Tethered DIY 12V test lamp, `V DC` / `Ω` DMM with continuity beep, Conventional vs. Electron flow, auto-verifying Inspection Certificate, and 5 fault troubleshooting drills.

## Live Site & Local Preview

- **Live GitHub Pages:** https://jamesrichardson493.github.io/wiring-training-board/
- **Local Server:** `python3 -m http.server 8080`
