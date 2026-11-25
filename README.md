# 12V DC Residential Wiring Training Board

Interactive 8-panel animated build storyboard, materials knolling bench, and live 12V DC residential wiring simulator & fault troubleshooter.

> **CRITICAL SAFETY RULE:** Label the training board, both 12V DC E26 LED bulbs, and your DIY 2-prong polarized test plug **"12V DC ONLY"**. Never connect this training board or DIY test lamp to 120V AC household wall power.

## Features

- **Theater Mode & 8-Panel Storyboard Grid**: Step through all 8 panels (`←`/`→`), auto-play at `0.75x` / `1.0x` / `1.5x` (`Space`), replay animations (`R`), or open the full grid (`G`).
- **BOM Knolling Bench (Panel 2)**: Interactive overhead layout of all 24 materials, devices, and tools with category filters and a checkable progress list.
- **Step-by-Step Animated Build (Panels 3–7)**:
  - **Step 1**: Framing `48" × 24"` plywood with three `2×4` studs, Main Panel enclosure, nail-on single-gang boxes, and ceiling octagon box.
  - **Step 2**: Inside the Main Panel — `+12V` blade fuse block, `-12V` Neutral Bus Bar, and Neutral-to-Ground bonding jumper.
  - **Craft Closeups**: `14/2` NM-B jacket ripping, `5/8"` strip gauge, clockwise vs. counter-clockwise J-hooks, and Wago 221 / wire-nut parallel pigtails.
  - **Step 3 (Circuit 1)**: `14/2` parallel outlets (`#1`–`#3`), breaking the brass hot-side tab on Outlet `#3` while preserving the silver neutral tab, and black-taped switch-loop wiring.
  - **Step 4 (Circuit 2)**: `14/2` + `14/3` 3-way lighting circuit with live X-ray SPDT contact diagram and 4-state truth table.
- **Live 12V Test Bench & Fault Lab (Panel 8)**: Toggle the 12V 5A PSU, Fuse #1/#2, and all switches; plug the DIY 12V test lamp into any of the 6 receptacle sockets; probe DC voltage or Neutral–Ground continuity on the Digital Multimeter; auto-verify the Step 5 inspection checklist; and practice troubleshooting **Blown Fuse #1**, **Unbroken Brass Tab**, and **Loose Red Traveler** faults.

## Local Preview

Zero-build static site — open directly via any static HTTP server:

```bash
python3 -m http.server 8080
```

## Live GitHub Pages

Once published via `publish_github.py`:
`https://jamesrichardson493.github.io/wiring-training-board/`
