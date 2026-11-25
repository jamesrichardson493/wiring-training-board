(function () {
  'use strict';

  // =========================================================================
  // 1. PROCEDURAL WEB AUDIO ENGINE (Zero external audio files)
  // =========================================================================
  const SoundFX = {
    enabled: false,
    ctx: null,

    ensureCtx() {
      if (!this.enabled) return null;
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    },

    click() {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    },

    snap() {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    },

    beep() {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2048, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    },

    spark() {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.18);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    },

    chime() {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.075);
        gain.gain.setValueAtTime(0.001, now + i * 0.075);
        gain.gain.linearRampToValueAtTime(0.09, now + i * 0.075 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.075 + 0.26);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.075);
        osc.stop(now + i * 0.075 + 0.28);
      });
    }
  };

  // =========================================================================
  // 2. STORYBOARD PANELS, BOM & WIRE-IT-YOURSELF CHALLENGES
  // =========================================================================
  const PANELS = [
    {
      id: 1,
      code: 'SCENE 01',
      phase: 'Electricity 101',
      durationMs: 8500,
      shortTitle: 'Electricity 101',
      title: 'Electricity 101: Volts, Amps, Loads & The Closed Loop',
      narration:
        'Never wired anything before? Think of electricity just like water in a loop of pipe. Voltage (12V) is the pump pressure pushing electrons, Current (Amps) is the flow rate, the Light Bulb is a water wheel doing work, and a Switch is a shutoff valve. Electricity ONLY flows when the loop is completely closed back to the source!',
      callouts: [
        { tag: 'VOLTS (V)', tone: 'warning', text: 'Electrical pressure. Our 12V DC supply pushes gently—strong enough for LEDs, far too low to shock skin.' },
        { tag: 'AMPS (A)', tone: 'primary', text: 'Amount of electrical flow. More bulbs or bigger loads draw more Amps (our fuses guard at 5A).' },
        { tag: 'CLOSED LOOP', tone: 'success', text: 'Click the Switch Valve on the circuit to open/close the loop and watch flow start & stop.' }
      ]
    },
    {
      id: 2,
      code: 'SCENE 02',
      phase: 'Wire Anatomy',
      durationMs: 9000,
      shortTitle: 'Meet the Wires',
      title: 'Meet the Wires: Hot, Neutral, Ground & Romex Numbers (14/2 vs 14/3)',
      narration:
        'Household Romex cable bundles multiple color-coded wires inside one protective jacket. Click each wire below to see its job—and test a "Ground Fault" to watch why the bare copper safety ground exists even though zero current flows through it normally.',
      callouts: [
        { tag: '14/2 vs 14/3', tone: 'primary', text: '14 = wire thickness (14 AWG, rated 15A). /2 or /3 counts the colored insulated wires (ground is always bonus!).' },
        { tag: 'HOT & NEUTRAL', tone: 'warning', text: 'Black (+12V Hot) brings energy IN to the load; White (-12V Neutral) carries spent current BACK home.' },
        { tag: 'GROUND SAFETY', tone: 'error', text: 'Bare copper stays at 0A normally—if a loose hot wire touches metal, Ground safely trips the fuse!' }
      ]
    },
    {
      id: 3,
      code: 'SCENE 03',
      phase: 'Parts Guide',
      durationMs: 9500,
      shortTitle: 'Parts & Why Needed',
      title: 'Anatomy of Every Part: What Each Component Does & Why We Need It',
      narration:
        'Before building, meet every piece of hardware on your board. Click any of the 8 part cards to read what it is, why we need it, and what real-home component it mimics—or test the interactive Fuse Overload button to see why fuses prevent fires.',
      callouts: [
        { tag: 'FUSE BLOCK', tone: 'error', text: 'Click "Test 7A Overload" on the stage to watch a 5A fuse intentionally sacrifice itself to save the wires.' },
        { tag: 'BUS BARS', tone: 'warning', text: 'Brass bars act like power strips inside the panel—keeping all White Neutrals and Bare Grounds neat.' },
        { tag: 'ENCYCLOPEDIA', tone: 'primary', text: 'Read the full "What It Is / Why Needed / Real-Home Equivalent" breakdown in the right drawer.' }
      ]
    },
    {
      id: 4,
      code: 'SCENE 04',
      phase: 'Circuit Basics',
      durationMs: 8500,
      shortTitle: 'Series vs Parallel',
      title: 'Series vs. Parallel: Why Homes ALWAYS Wire Outlets in Parallel',
      narration:
        'There are two ways to connect multiple outlets or bulbs: Series (one single chain) or Parallel (each gets its own branch). Click "Unplug Bulb #1" to see why Series wiring fails for homes while Parallel keeps every outlet at full 12V independently.',
      callouts: [
        { tag: 'SERIES FAIL', tone: 'error', text: 'Voltage splits (6V + 6V = dim!) and unplugging one lamp kills every outlet downstream.' },
        { tag: 'PARALLEL WIN', tone: 'success', text: 'Every outlet receives full 12.0V across Hot & Neutral, and unplugging one never affects the others.' },
        { tag: 'OUR BOARD', tone: 'primary', text: 'Outlets #1, #2, and #3 on our training board all wire in Parallel using pigtails.' }
      ]
    },
    {
      id: 5,
      code: 'SCENE 05',
      phase: 'Goal & Safety',
      durationMs: 7500,
      shortTitle: 'Vision & 12V Safety',
      title: 'Project Vision & Critical Safety Rule ("12V DC ONLY")',
      narration:
        'Now that you know how electricity, wires, and parts work, here is our finished 2 ft × 4 ft mock wall powered by a safe 12V DC 5A supply. You get real-world practice with Romex, panel bonding, parallel outlets, half-hot splitting, and 3-way switches—with zero shock hazard.',
      callouts: [
        { tag: 'CRITICAL', tone: 'warning', text: 'Label the board, both 12V DC E26 bulbs, and your DIY test plug "12V DC ONLY".' },
        { tag: 'NEVER AC', tone: 'error', text: 'Never plug the board or DIY test lamp into a 120V household wall outlet.' },
        { tag: 'EXPLORE', tone: 'primary', text: 'Click the 3 "12V DC ONLY" stamps on the blueprint to inspect each safety rule.' }
      ]
    },
    {
      id: 6,
      code: 'SCENE 06',
      phase: 'Bill of Materials',
      durationMs: 8500,
      shortTitle: 'Knolling Bench',
      title: 'Workshop Kit & Interactive 24-Item BOM ("Knolling Bench")',
      narration:
        'Lay out all 24 materials and tools across 5 zones before your first cut. Check off items you already own in the right-hand BOM drawer, or click any component on the bench to inspect its exact role in the build.',
      callouts: [
        { tag: 'ROMEX', tone: 'primary', text: '25 ft 14/2 (Black/White/Bare) + 15 ft 14/3 (Black/Red/White/Bare) for 3-way travelers.' },
        { tag: '12V BULBS', tone: 'warning', text: 'Use RV/Marine 12V DC E26 LED bulbs—120V household bulbs will not work properly.' },
        { tag: 'BOX TIP', tone: 'success', text: '4 single-gang + 1 octagon box work great; a 2-gang or extra box puts 3-Way B on the right stud.' }
      ]
    },
    {
      id: 7,
      code: 'SCENE 07',
      phase: 'Step 1 · Carpentry',
      durationMs: 7500,
      shortTitle: 'Frame & Boxes',
      title: 'Step 1: Framing the 48"×24" Mock Wall & Mounting Boxes',
      narration:
        'Screw three 2-foot 2×4 studs vertically onto the plywood sheet. Mount the Main Panel enclosure on the left stud, nail-on single-gang boxes onto the center and right studs with 1/2" drywall standoffs, and mount the ceiling octagon box top-center.',
      callouts: [
        { tag: 'FRAMING', tone: 'primary', text: '1-5/8" or 2" wood screws anchor the 3 vertical studs flush with the 24" height.' },
        { tag: 'BOX DEPTH', tone: 'primary', text: 'Align nail-on box tabs forward ~1/2" just like real drywall framing.' },
        { tag: 'BEATS 1–4', tone: 'success', text: 'Use Beat 1–4 buttons above the stage to step through each mounting phase.' }
      ]
    },
    {
      id: 8,
      code: 'SCENE 08',
      phase: 'Step 2 · Main Panel',
      durationMs: 8000,
      shortTitle: 'Main Panel & Bond',
      title: 'Step 2: Inside the "Main Panel" — Fuse Block & Neutral-Ground Bond',
      narration:
        'Land +12V positive onto the blade fuse block main bus and -12V negative onto the brass Neutral Bus Bar. Add a copper bonding jumper between the Neutral Bus and Ground Bus—mirroring how a real residential main service panel establishes ground reference.',
      callouts: [
        { tag: 'HOT (+)', tone: 'error', text: '12V+ feeds Fuse #1 (5A Outlets) and Fuse #2 (5A 3-Way Lighting).' },
        { tag: 'NEUTRAL (-)', tone: 'primary', text: '12V- lands on the Neutral Bus; every white circuit wire returns here.' },
        { tag: 'NEC BOND', tone: 'warning', text: 'Toggle "Main vs Subpanel" on the cutaway to see why bonding happens ONLY at the main panel.' }
      ]
    },
    {
      id: 9,
      code: 'SCENE 09',
      phase: 'Craft Lab 1',
      durationMs: 8000,
      shortTitle: 'Strip & Screw Torque',
      title: 'Craft Lab 1: Stripping 14/2 NM-B & Clockwise J-Hook Torque Physics',
      narration:
        'Rip 6–8" of outer Romex jacket cleanly and strip 5/8" insulation without nicking copper. Always bend J-hooks clockwise around brass and silver screws—click "Torque Screw ↻" to watch why clockwise tightens copper inward while counter-clockwise pushes it out!',
      callouts: [
        { tag: '5/8" STRIP', tone: 'primary', text: 'Exact 5/8" bare copper length wraps 270° around a terminal screw with zero insulation under the head.' },
        { tag: 'CLOCKWISE', tone: 'success', text: 'Clockwise J-hook cinches tighter into the screw shank as you drive the screw.' },
        { tag: 'TRY IT', tone: 'warning', text: 'Toggle Clockwise vs Counter-CW and click "Torque Screw ↻" to observe the physics.' }
      ]
    },
    {
      id: 10,
      code: 'SCENE 10',
      phase: 'Craft Lab 2',
      durationMs: 8000,
      shortTitle: 'Pigtails & Continuity',
      title: 'Craft Lab 2: Wago 221 vs. Wire Nuts & Why Parallel Pigtails Matter',
      narration:
        'Use Wago 221 lever connectors or wire nuts to join incoming, outgoing, and pigtail wires in parallel. Click "Remove Outlet #1" to prove why pigtailing keeps downstream Outlets #2 and #3 energized even if a device fails or is removed!',
      callouts: [
        { tag: 'WAGO 221', tone: 'warning', text: 'Click the 3 orange levers on the Wago block to clamp Line, Load, and Pigtail cleanly.' },
        { tag: 'PARALLEL', tone: 'success', text: 'With pigtails, removing Outlet #1 leaves Outlets #2 and #3 powered.' },
        { tag: 'TERMINALS', tone: 'primary', text: 'Black (Hot) → Brass · White (Neutral) → Silver · Bare Copper → Green.' }
      ]
    },
    {
      id: 11,
      code: 'SCENE 11',
      phase: 'Step 3 · Circuit 1',
      durationMs: 8500,
      shortTitle: 'Parallel & Half-Hot',
      title: 'Step 3: Circuit 1 — Parallel Outlets & Half-Hot Switch Loop (14/2)',
      narration:
        'Run 14/2 Romex from Fuse #1 through Outlets #1, #2, and #3 with 1/2" insulated staples. On Outlet #3, snap off ONLY the brass hot-side connecting tab (leave the silver neutral tab intact!), then wire a 14/2 switch loop to the single-pole switch.',
      callouts: [
        { tag: 'BREAK TAB', tone: 'warning', text: 'Click "Break / Restore Brass Tab" in the macro view to see how the unbroken tab backfeeds!' },
        { tag: 'SILVER OK', tone: 'success', text: 'Keep the silver neutral tab whole so both top and bottom sockets share the white return.' },
        { tag: 'TAPE CODE', tone: 'error', text: 'Wrap black tape on both ends of the white switch-loop wire to re-identify it as HOT.' }
      ]
    },
    {
      id: 12,
      code: 'SCENE 12',
      phase: 'Step 4 · Circuit 2',
      durationMs: 8500,
      shortTitle: '3-Way Lighting (14/3)',
      title: 'Step 4: Circuit 2 — 3-Way Lighting & 14/3 Travelers (SPDT X-Ray)',
      narration:
        'Feed 14/2 from Fuse #2 to 3-Way Switch A’s dark Common screw. Bridge Switch A and Switch B with 14/3 Romex (Black and Red travelers on the two brass screws), then run 14/2 from Switch B’s dark Common screw up to the ceiling E26 lamp holder.',
      callouts: [
        { tag: 'COMMON', tone: 'error', text: 'Dark screw = Common (Power In on Switch A, Switched Out on Switch B).' },
        { tag: 'TRAVELERS', tone: 'warning', text: 'Black & Red wires from 14/3 Romex land on the two Brass screws of each switch.' },
        { tag: 'LIVE X-RAY', tone: 'primary', text: 'Click Switch A, Switch B, or Auto-Cycle to watch the pivoting SPDT contacts.' }
      ]
    },
    {
      id: 13,
      code: 'SCENE 13',
      phase: 'Hands-On Lab',
      durationMs: 9000,
      shortTitle: 'Wire-It-Yourself',
      title: 'Interactive Wiring Challenge: Terminate the Screws Yourself!',
      narration:
        'Put your knowledge to the test before powering up! Select a conductor wire, then click its matching Brass, Silver, Green, or Common terminal screw across 3 progressive challenges. Wrong pairings warn immediately; clean wiring unlocks the checkoff.',
      callouts: [
        { tag: 'STEP 1', tone: 'primary', text: 'Pick a conductor wire in the left palette (or switch challenges in the right drawer).' },
        { tag: 'STEP 2', tone: 'warning', text: 'Click the correct terminal screw on the device—don’t forget to break the Brass tab in Lab #2!' },
        { tag: 'SOUND FX', tone: 'success', text: 'Enable Sound in the top bar for tactile snaps, warning buzzes, and victory chimes.' }
      ]
    },
    {
      id: 14,
      code: 'SCENE 14',
      phase: 'Step 5 · Live Bench',
      durationMs: 10500,
      shortTitle: 'Live Bench & Faults',
      title: 'Step 5: Live 12V Test Bench, Audible DMM & 5-Mode Fault Lab',
      narration:
        'Power on the 12V supply, plug your DIY 12V test lamp into any of the 6 receptacle sockets, probe DC voltage or Neutral–Ground continuity on the multimeter, switch between Conventional and Electron flow, and diagnose 4 real-world wiring faults!',
      callouts: [
        { tag: 'TEST LAMP', tone: 'warning', text: 'Click any of the 6 outlet sockets to move the DIY 12V test lamp and measure voltage.' },
        { tag: 'INSPECTION', tone: 'success', text: 'Complete all 3 Step-5 checks in the drawer to earn your PASSED Inspection Seal.' },
        { tag: 'FAULT LAB', tone: 'error', text: 'Inject Blown Fuse, Unbroken Tab, Loose Red Traveler, or Open Neutral—then click the board to repair!' }
      ]
    }
  ];

  const BOM_ITEMS = [
    { id: 'plywood', cat: 'Board & Framing', name: '1x Plywood sheet (2 ft × 4 ft, 1/2" or 3/4")', spec: 'Serves as the 48"×24" structural mock wall backing.' },
    { id: 'studs', cat: 'Board & Framing', name: '3x 2×4 lumber studs (cut to 2 ft lengths)', spec: 'Mounted vertically on left, center, and right of the plywood.' },
    { id: 'screws', cat: 'Board & Framing', name: '1x Box of 1-5/8" or 2" wood screws', spec: 'Anchors the three 2×4 studs and panel enclosure securely.' },

    { id: 'psu', cat: 'Power & Panel', name: '1x 12V DC PSU (5A adapter + terminal) or 12V battery', spec: 'Provides safe 12V DC low-voltage supply with screw terminals.' },
    { id: 'fuseblock', cat: 'Power & Panel', name: '1x 12V automotive blade fuse block (4–6 circuits)', spec: 'Acts as circuit breakers (Fuse #1 Outlets, Fuse #2 Lighting).' },
    { id: 'busbars', cat: 'Power & Panel', name: '2x Brass terminal ground/neutral bus bars', spec: 'Separates white neutral landings from bare copper ground landings.' },
    { id: 'enclosure', cat: 'Power & Panel', name: '1x Small plastic enclosure / junction box', spec: 'Houses the fuse block and bonded neutral/ground bus bars.' },

    { id: 'romex142', cat: 'Wire & Boxes', name: '1x 25 ft roll of 14/2 NM-B (Romex)', spec: 'Black (hot), White (neutral), Bare copper ground.' },
    { id: 'romex143', cat: 'Wire & Boxes', name: '1x 15 ft roll of 14/3 NM-B (Romex)', spec: 'Adds Red wire for 3-way switch travelers between Switch A & B.' },
    { id: 'boxes1g', cat: 'Wire & Boxes', name: '4x Single-gang nail-on plastic boxes', spec: 'Houses switches and receptacles (add 1 box or 2-gang if splitting Switch B).' },
    { id: 'boxoct', cat: 'Wire & Boxes', name: '1x Ceiling octagon electrical box', spec: 'Top-center mounting box for the keyless ceiling lamp holder.' },
    { id: 'staples', cat: 'Wire & Boxes', name: '1x Box of 1/2" insulated cable staples', spec: 'Secures NM-B Romex neatly along 2×4 studs within 12" of boxes.' },
    { id: 'wagos', cat: 'Wire & Boxes', name: '1x Wire nuts or Wago 221 lever connectors', spec: 'Used for parallel outlet pigtails and neutral pass-through splices.' },
    { id: 'groundscrews', cat: 'Wire & Boxes', name: '1x Pack of green grounding screws', spec: 'Bonds bare copper grounds to device frames and pigtails.' },

    { id: 'outlets', cat: 'Devices & Loads', name: '3x Standard 15A duplex receptacles', spec: '2 parallel outlets + 1 half-hot split outlet (brass tab broken).' },
    { id: 'sw1p', cat: 'Devices & Loads', name: '1x Standard single-pole light switch', spec: 'Controls the top half of Outlet #3 via a 14/2 switch loop.' },
    { id: 'sw3w', cat: 'Devices & Loads', name: '2x 3-way light switches (SPDT)', spec: 'Dark Common screw + 2 Brass traveler screws for dual-location control.' },
    { id: 'lampholder', cat: 'Devices & Loads', name: '1x Keyless plastic ceiling lamp holder (E26)', spec: 'Brass center contact = switched hot; Silver shell = white neutral.' },
    { id: 'bulbs12v', cat: 'Devices & Loads', name: '2x 12V DC E26 LED bulbs (RV/marine)', spec: 'MUST be 12V DC rated and labeled "12V DC ONLY".' },
    { id: 'testplug', cat: 'Devices & Loads', name: '1x Replacement 2-prong polarized plug + E26 pigtail', spec: 'Builds your DIY plug-in 12V test lamp (label "12V DC ONLY").' },
    { id: 'plates', cat: 'Devices & Loads', name: 'Wall plates for all switches and outlets', spec: 'Finishes each device box cleanly for safe handling.' },

    { id: 'strippers', cat: 'Tools', name: 'Romex cable ripper / 14 AWG wire strippers', spec: 'Rips outer NM-B sheathing and strips 5/8" insulation cleanly.' },
    { id: 'pliers', cat: 'Tools', name: 'Needle-nose pliers', spec: 'Bends clockwise J-hooks and snaps off Outlet #3 brass tab.' },
    { id: 'drivers', cat: 'Tools', name: 'Phillips and flathead screwdrivers', spec: 'Drives mounting screws and torques brass/silver/green terminals.' },
    { id: 'dmm', cat: 'Tools', name: 'Digital multimeter (DC Volts & Continuity)', spec: 'Verifies ~12V DC polarity and neutral-to-ground continuity.' }
  ];

  // Beginner Parts Encyclopedia Data (Panel 3)
  const PARTS_GUIDE = [
    {
      id: 'psu',
      name: '12V DC Power Supply (5A)',
      badge: 'POWER SOURCE',
      what: 'A wall adapter (or 12V battery) that turns 120V AC household electricity into gentle, touch-safe 12V DC power.',
      why: 'Acts as our "water pump." It supplies enough power to light RV LEDs and trigger multimeter readings with zero shock hazard.',
      home: 'Street pole transformer + main utility meter feeding your house.'
    },
    {
      id: 'fuse',
      name: 'Blade Fuse Block & 5A Fuses',
      badge: 'OVERLOAD GUARD',
      what: 'A distribution hub holding tiny replaceable 5-Amp blade fuses—one for each branch circuit.',
      why: 'If two bare wires ever short-circuit or draw over 5 Amps, the thin metal link inside the fuse melts in milliseconds before wires get hot!',
      home: 'Your home’s main Circuit Breaker Panel (where breakers trip at 15A or 20A).'
    },
    {
      id: 'busbars',
      name: 'Brass Neutral & Ground Bus Bars',
      badge: 'RETURN & SAFETY',
      what: 'Solid brass screw-terminal strips inside the Main Panel enclosure.',
      why: 'Every circuit’s White Neutral wire needs a clean return path to -12V, and every Bare Copper wire needs a shared safety Ground rail.',
      home: 'Identical silver/aluminum Neutral & Ground bus bars inside a real breaker box.'
    },
    {
      id: 'romex',
      name: '14/2 & 14/3 NM-B Romex + Staples',
      badge: 'WIRE HIGHWAY',
      what: 'Flat plastic-sheathed cables holding solid copper wires (14/2 = Black + White + Bare; 14/3 adds Red), pinned to studs with 1/2" staples.',
      why: 'Carries power cleanly from the panel to switches, outlets, and the ceiling light without loose dangling wires.',
      home: 'Exact same 14 AWG NM-B Romex cable used inside real residential walls!'
    },
    {
      id: 'boxes',
      name: 'Nail-On Single-Gang & Octagon Boxes',
      badge: 'CONTAINMENT',
      what: 'Sturdy blue plastic enclosures nailed to studs (single-gang for switches/outlets; octagon for the ceiling fixture).',
      why: 'Protects wire splices from physical damage and keeps any accidental spark safely contained inside fire-rated plastic.',
      home: 'Standard residential rough-in electrical boxes nailed before drywall.'
    },
    {
      id: 'wago',
      name: 'Wago 221 Lever Nuts & Wire Nuts',
      badge: 'SPLICE BRIDGES',
      what: 'Insulated clamp connectors (orange flip-levers or twist-on cones) that join 2 to 5 stripped copper wires electrically.',
      why: 'Allows us to make parallel "pigtail" junctions inside crowded boxes so downstream outlets stay powered reliably.',
      home: 'Used inside virtually every junction box in modern residential wiring.'
    },
    {
      id: 'outlet',
      name: '15A Duplex Receptacles (Outlets)',
      badge: 'POWER PORTS',
      what: 'Standard two-socket wall outlets with Brass screws (Hot), Silver screws (Neutral), Green screw (Ground), and break-off side tabs.',
      why: 'Lets us plug in our 12V test lamp—and by snapping ONLY the brass tab on Outlet #3, we make top half switched and bottom half always hot!',
      home: 'Standard bedroom/living room wall outlets (often split for a bedside lamp).'
    },
    {
      id: 'switches',
      name: 'Single-Pole & 3-Way Switches',
      badge: 'TRAFFIC VALVES',
      what: 'Single-Pole = simple ON/OFF gate (2 brass screws). 3-Way = 2-path diverter (1 dark Common screw + 2 brass Traveler screws).',
      why: 'Single-pole toggles half of Outlet #3; two 3-way switches let you control the ceiling light from either end of the board.',
      home: 'Single-pole bedroom switches and 3-way hallway/staircase switches.'
    }
  ];

  // Wire-It-Yourself Challenges (Panel 13)
  const WIRING_CHALLENGES = [
    {
      id: 0,
      title: 'Challenge 1: Parallel Duplex Outlet',
      subtitle: 'Connect 14/2 pigtails to the correct terminal screws.',
      wires: [
        { id: 'blk', label: 'Black (+12V Hot)', color: '#1e293b', stroke: '#f59e0b', target: 'brass' },
        { id: 'wht', label: 'White (-12V Neutral)', color: '#f8fafc', stroke: '#64748b', target: 'silver' },
        { id: 'gnd', label: 'Bare Copper (Ground)', color: '#d97706', stroke: '#16a34a', target: 'green' }
      ],
      terminals: [
        { id: 'silver', label: 'Silver Screw', x: 382, y: 214, accept: ['wht'], hint: 'Neutral (White) lands on Silver screws.' },
        { id: 'brass', label: 'Brass Screw', x: 538, y: 214, accept: ['blk'], hint: 'Hot (Black/Red) lands on Brass screws.' },
        { id: 'green', label: 'Green Ground', x: 382, y: 374, accept: ['gnd'], hint: 'Bare copper ground lands on the Green hex screw.' }
      ],
      requiresTabBreak: false
    },
    {
      id: 1,
      title: 'Challenge 2: Half-Hot Outlet #3',
      subtitle: 'Wire Switched Hot to Top Brass, Constant Hot to Bottom Brass, Neutral to Silver, AND snap off the Brass Tab!',
      wires: [
        { id: 'sw_blk', label: 'Switched Hot (Black from Switch)', color: '#ef4444', stroke: '#ef4444', target: 'brass_top' },
        { id: 'const_blk', label: 'Constant +12V (Black Feed)', color: '#1e293b', stroke: '#f59e0b', target: 'brass_bot' },
        { id: 'wht', label: 'White (-12V Neutral)', color: '#f8fafc', stroke: '#64748b', target: 'silver' }
      ],
      terminals: [
        { id: 'brass_top', label: 'Top Brass (Switched)', x: 538, y: 204, accept: ['sw_blk'], hint: 'Switched return from the 1-pole switch feeds the Top Brass screw.' },
        { id: 'brass_bot', label: 'Bottom Brass (Always Hot)', x: 538, y: 312, accept: ['const_blk'], hint: 'Constant +12V feed lands on the Bottom Brass screw.' },
        { id: 'silver', label: 'Silver Screw (Shared)', x: 382, y: 258, accept: ['wht'], hint: 'White Neutral lands on Silver (silver tab stays intact!).' }
      ],
      requiresTabBreak: true
    },
    {
      id: 2,
      title: 'Challenge 3: 3-Way Switch A (14/2 + 14/3)',
      subtitle: 'Land the +12V feed on the Dark Common screw and both 14/3 travelers on the Brass screws.',
      wires: [
        { id: 'feed', label: '+12V Feed (Black 14/2)', color: '#1e293b', stroke: '#f59e0b', target: 'common' },
        { id: 'trav_b', label: 'Black Traveler (14/3)', color: '#334155', stroke: '#3b82f6', target: 'trav1' },
        { id: 'trav_r', label: 'Red Traveler (14/3)', color: '#ef4444', stroke: '#ef4444', target: 'trav2' }
      ],
      terminals: [
        { id: 'common', label: 'Dark Common Screw', x: 384, y: 258, accept: ['feed'], hint: 'Power In from Fuse #2 lands on the Dark Common screw.' },
        { id: 'trav1', label: 'Brass Traveler #1', x: 536, y: 204, accept: ['trav_b', 'trav_r'], hint: 'Either 14/3 traveler (Black or Red) goes on a Brass Traveler screw.' },
        { id: 'trav2', label: 'Brass Traveler #2', x: 536, y: 312, accept: ['trav_b', 'trav_r'], hint: 'Second 14/3 traveler lands on the other Brass Traveler screw.' }
      ],
      requiresTabBreak: false
    }
  ];

  // =========================================================================
  // 3. APPLICATION STATE
  // =========================================================================
  const state = {
    view: 'theater',
    panel: 1,
    playing: false,
    speed: 1.0,

    // New Beginner Panels 1–4
    introLoopClosed: true,
    introWireSel: 'black', // 'black' | 'red' | 'white' | 'bare'
    introGroundFault: false,
    introPartSel: 'fuse',
    introFuseOverload: false,
    introBulbRemoved: false,

    // Panel 5 (Safety)
    safetyHotspot: 'panel',

    // Panel 6 (BOM)
    bomCat: 'All',
    bomSelected: 'romex143',
    bomChecked: new Set(['plywood', 'studs', 'psu', 'dmm']),

    // Panel 3
    frameStep: 4,

    // Panel 4
    p4Fuse1: true,
    p4Fuse2: true,
    p4Subpanel: false,

    // Panel 5
    p5HookMode: 'cw',
    p5TorqueCount: 0,

    // Panel 6
    p6SpliceMode: 'wago',
    p6Levers: [true, true, true],
    p6WiringStyle: 'pigtail', // 'pigtail' | 'series'
    p6Outlet1Removed: false,

    // Panel 7
    p7SwitchOn: true,
    p7TabBroken: true,

    // Panel 8
    p8SwA: 'black',
    p8SwB: 'black',
    p8Cycling: false,

    // Panel 9 Wire-It-Yourself
    p9Idx: 0,
    p9ActiveWire: 'blk',
    p9Connected: [{}, {}, {}],
    p9TabBroken: false,
    p9Feedback: { tone: 'neutral', text: 'Pick a conductor wire, then click its matching terminal screw!' },

    // Panel 10 Live Simulator
    sim: {
      psuOn: true,
      fuse1Intact: true,
      fuse2Intact: true,
      outlet3TabBroken: true,
      redTravelerConnected: true,
      neutralSpliceIntact: true,
      spSwitchOn: true,
      sw3WayA: 'black',
      sw3WayB: 'black',
      lampSocket: 'o3-top',
      dmmMode: 'vdc',
      flowMode: 'conv', // 'conv' | 'elec' | 'off'
      activeFault: 'none', // 'none' | 'fuse1' | 'tab' | 'traveler' | 'neutral'
      verify: {
        o1Tested: false,
        o2Tested: false,
        o3TopOffObserved: false,
        o3TopOnObserved: false,
        swAChanged: false,
        swBChanged: false
      }
    }
  };

  let autoplayTimer = null;
  let autoplayStart = 0;
  let cycle3WayTimer = null;

  // =========================================================================
  // 4. THEME & CIRCUIT SOLVER
  // =========================================================================
  function isLightTheme() {
    return document.documentElement.classList.contains('light');
  }

  function palette() {
    const light = isLightTheme();
    return {
      stageBg: light ? '#f8fafc' : '#0a101d',
      gridLine: light ? '#e2e8f0' : '#182338',
      cardBg: light ? '#ffffff' : '#111827',
      cardStroke: light ? '#cbd5e1' : '#334155',
      text: light ? '#0f172a' : '#f1f5f9',
      muted: light ? '#475569' : '#94a3b8',
      plywood: light ? '#deb887' : '#b88b58',
      plywoodEdge: light ? '#9a6f3d' : '#785028',
      stud: light ? '#f3d9b1' : '#d6b07d',
      studStroke: light ? '#a1733b' : '#855828',
      whiteWire: light ? '#e2e8f0' : '#f8fafc',
      whiteWireBorder: light ? '#64748b' : '#475569',
      blackWire: '#1e293b',
      blackWireHighlight: light ? '#0f172a' : '#334155',
      redWire: '#ef4444',
      copper: '#d97706',
      copperBright: '#f59e0b',
      blueBox: '#2563eb',
      blueBoxDark: '#1d4ed8',
      brass: '#eab308',
      silver: '#cbd5e1',
      greenGround: '#16a34a',
      hotGlow: '#f59e0b',
      ok: '#10b981',
      warn: '#f59e0b',
      danger: '#ef4444'
    };
  }

  function evaluateSim() {
    const s = state.sim;
    const feedC1 = s.psuOn && s.fuse1Intact;
    const feedC2 = s.psuOn && s.fuse2Intact;

    const o1Top = feedC1;
    const o1Bot = feedC1;
    const o2Top = feedC1 && s.neutralSpliceIntact;
    const o2Bot = feedC1 && s.neutralSpliceIntact;
    const o3Bot = feedC1 && s.neutralSpliceIntact;

    let o3Top = false;
    if (feedC1 && s.neutralSpliceIntact) {
      o3Top = !s.outlet3TabBroken ? true : s.spSwitchOn;
    }

    const activeTraveler = feedC2 ? s.sw3WayA : null;
    let swBReceives = false;
    if (feedC2) {
      if (s.sw3WayB === 'black' && activeTraveler === 'black') {
        swBReceives = true;
      } else if (s.sw3WayB === 'red' && activeTraveler === 'red' && s.redTravelerConnected) {
        swBReceives = true;
      }
    }

    const sockets = {
      'o1-top': o1Top,
      'o1-bot': o1Bot,
      'o2-top': o2Top,
      'o2-bot': o2Bot,
      'o3-top': o3Top,
      'o3-bot': o3Bot
    };

    const lampLit = Boolean(sockets[s.lampSocket]);
    return {
      feedC1,
      feedC2,
      sockets,
      lampLit,
      probedHot: lampLit,
      activeTraveler,
      ceilingLightOn: swBReceives
    };
  }

  function recordVerifyObservation() {
    if (state.panel !== 14) return;
    const ev = evaluateSim();
    const v = state.sim.verify;
    const sock = state.sim.lampSocket;

    if ((sock === 'o1-top' || sock === 'o1-bot') && ev.sockets[sock]) v.o1Tested = true;
    if ((sock === 'o2-top' || sock === 'o2-bot') && ev.sockets[sock]) v.o2Tested = true;
    if (ev.feedC1 && ev.sockets['o3-bot']) {
      if (!ev.sockets['o3-top']) v.o3TopOffObserved = true;
      else if (state.sim.outlet3TabBroken && state.sim.spSwitchOn && ev.sockets['o3-top']) v.o3TopOnObserved = true;
    }
  }

  function checkAllVerified() {
    const v = state.sim.verify;
    return v.o1Tested && v.o2Tested && v.o3TopOffObserved && v.o3TopOnObserved && v.swAChanged && v.swBChanged;
  }

  // =========================================================================
  // 5. SHARED SVG PRIMITIVES
  // =========================================================================
  function svgDefs(c) {
    return `
      <defs>
        <pattern id="bp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${c.gridLine}" stroke-width="0.8"/>
        </pattern>
        <radialGradient id="bulb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.98"/>
          <stop offset="45%" stop-color="#f59e0b" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="wood-ply" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c.plywood}"/>
          <stop offset="100%" stop-color="${c.plywoodEdge}" stop-opacity="0.38"/>
        </linearGradient>
        <linearGradient id="brass-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
      </defs>
    `;
  }

  function svgBackground(c, subtitle) {
    return `
      <rect x="0" y="0" width="1120" height="600" fill="${c.stageBg}"/>
      <rect x="0" y="0" width="1120" height="600" fill="url(#bp-grid)" opacity="0.9"/>
      <text x="22" y="26" fill="${c.muted}" font-size="11.5" font-family="JetBrains Mono, ui-monospace, monospace" font-weight="600">${subtitle}</text>
    `;
  }

  function svgPlywoodBoard(c, opts = {}) {
    const showStuds = opts.showStuds !== false;
    const animStuds = Boolean(opts.animStuds);
    const studClsL = animStuds ? 'anim-slide-top d-1' : '';
    const studClsC = animStuds ? 'anim-slide-top d-2' : '';
    const studClsR = animStuds ? 'anim-slide-top d-3' : '';

    return `
      <g>
        <rect x="70" y="54" width="880" height="492" rx="10" fill="${c.plywood}" stroke="${c.plywoodEdge}" stroke-width="3"/>
        <rect x="70" y="54" width="880" height="492" rx="10" fill="url(#wood-ply)" opacity="0.45"/>
        <path d="M90 140 Q320 132 540 142 T930 138 M85 310 Q380 318 650 306 T925 314 M95 465 Q410 456 710 468 T920 462"
          fill="none" stroke="${c.plywoodEdge}" stroke-width="1.2" opacity="0.28"/>

        ${showStuds ? `
          <g class="${studClsL}">
            <rect x="106" y="56" width="52" height="488" rx="3" fill="${c.stud}" stroke="${c.studStroke}" stroke-width="2"/>
            <circle cx="132" cy="76" r="3.5" fill="#64748b"/><circle cx="132" cy="524" r="3.5" fill="#64748b"/>
          </g>
          <g class="${studClsC}">
            <rect x="478" y="56" width="52" height="488" rx="3" fill="${c.stud}" stroke="${c.studStroke}" stroke-width="2"/>
            <circle cx="504" cy="76" r="3.5" fill="#64748b"/><circle cx="504" cy="524" r="3.5" fill="#64748b"/>
          </g>
          <g class="${studClsR}">
            <rect x="854" y="56" width="52" height="488" rx="3" fill="${c.stud}" stroke="${c.studStroke}" stroke-width="2"/>
            <circle cx="880" cy="76" r="3.5" fill="#64748b"/><circle cx="880" cy="524" r="3.5" fill="#64748b"/>
          </g>
        ` : ''}
      </g>
    `;
  }

  function svgMainPanelShell(c, opts = {}) {
    const psuOn = opts.psuOn !== false;
    const f1 = opts.fuse1 !== false;
    const f2 = opts.fuse2 !== false;
    const interactive = Boolean(opts.interactive);

    return `
      <g>
        <rect x="92" y="138" width="144" height="236" rx="10" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="2.5"/>
        <rect x="100" y="146" width="128" height="26" rx="5" fill="#f59e0b"/>
        <text x="164" y="163" text-anchor="middle" fill="#111827" font-size="11.5" font-weight="800">12V DC ONLY</text>

        <g ${interactive ? 'class="svg-hit" data-action="sim-toggle-psu"' : ''}>
          <rect x="104" y="388" width="120" height="46" rx="7" fill="${c.cardBg}" stroke="${psuOn ? c.ok : c.danger}" stroke-width="2"/>
          <circle cx="122" cy="411" r="6" fill="${psuOn ? c.ok : c.danger}"/>
          <text x="135" y="407" fill="${c.text}" font-size="11" font-weight="700">12V 5A PSU</text>
          <text x="135" y="423" fill="${psuOn ? c.ok : c.danger}" font-size="10.5" font-weight="700">${psuOn ? 'ON · 12.04V' : 'OFF · 0.00V'}</text>
        </g>
        <path d="M132 388 L132 356" stroke="${c.redWire}" stroke-width="4" stroke-linecap="round"/>
        <path d="M196 388 L196 356" stroke="${c.blackWire}" stroke-width="4" stroke-linecap="round"/>

        <rect x="104" y="182" width="60" height="106" rx="6" fill="${c.stageBg}" stroke="${c.cardStroke}" stroke-width="1.5"/>
        <text x="134" y="196" text-anchor="middle" fill="${c.muted}" font-size="10" font-weight="700">FUSES</text>

        <g ${interactive ? 'class="svg-hit" data-action="sim-toggle-fuse1"' : ''}>
          <rect x="110" y="204" width="48" height="32" rx="4" fill="${f1 ? '#fbbf24' : '#ef4444'}" fill-opacity="0.2" stroke="${f1 ? '#f59e0b' : '#ef4444'}" stroke-width="1.8"/>
          <text x="134" y="218" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">F1 · 5A</text>
          <text x="134" y="231" text-anchor="middle" fill="${f1 ? c.ok : c.danger}" font-size="9.5" font-weight="700">${f1 ? 'OK (C1)' : 'BLOWN'}</text>
        </g>

        <g ${interactive ? 'class="svg-hit" data-action="sim-toggle-fuse2"' : ''}>
          <rect x="110" y="244" width="48" height="32" rx="4" fill="${f2 ? '#fbbf24' : '#ef4444'}" fill-opacity="0.2" stroke="${f2 ? '#f59e0b' : '#ef4444'}" stroke-width="1.8"/>
          <text x="134" y="258" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">F2 · 5A</text>
          <text x="134" y="271" text-anchor="middle" fill="${f2 ? c.ok : c.danger}" font-size="9.5" font-weight="700">${f2 ? 'OK (C2)' : 'BLOWN'}</text>
        </g>

        <rect x="174" y="184" width="18" height="104" rx="3" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="1.2"/>
        <text x="183" y="179" text-anchor="middle" fill="${c.muted}" font-size="9.5" font-weight="700">N</text>
        <rect x="204" y="184" width="18" height="104" rx="3" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="1.2"/>
        <text x="213" y="179" text-anchor="middle" fill="${c.muted}" font-size="9.5" font-weight="700">G</text>

        <path d="M183 272 L213 272" stroke="${c.copper}" stroke-width="4" stroke-linecap="round"/>
        <text x="164" y="344" text-anchor="middle" fill="${c.muted}" font-size="9.5" font-weight="600">N-G Bonded</text>
      </g>
    `;
  }

  function svgDuplexOutlet(c, x, y, label, opts = {}) {
    const topHot = Boolean(opts.topHot);
    const botHot = Boolean(opts.botHot);
    const splitTabBroken = opts.splitTabBroken !== false;
    const interactive = Boolean(opts.interactive);
    const lampSocket = opts.lampSocket || '';
    const idPrefix = opts.idPrefix || 'o1';

    const topId = `${idPrefix}-top`;
    const botId = `${idPrefix}-bot`;
    const hasTop = lampSocket === topId;
    const hasBot = lampSocket === botId;

    return `
      <g>
        <rect x="${x}" y="${y}" width="84" height="122" rx="7" fill="${c.blueBox}" stroke="${c.blueBoxDark}" stroke-width="2.5"/>
        <rect x="${x + 12}" y="${y + 10}" width="60" height="102" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

        <g ${interactive ? `class="svg-hit" data-action="sim-plug" data-socket="${topId}"` : ''}>
          <rect x="${x + 18}" y="${y + 16}" width="48" height="40" rx="8" fill="${topHot ? '#fef3c7' : '#e2e8f0'}" stroke="${topHot ? '#f59e0b' : '#64748b'}" stroke-width="1.8"/>
          <rect x="${x + 28}" y="${y + 24}" width="4" height="13" rx="1" fill="#0f172a"/>
          <rect x="${x + 50}" y="${y + 26}" width="4" height="10" rx="1" fill="#0f172a"/>
          <circle cx="${x + 41}" cy="${y + 45}" r="3.5" fill="#0f172a"/>
          ${hasTop ? `<circle cx="${x + 42}" cy="${y + 36}" r="7" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>` : ''}
        </g>

        <g ${interactive ? `class="svg-hit" data-action="sim-plug" data-socket="${botId}"` : ''}>
          <rect x="${x + 18}" y="${y + 64}" width="48" height="40" rx="8" fill="${botHot ? '#fef3c7' : '#e2e8f0'}" stroke="${botHot ? '#f59e0b' : '#64748b'}" stroke-width="1.8"/>
          <rect x="${x + 28}" y="${y + 72}" width="4" height="13" rx="1" fill="#0f172a"/>
          <rect x="${x + 50}" y="${y + 74}" width="4" height="10" rx="1" fill="#0f172a"/>
          <circle cx="${x + 41}" cy="${y + 93}" r="3.5" fill="#0f172a"/>
          ${hasBot ? `<circle cx="${x + 42}" cy="${y + 84}" r="7" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>` : ''}
        </g>

        ${idPrefix === 'o3' ? `
          <g ${interactive && !splitTabBroken ? 'class="svg-hit" data-action="sim-fix-tab"' : ''}>
            <rect x="${x + 71}" y="${y + 48}" width="8" height="24" rx="2"
              fill="${splitTabBroken ? 'transparent' : c.brass}"
              stroke="${splitTabBroken ? '#ef4444' : '#854d0e'}"
              stroke-dasharray="${splitTabBroken ? '2 2' : 'none'}" stroke-width="1.5"/>
            ${splitTabBroken ? `<path d="M${x+69} ${y+55} L${x+81} ${y+65} M${x+81} ${y+55} L${x+69} ${y+65}" stroke="#ef4444" stroke-width="1.8"/>` : ''}
          </g>
        ` : ''}

        <text x="${x + 42}" y="${y + 138}" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">${label}</text>
      </g>
    `;
  }

  function svgSwitchBox(c, x, y, title, subLabel, isOn, actionAttr, accentColor) {
    return `
      <g ${actionAttr ? `class="svg-hit" ${actionAttr}` : ''}>
        <rect x="${x}" y="${y}" width="76" height="114" rx="7" fill="${c.blueBox}" stroke="${c.blueBoxDark}" stroke-width="2.5"/>
        <rect x="${x + 12}" y="${y + 12}" width="52" height="90" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
        <rect x="${x + 26}" y="${y + 34}" width="24" height="44" rx="5" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
        <rect x="${x + 29}" y="${isOn ? y + 37 : y + 57}" width="18" height="18" rx="3" fill="${accentColor || '#0f172a'}"/>
        <text x="${x + 38}" y="${y + 28}" text-anchor="middle" fill="#0f172a" font-size="9" font-weight="800">${isOn ? 'UP / A' : 'DN / B'}</text>
        <text x="${x + 38}" y="${y + 130}" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">${title}</text>
        ${subLabel ? `<text x="${x + 38}" y="${y + 144}" text-anchor="middle" fill="${c.muted}" font-size="10.5">${subLabel}</text>` : ''}
      </g>
    `;
  }

  function svgCeilingLamp(c, cx, cy, isLit, label) {
    return `
      <g>
        <polygon points="${cx-34},${cy-14} ${cx-14},${cy-34} ${cx+14},${cy-34} ${cx+34},${cy-14} ${cx+34},${cy+14} ${cx+14},${cy+34} ${cx-14},${cy+34} ${cx-34},${cy+14}"
          fill="${c.blueBox}" stroke="${c.blueBoxDark}" stroke-width="2.5"/>
        <circle cx="${cx}" cy="${cy}" r="26" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="14" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
        ${isLit ? `<circle cx="${cx}" cy="${cy}" r="60" fill="url(#bulb-glow)" class="anim-glow"/>` : ''}
        <circle cx="${cx}" cy="${cy}" r="17" fill="${isLit ? '#fde047' : '#e2e8f0'}" stroke="${isLit ? '#f59e0b' : '#64748b'}" stroke-width="2"/>
        <text x="${cx}" y="${cy + 3.5}" text-anchor="middle" fill="#111827" font-size="8.5" font-weight="800">12V</text>
        ${label ? `<text x="${cx}" y="${cy - 42}" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">${label}</text>` : ''}
      </g>
    `;
  }

  // =========================================================================
  // 6. PANEL RENDERERS (1 THROUGH 10)
  // =========================================================================

  // PANEL 1: Electricity 101 — Water Analogy, Volts, Amps, Load & Closed Loop
  function renderPanel1(c) {
    const on = state.introLoopClosed;
    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 01 · ELECTRICITY 101 — CLICK THE VALVE / SWITCH TO OPEN OR CLOSE THE LOOP')}

      <!-- Left: Water Pipe Analogy -->
      <rect x="28" y="48" width="522" height="398" rx="14" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="2"/>
      <text x="289" y="78" text-anchor="middle" fill="${c.text}" font-size="14.5" font-weight="800">WATER ANALOGY (HOW IT FEELS)</text>

      <!-- Pipe Loop -->
      <rect x="92" y="138" width="394" height="222" rx="34" fill="none" stroke="#38bdf8" stroke-width="24" opacity="0.28"/>
      <rect x="92" y="138" width="394" height="222" rx="34" fill="none" stroke="#0284c7" stroke-width="4"/>
      ${on ? `<rect x="92" y="138" width="394" height="222" rx="34" fill="none" stroke="#38bdf8" stroke-width="8" stroke-dasharray="10 14" class="anim-flow"/>` : ''}

      <!-- Water Pump = Voltage -->
      <rect x="52" y="210" width="84" height="78" rx="12" fill="${c.stageBg}" stroke="#f59e0b" stroke-width="2.5"/>
      <text x="94" y="242" text-anchor="middle" fill="#f59e0b" font-size="12.5" font-weight="800">PUMP</text>
      <text x="94" y="260" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="700">= 12V Volts</text>
      <text x="94" y="276" text-anchor="middle" fill="${c.muted}" font-size="10">(Pressure)</text>

      <!-- Water Wheel = Load -->
      <circle cx="486" cy="249" r="38" fill="${c.stageBg}" stroke="${on ? '#fde047' : '#64748b'}" stroke-width="3"/>
      <path d="M460 249 L512 249 M486 223 L486 275" stroke="${on ? '#f59e0b' : '#64748b'}" stroke-width="4" stroke-linecap="round"/>
      <text x="486" y="308" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="800">Wheel = Load</text>

      <!-- Shutoff Valve = Switch -->
      <g class="svg-hit" data-action="intro-toggle-loop">
        <rect x="228" y="108" width="124" height="54" rx="10" fill="${on ? c.ok : c.danger}" fill-opacity="0.18" stroke="${on ? c.ok : c.danger}" stroke-width="2.5"/>
        <text x="290" y="132" text-anchor="middle" fill="${c.text}" font-size="12" font-weight="800">${on ? 'VALVE OPEN' : 'VALVE SHUT'}</text>
        <text x="290" y="150" text-anchor="middle" fill="${on ? c.ok : c.danger}" font-size="10.5" font-weight="700">${on ? 'Water Flowing' : 'Blocked (0 Flow)'}</text>
      </g>

      <text x="289" y="394" text-anchor="middle" fill="${c.text}" font-size="12" font-weight="700">Flow Speed = Current (Amps)</text>
      <text x="289" y="416" text-anchor="middle" fill="${c.muted}" font-size="11.5">No return pipe back to pump = Zero flow anywhere in the pipe!</text>

      <!-- Right: Real 12V DC Electrical Circuit -->
      <rect x="570" y="48" width="522" height="398" rx="14" fill="${c.cardBg}" stroke="${on ? c.ok : c.cardStroke}" stroke-width="2"/>
      <text x="831" y="78" text-anchor="middle" fill="${c.text}" font-size="14.5" font-weight="800">REAL 12V DC CIRCUIT</text>

      <!-- Wire Loop -->
      <path d="M634 210 L634 138 L1028 138 L1028 212" fill="none" stroke="${c.blackWireHighlight}" stroke-width="8" stroke-linecap="round"/>
      ${on ? `<path d="M634 210 L634 138 L1028 138 L1028 212" fill="none" stroke="${c.hotGlow}" stroke-width="3" class="anim-flow"/>` : ''}

      <path d="M1028 286 L1028 360 L634 360 L634 288" fill="none" stroke="${c.whiteWire}" stroke-width="8" stroke-linecap="round"/>
      ${on ? `<path d="M1028 286 L1028 360 L634 360 L634 288" fill="none" stroke="${c.hotGlow}" stroke-width="3" class="anim-flow"/>` : ''}

      <!-- 12V Supply -->
      <rect x="592" y="210" width="88" height="78" rx="12" fill="${c.stageBg}" stroke="#f59e0b" stroke-width="2.5"/>
      <text x="636" y="238" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="800">12V DC</text>
      <text x="636" y="256" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="700">+ Hot Out</text>
      <text x="636" y="274" text-anchor="middle" fill="${c.muted}" font-size="10.5">- Return</text>

      <!-- 12V LED Bulb -->
      ${on ? `<circle cx="1028" cy="249" r="52" fill="url(#bulb-glow)" class="anim-glow"/>` : ''}
      <circle cx="1028" cy="249" r="30" fill="${on ? '#fde047' : '#e2e8f0'}" stroke="${on ? '#f59e0b' : '#64748b'}" stroke-width="3"/>
      <text x="1028" y="253" text-anchor="middle" fill="#111827" font-size="12" font-weight="900">${on ? 'LIT!' : 'OFF'}</text>
      <text x="1028" y="302" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="800">12V Bulb (Load)</text>

      <!-- Interactive Electrical Switch -->
      <g class="svg-hit" data-action="intro-toggle-loop">
        <rect x="768" y="108" width="132" height="54" rx="10" fill="${on ? c.ok : c.danger}" fill-opacity="0.18" stroke="${on ? c.ok : c.danger}" stroke-width="2.5"/>
        <text x="834" y="132" text-anchor="middle" fill="${c.text}" font-size="12" font-weight="800">${on ? 'SWITCH CLOSED' : 'SWITCH OPEN'}</text>
        <text x="834" y="150" text-anchor="middle" fill="${on ? c.ok : c.danger}" font-size="10.5" font-weight="700">${on ? 'Click to Open Gap' : 'Click to Close Loop'}</text>
      </g>

      <text x="831" y="394" text-anchor="middle" fill="${on ? c.ok : c.muted}" font-size="12" font-weight="800">
        ${on ? 'Complete Loop: 12.0V across bulb → 0.5A flowing!' : 'Broken Loop: Switch gap stops ALL current immediately.'}
      </text>
      <text x="831" y="416" text-anchor="middle" fill="${c.muted}" font-size="11.5">Energy moves through Black Hot (+) and returns via White Neutral (-).</text>

      <!-- Bottom DC vs AC Explainer Card -->
      <rect x="28" y="464" width="1064" height="110" rx="12" fill="${c.cardBg}" stroke="${c.warn}" stroke-width="2"/>
      <text x="48" y="492" fill="${c.warn}" font-size="13" font-weight="800">DC vs. AC IN 10 SECONDS — WHY OUR BOARD USES 12V DC:</text>
      <text x="48" y="518" fill="${c.text}" font-size="12.5">• <tspan font-weight="700">12V DC (Direct Current):</tspan> Flows steadily in one direction (+ to -). Touch-safe voltage—zero shock risk while learning!</text>
      <text x="48" y="542" fill="${c.text}" font-size="12.5">• <tspan font-weight="700">120V AC (Real House):</tspan> Flips direction 60 times/sec and can shock or burn—yet uses the <tspan font-weight="700" fill="${c.ok}">exact same switches, outlets &amp; Romex rules</tspan> you practice here.</text>
    `;
  }

  // PANEL 2: Meet the Wires — Hot, Neutral, Ground & Romex Numbers
  function renderPanel2(c) {
    const sel = state.introWireSel;
    const gf = state.introGroundFault;
    const wireInfo = {
      black: {
        title: 'BLACK WIRE — HOT (+12V Supply)',
        desc: 'Carries pressurized electrical energy FROM the Main Panel fuse TO switches and outlets. Always lands on BRASS screws (or Dark Common on 3-ways).'
      },
      red: {
        title: 'RED WIRE — 2nd HOT / 3-WAY TRAVELER (Only in 14/3)',
        desc: 'Exactly like Black, Red is an active hot wire! Our board uses Red in 14/3 Romex as the second "traveler" rail between 3-Way Switch A and Switch B.'
      },
      white: {
        title: 'WHITE WIRE — NEUTRAL (-12V Return Path)',
        desc: 'Completes the closed loop! After energy lights the bulb or powers the test lamp, White carries current cleanly back to the Neutral Bus Bar. Always lands on SILVER screws.'
      },
      bare: {
        title: 'BARE COPPER — SAFETY GROUND (0A Normally)',
        desc: 'Carries ZERO current in normal operation. If a loose Black wire ever touches a metal box or appliance frame, Ground gives fault current an instant escape path to blow the fuse!'
      }
    }[sel];

    const cardAttr = (w) => `class="svg-hit" data-action="intro-pick-wire" data-wire="${w}"`;

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 02 · MEET THE WIRES — CLICK ANY CONDUCTOR OR TEST A GROUND FAULT')}

      <!-- Top: Romex Label Decoder -->
      <rect x="28" y="44" width="1064" height="122" rx="14" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="2"/>
      <text x="54" y="74" fill="${c.muted}" font-size="11.5" font-weight="800">HOW TO READ ROMEX LABELS:</text>

      <rect x="54" y="90" width="106" height="54" rx="8" fill="${c.stageBg}" stroke="#3b82f6" stroke-width="2"/>
      <text x="107" y="124" text-anchor="middle" fill="#60a5fa" font-size="24" font-weight="900">14</text>
      <text x="172" y="112" fill="${c.text}" font-size="12" font-weight="800">Wire Thickness (14 AWG)</text>
      <text x="172" y="132" fill="${c.muted}" font-size="11">Rated up to 15 Amps in homes</text>

      <text x="394" y="128" text-anchor="middle" fill="${c.muted}" font-size="28" font-weight="800">/</text>

      <rect x="414" y="90" width="96" height="54" rx="8" fill="${c.stageBg}" stroke="#f59e0b" stroke-width="2"/>
      <text x="462" y="124" text-anchor="middle" fill="#f59e0b" font-size="24" font-weight="900">2 or 3</text>
      <text x="522" y="112" fill="${c.text}" font-size="12" font-weight="800">Colored Insulated Wires</text>
      <text x="522" y="132" fill="${c.muted}" font-size="11">/2 = Blk+Wht · /3 = Blk+Red+Wht (plus Bare!)</text>

      <rect x="816" y="90" width="112" height="54" rx="8" fill="${c.stageBg}" stroke="${c.ok}" stroke-width="2"/>
      <text x="872" y="124" text-anchor="middle" fill="${c.ok}" font-size="20" font-weight="900">NM-B</text>
      <text x="938" y="112" fill="${c.text}" font-size="12" font-weight="800">Indoor Cable</text>
      <text x="938" y="132" fill="${c.muted}" font-size="11">Non-Metallic dry walls</text>

      <!-- Middle Left: 4 Clickable Conductor Cards -->
      ${[
        ['black', 'BLACK · HOT (+12V)', '#1e293b', '#f59e0b', 'Brings power IN → Brass'],
        ['red', 'RED · 2ND HOT (14/3)', '#ef4444', '#ef4444', '3-Way traveler → Brass'],
        ['white', 'WHITE · NEUTRAL (-)', '#f8fafc', '#64748b', 'Brings current BACK → Silver'],
        ['bare', 'BARE · SAFETY GROUND', '#d97706', '#16a34a', 'Emergency escape → Green']
      ].map(([id, title, fillCol, strokeCol, sub], i) => {
        const active = sel === id;
        const cy = 184 + i * 74;
        return `
          <g ${cardAttr(id)}>
            <rect x="28" y="${cy}" width="470" height="62" rx="10" fill="${c.cardBg}" stroke="${active ? c.warn : c.cardStroke}" stroke-width="${active ? 3 : 1.5}"/>
            <rect x="46" y="${cy + 20}" width="44" height="22" rx="5" fill="${fillCol}" stroke="${strokeCol}" stroke-width="2.5"/>
            <text x="106" y="${cy + 27}" fill="${c.text}" font-size="12.5" font-weight="800">${title}</text>
            <text x="106" y="${cy + 45}" fill="${c.muted}" font-size="11.5">${sub}</text>
          </g>
        `;
      }).join('')}

      <!-- Middle Right: Live Cable Cross-Section & Ground Fault Safety Demo -->
      <rect x="518" y="184" width="574" height="284" rx="14" fill="${c.cardBg}" stroke="${gf ? c.danger : c.cardStroke}" stroke-width="2"/>
      <text x="805" y="212" text-anchor="middle" fill="${c.text}" font-size="13.5" font-weight="800">
        ${gf ? '⚠ GROUND FAULT TRIGGERED! FUSE TRIPS INSTANTLY' : 'INSIDE A 14/3 ROMEX CABLE & SAFETY GROUND PATH'}
      </text>

      <!-- Sheath -->
      <rect x="548" y="236" width="166" height="128" rx="10" fill="#facc15" fill-opacity="0.22" stroke="#eab308" stroke-width="2.5"/>
      <text x="631" y="384" text-anchor="middle" fill="${c.muted}" font-size="11" font-weight="700">14/3 Outer Jacket</text>

      <!-- Conductors emerging -->
      <path d="M714 256 L928 256" stroke="${c.blackWire}" stroke-width="${sel === 'black' ? 12 : 8}" stroke-linecap="round"/>
      ${!gf ? `<path d="M714 256 L928 256" stroke="${c.hotGlow}" stroke-width="3" class="anim-flow"/>` : ''}
      <text x="942" y="260" fill="${c.text}" font-size="11.5" font-weight="700">Hot (+12V)</text>

      <path d="M714 284 L928 284" stroke="${c.redWire}" stroke-width="${sel === 'red' ? 12 : 8}" stroke-linecap="round"/>
      <text x="942" y="288" fill="${c.redWire}" font-size="11.5" font-weight="700">Red (2nd Hot)</text>

      <path d="M714 312 L928 312" stroke="${c.whiteWire}" stroke-width="${sel === 'white' ? 12 : 8}" stroke-linecap="round"/>
      ${!gf ? `<path d="M928 312 L714 312" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>` : ''}
      <text x="942" y="316" fill="${c.text}" font-size="11.5" font-weight="700">Neutral (-12V)</text>

      <path d="M714 342 L928 342" stroke="${c.copper}" stroke-width="${sel === 'bare' || gf ? 9 : 5}" stroke-linecap="round"/>
      ${gf ? `<path d="M928 342 L714 342" stroke="#ef4444" stroke-width="3.5" class="anim-flow"/>` : ''}
      <text x="942" y="346" fill="${gf ? c.danger : c.greenGround}" font-size="11.5" font-weight="800">${gf ? 'FAULT! Trips Fuse' : 'Ground (0A Normal)'}</text>

      ${gf ? `<path d="M920 256 Q936 299 920 342" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="4 3"/>` : ''}

      <g class="svg-hit" data-action="intro-toggle-gf">
        <rect x="556" y="406" width="498" height="42" rx="9" fill="${gf ? c.ok : '#ef4444'}"/>
        <text x="805" y="432" text-anchor="middle" fill="#ffffff" font-size="12.5" font-weight="800">
          ${gf ? '✓ Clear Ground Fault & Reset Fuse' : '⚡ Simulate Ground Fault (Hot Touches Bare Ground)'}
        </text>
      </g>

      <!-- Bottom Selected Conductor Explanation -->
      <rect x="28" y="484" width="1064" height="90" rx="12" fill="${c.cardBg}" stroke="${c.warn}" stroke-width="2"/>
      <text x="50" y="514" fill="${c.warn}" font-size="13.5" font-weight="800">${wireInfo.title}</text>
      <text x="50" y="542" fill="${c.text}" font-size="12.5">${wireInfo.desc}</text>
    `;
  }

  // PANEL 3: Anatomy of Every Part & Why We Need It
  function renderPanel3(c) {
    const sel = state.introPartSel;
    const part = PARTS_GUIDE.find((x) => x.id === sel) || PARTS_GUIDE[0];
    const overload = state.introFuseOverload;
    const pHit = (id) => `class="svg-hit" data-action="intro-pick-part" data-part="${id}"`;

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 03 · PARTS ANATOMY — CLICK ANY PART TO LEARN WHAT IT DOES & WHY WE NEED IT')}

      <!-- 8 Visual Part Cards (4x2 Grid) -->
      ${PARTS_GUIDE.map((pt, idx) => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const x = 28 + col * 268;
        const y = 46 + row * 176;
        const active = pt.id === sel;

        return `
          <g ${pHit(pt.id)}>
            <rect x="${x}" y="${y}" width="252" height="160" rx="12" fill="${c.cardBg}" stroke="${active ? c.warn : c.cardStroke}" stroke-width="${active ? 3 : 1.8}"/>
            <rect x="${x + 14}" y="${y + 12}" width="118" height="20" rx="5" fill="${active ? c.warn : c.stageBg}" stroke="${c.cardStroke}"/>
            <text x="${x + 73}" y="${y + 26}" text-anchor="middle" fill="${active ? '#111827' : c.muted}" font-size="10" font-weight="800">${pt.badge}</text>
            <text x="${x + 14}" y="${y + 54}" fill="${c.text}" font-size="13" font-weight="800">${pt.name.split('(')[0].trim()}</text>
            <text x="${x + 14}" y="${y + 74}" fill="${c.muted}" font-size="11">Click to inspect role →</text>

            ${pt.id === 'psu' ? `
              <rect x="${x + 18}" y="${y + 92}" width="64" height="44" rx="6" fill="#1e293b" stroke="${c.ok}" stroke-width="2"/>
              <text x="${x + 50}" y="${y + 119}" text-anchor="middle" fill="#6ee7b7" font-size="12" font-weight="800">12V 5A</text>
              <text x="${x + 96}" y="${y + 119}" fill="${c.ok}" font-size="11.5" font-weight="700">Safe Pump</text>
            ` : ''}
            ${pt.id === 'fuse' ? `
              <rect x="${x + 18}" y="${y + 92}" width="84" height="44" rx="6" fill="${overload ? '#ef4444' : '#f59e0b'}" fill-opacity="0.2" stroke="${overload ? '#ef4444' : '#f59e0b'}" stroke-width="2"/>
              <path d="M${x + 36} ${y + 114} L${x + 52} ${y + 114} ${overload ? `M${x + 68} ${y + 114}` : `L${x + 68} ${y + 114}`} L${x + 84} ${y + 114}" stroke="${overload ? '#ef4444' : '#fde047'}" stroke-width="3.5" stroke-linecap="round"/>
              <text x="${x + 114}" y="${y + 118}" fill="${overload ? c.danger : c.warn}" font-size="11.5" font-weight="800">${overload ? 'MELTED!' : '5A Link OK'}</text>
            ` : ''}
            ${pt.id === 'busbars' ? `
              <rect x="${x + 18}" y="${y + 94}" width="110" height="14" rx="3" fill="url(#brass-grad)"/>
              <rect x="${x + 18}" y="${y + 116}" width="110" height="14" rx="3" fill="url(#brass-grad)"/>
              <text x="${x + 140}" y="${y + 116}" fill="${c.muted}" font-size="11" font-weight="700">N &amp; G Rails</text>
            ` : ''}
            ${pt.id === 'romex' ? `
              <rect x="${x + 18}" y="${y + 96}" width="110" height="32" rx="6" fill="${c.whiteWire}" stroke="${c.whiteWireBorder}" stroke-width="2"/>
              <text x="${x + 73}" y="${y + 116}" text-anchor="middle" fill="#0f172a" font-size="11.5" font-weight="800">14/2 · 14/3</text>
            ` : ''}
            ${pt.id === 'boxes' ? `
              <rect x="${x + 22}" y="${y + 90}" width="44" height="52" rx="5" fill="${c.blueBox}"/>
              <polygon points="${x+88},${y+98} ${x+100},${y+88} ${x+118},${y+88} ${x+130},${y+98} ${x+130},${y+126} ${x+118},${y+136} ${x+100},${y+136} ${x+88},${y+126}" fill="${c.blueBox}"/>
              <text x="${x + 144}" y="${y + 118}" fill="${c.muted}" font-size="11" font-weight="700">Shields splices</text>
            ` : ''}
            ${pt.id === 'wago' ? `
              <rect x="${x + 22}" y="${y + 96}" width="60" height="36" rx="5" fill="#cbd5e1" fill-opacity="0.35" stroke="#94a3b8" stroke-width="2"/>
              <rect x="${x + 28}" y="${y + 88}" width="12" height="14" fill="#f97316"/>
              <rect x="${x + 46}" y="${y + 88}" width="12" height="14" fill="#f97316"/>
              <rect x="${x + 64}" y="${y + 88}" width="12" height="14" fill="#f97316"/>
              <text x="${x + 96}" y="${y + 118}" fill="${c.muted}" font-size="11" font-weight="700">Joins wires</text>
            ` : ''}
            ${pt.id === 'outlet' ? `
              <rect x="${x + 22}" y="${y + 88}" width="44" height="56" rx="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
              <circle cx="${x + 44}" cy="${y + 104}" r="10" fill="#e2e8f0" stroke="#64748b"/>
              <circle cx="${x + 44}" cy="${y + 128}" r="10" fill="#e2e8f0" stroke="#64748b"/>
              <text x="${x + 78}" y="${y + 118}" fill="${c.muted}" font-size="11" font-weight="700">Plug-in ports</text>
            ` : ''}
            ${pt.id === 'switches' ? `
              <rect x="${x + 22}" y="${y + 88}" width="44" height="56" rx="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
              <rect x="${x + 36}" y="${y + 102}" width="16" height="26" rx="3" fill="#2563eb"/>
              <text x="${x + 78}" y="${y + 118}" fill="${c.muted}" font-size="11" font-weight="700">1-Pole &amp; 3-Way</text>
            ` : ''}
          </g>
        `;
      }).join('')}

      <!-- Interactive Fuse Overload Mini-Demo Bar + Selected Part Spotlight -->
      <rect x="28" y="408" width="1064" height="168" rx="14" fill="${c.cardBg}" stroke="${c.warn}" stroke-width="2.2"/>
      <text x="50" y="438" fill="${c.warn}" font-size="14" font-weight="800">${part.name.toUpperCase()}</text>
      <text x="50" y="466" fill="${c.text}" font-size="12.5"><tspan font-weight="800" fill="${c.ok}">What it is:</tspan> ${part.what}</text>
      <text x="50" y="492" fill="${c.text}" font-size="12.5"><tspan font-weight="800" fill="${c.warn}">Why we need it:</tspan> ${part.why}</text>
      <text x="50" y="518" fill="${c.muted}" font-size="12"><tspan font-weight="800" fill="${c.text}">Real-home equivalent:</tspan> ${part.home}</text>

      <g class="svg-hit" data-action="intro-toggle-overload">
        <rect x="50" y="532" width="420" height="32" rx="8" fill="${overload ? c.ok : '#ef4444'}"/>
        <text x="260" y="553" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">
          ${overload ? '↺ Replace Melted 5A Fuse (Back to 1.5A Normal)' : '🔥 Demo Why Fuses Matter: Push 7A Overload Through 5A Fuse!'}
        </text>
      </g>
    `;
  }

  // PANEL 4: Series vs. Parallel — Why Houses ALWAYS Wire Outlets in Parallel
  function renderPanel4(c) {
    const unplugged = state.introBulbRemoved;

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 04 · SERIES VS PARALLEL — CLICK "UNPLUG BULB #1" TO TEST BOTH CIRCUITS')}

      <!-- Left: SERIES (Bad for Outlets!) -->
      <rect x="28" y="48" width="516" height="430" rx="14" fill="${c.cardBg}" stroke="${c.danger}" stroke-width="2"/>
      <text x="286" y="78" text-anchor="middle" fill="${c.danger}" font-size="15" font-weight="800">SERIES WIRING (1 CHAIN — BAD FOR HOMES)</text>

      <path d="M84 220 L84 140 L486 140 L486 356 L84 356 L84 290" fill="none" stroke="${unplugged ? '#64748b' : c.hotGlow}" stroke-width="6" stroke-linecap="round"/>
      ${!unplugged ? `<path d="M84 220 L84 140 L486 140 L486 356 L84 356 L84 290" fill="none" stroke="#fde047" stroke-width="2.5" class="anim-flow"/>` : ''}

      <rect x="50" y="218" width="70" height="72" rx="10" fill="${c.stageBg}" stroke="#f59e0b" stroke-width="2"/>
      <text x="85" y="258" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="800">12V</text>

      <!-- Series Bulb 1 (Unpluggable) -->
      <g class="svg-hit" data-action="intro-toggle-unplug">
        <circle cx="220" cy="140" r="32" fill="${unplugged ? c.stageBg : '#fef08a'}" stroke="${unplugged ? c.danger : '#eab308'}" stroke-width="2.5" stroke-dasharray="${unplugged ? '5 4' : 'none'}"/>
        <text x="220" y="144" text-anchor="middle" fill="${unplugged ? c.danger : '#111827'}" font-size="11.5" font-weight="800">${unplugged ? 'OUT' : '6V DIM'}</text>
        <text x="220" y="190" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">Bulb #1</text>
      </g>

      <!-- Series Bulb 2 -->
      <circle cx="376" cy="140" r="32" fill="${unplugged ? '#e2e8f0' : '#fef08a'}" stroke="${unplugged ? c.danger : '#eab308'}" stroke-width="2.5"/>
      <text x="376" y="144" text-anchor="middle" fill="${unplugged ? c.danger : '#111827'}" font-size="11.5" font-weight="800">${unplugged ? '0V DEAD' : '6V DIM'}</text>
      <text x="376" y="190" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">Bulb #2</text>

      <rect x="56" y="388" width="460" height="72" rx="10" fill="${c.stageBg}" stroke="${c.danger}" stroke-width="1.5"/>
      <text x="286" y="416" text-anchor="middle" fill="${c.danger}" font-size="12.5" font-weight="800">
        ${unplugged ? 'BLACKOUT! Unplugging Bulb #1 broke the ONLY path!' : 'Voltage splits in half (6V each) → both bulbs glow dimly!'}
      </text>
      <text x="286" y="440" text-anchor="middle" fill="${c.muted}" font-size="11.5">Just like cheap old Christmas lights: one missing bulb kills the whole string.</text>

      <!-- Right: PARALLEL (How Homes Work!) -->
      <rect x="576" y="48" width="516" height="430" rx="14" fill="${c.cardBg}" stroke="${c.ok}" stroke-width="2"/>
      <text x="834" y="78" text-anchor="middle" fill="${c.ok}" font-size="15" font-weight="800">PARALLEL WIRING (INDEPENDENT BRANCHES — NEC)</text>

      <!-- Main Hot & Neutral Rails -->
      <path d="M632 220 L632 140 L976 140" fill="none" stroke="${c.blackWireHighlight}" stroke-width="7"/>
      <path d="M632 140 L976 140" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>
      <path d="M976 356 L632 356 L632 290" fill="none" stroke="${c.whiteWire}" stroke-width="7"/>
      <path d="M976 356 L632 356" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>

      <!-- Branch 1 -->
      <line x1="774" y1="140" x2="774" y2="356" stroke="${unplugged ? '#64748b' : c.hotGlow}" stroke-width="5"/>
      <!-- Branch 2 -->
      <line x1="946" y1="140" x2="946" y2="356" stroke="${c.hotGlow}" stroke-width="5"/>
      <line x1="946" y1="140" x2="946" y2="356" stroke="#fde047" stroke-width="2.5" class="anim-flow"/>

      <rect x="598" y="218" width="70" height="72" rx="10" fill="${c.stageBg}" stroke="#f59e0b" stroke-width="2"/>
      <text x="633" y="258" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="800">12V</text>

      <!-- Parallel Bulb 1 -->
      <g class="svg-hit" data-action="intro-toggle-unplug">
        ${!unplugged ? `<circle cx="774" cy="248" r="46" fill="url(#bulb-glow)" class="anim-glow"/>` : ''}
        <circle cx="774" cy="248" r="30" fill="${unplugged ? c.stageBg : '#fde047'}" stroke="${unplugged ? c.warn : '#f59e0b'}" stroke-width="2.5" stroke-dasharray="${unplugged ? '5 4' : 'none'}"/>
        <text x="774" y="252" text-anchor="middle" fill="${unplugged ? c.warn : '#111827'}" font-size="11.5" font-weight="900">${unplugged ? 'OUT' : '12.0V'}</text>
        <text x="774" y="294" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">Outlet #1</text>
      </g>

      <!-- Parallel Bulb 2 -->
      <circle cx="946" cy="248" r="46" fill="url(#bulb-glow)" class="anim-glow"/>
      <circle cx="946" cy="248" r="30" fill="#fde047" stroke="#f59e0b" stroke-width="2.5"/>
      <text x="946" y="252" text-anchor="middle" fill="#111827" font-size="11.5" font-weight="900">12.0V</text>
      <text x="946" y="294" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">Outlet #2</text>

      <rect x="604" y="388" width="460" height="72" rx="10" fill="${c.stageBg}" stroke="${c.ok}" stroke-width="1.5"/>
      <text x="834" y="416" text-anchor="middle" fill="${c.ok}" font-size="12.5" font-weight="800">
        ${unplugged ? 'OUTLET #2 STAYS FULL BRIGHT! Each branch has its own path.' : 'Every outlet gets the FULL 12.0V independently!'}
      </text>
      <text x="834" y="440" text-anchor="middle" fill="${c.muted}" font-size="11.5">This is why we wire Outlets #1, #2 &amp; #3 in Parallel using pigtails.</text>

      <!-- Bottom Experiment Button -->
      <g class="svg-hit" data-action="intro-toggle-unplug">
        <rect x="330" y="502" width="460" height="52" rx="12" fill="${unplugged ? c.ok : '#2563eb'}"/>
        <text x="560" y="534" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">
          ${unplugged ? '↺ Plug Bulb #1 / Outlet #1 Back In' : '🔌 Unplug Bulb #1 to Test Series vs. Parallel!'}
        </text>
      </g>
    `;
  }

  // PANEL 5: Vision & 12V Safety
  function renderPanel5(c) {
    const hs = state.safetyHotspot;
    const details = {
      panel: {
        title: 'Main Panel Enclosure Stamp',
        desc: 'Mark the fuse/bus enclosure "12V DC ONLY" on the lid so every builder knows it connects strictly to a 12V 5A DC supply or 12V battery.'
      },
      bulbs: {
        title: '12V DC E26 LED Bulbs Stamp',
        desc: 'Both E26 bulbs must be RV/Marine 12V DC rated and tagged "12V DC ONLY" — 120V AC household LED bulbs look identical but will not run on 12V DC.'
      },
      plug: {
        title: 'DIY Polarized Test Plug Stamp',
        desc: 'Your homemade 2-prong polarized test lamp fits standard wall outlets! Tag it "12V DC ONLY" so nobody EVER plugs it into a 120V AC wall receptacle.'
      }
    }[hs];

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 05 · PROJECT VISION & CRITICAL SAFETY PROTOCOL')}

      <g transform="translate(22, 12) scale(0.76)">
        ${svgPlywoodBoard(c)}
        ${svgMainPanelShell(c, { psuOn: true, fuse1: true, fuse2: true })}
        ${svgCeilingLamp(c, 504, 118, true, '12V DC Ceiling LED')}
        ${svgSwitchBox(c, 412, 210, 'Single-Pole', 'Half-Hot Sw', true, '', c.hotGlow)}
        ${svgSwitchBox(c, 514, 210, '3-Way A', 'Traveler Sw', true, '', '#2563eb')}
        ${svgSwitchBox(c, 770, 210, '3-Way B', 'Traveler Sw', true, '', '#2563eb')}
        ${svgDuplexOutlet(c, 462, 378, 'Outlet #1', { topHot: true, botHot: true, idPrefix: 'o1' })}
        ${svgDuplexOutlet(c, 738, 378, 'Outlet #2', { topHot: true, botHot: true, idPrefix: 'o2' })}
        ${svgDuplexOutlet(c, 842, 378, 'Outlet #3 (Split)', { topHot: true, botHot: true, lampSocket: 'o3-top', idPrefix: 'o3' })}

        <path d="M164 270 L164 460 L462 460 M546 460 L738 460 M822 460 L842 460"
          fill="none" stroke="${c.whiteWire}" stroke-width="7" stroke-linecap="round" pathLength="100" class="anim-draw d-2"/>
        <path d="M164 270 L164 460 L462 460 M546 460 L738 460 M822 460 L842 460"
          fill="none" stroke="${c.hotGlow}" stroke-width="2.5" stroke-linecap="round" class="anim-flow"/>

        <path d="M164 240 L164 200 L552 200 L552 210 M590 265 L770 265 M808 210 L808 118 L538 118"
          fill="none" stroke="#93c5fd" stroke-width="7" stroke-linecap="round" pathLength="100" class="anim-draw d-3"/>
        <path d="M164 240 L164 200 L552 200 L552 210 M590 265 L770 265 M808 210 L808 118 L538 118"
          fill="none" stroke="${c.redWire}" stroke-width="2.5" stroke-linecap="round" class="anim-flow"/>
      </g>

      <rect x="65" y="45" width="6" height="405" fill="${c.hotGlow}" opacity="0.65" class="anim-scan"/>

      <g class="svg-hit anim-stamp d-4" data-action="p1-hotspot" data-spot="panel">
        <rect x="86" y="106" width="132" height="32" rx="6" fill="#f59e0b" stroke="${hs === 'panel' ? '#ffffff' : '#78350f'}" stroke-width="${hs === 'panel' ? 3 : 2}"/>
        <text x="152" y="126" text-anchor="middle" fill="#111827" font-size="12" font-weight="900">★ 12V DC ONLY</text>
      </g>

      <g class="svg-hit anim-stamp d-5" data-action="p1-hotspot" data-spot="bulbs">
        <rect x="336" y="44" width="136" height="32" rx="6" fill="#f59e0b" stroke="${hs === 'bulbs' ? '#ffffff' : '#78350f'}" stroke-width="${hs === 'bulbs' ? 3 : 2}"/>
        <text x="404" y="64" text-anchor="middle" fill="#111827" font-size="12" font-weight="900">★ 12V DC ONLY</text>
      </g>

      <g class="svg-hit anim-stamp d-6" data-action="p1-hotspot" data-spot="plug">
        <rect x="598" y="428" width="136" height="32" rx="6" fill="#f59e0b" stroke="${hs === 'plug' ? '#ffffff' : '#78350f'}" stroke-width="${hs === 'plug' ? 3 : 2}"/>
        <text x="666" y="448" text-anchor="middle" fill="#111827" font-size="12" font-weight="900">★ 12V DC ONLY</text>
      </g>

      <g class="anim-fade d-3">
        <rect x="780" y="54" width="310" height="372" rx="14" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="2"/>
        <text x="935" y="84" text-anchor="middle" fill="${c.text}" font-size="14" font-weight="800">SAFETY BOUNDARY</text>

        <rect x="800" y="102" width="270" height="116" rx="10" fill="${c.ok}" fill-opacity="0.12" stroke="${c.ok}" stroke-width="2"/>
        <circle cx="828" cy="132" r="14" fill="${c.ok}"/>
        <path d="M821 132 L826 137 L836 126" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <text x="852" y="130" fill="${c.text}" font-size="13.5" font-weight="800">12V DC · 5A Supply</text>
        <text x="852" y="148" fill="${c.ok}" font-size="11.5" font-weight="700">ZERO SHOCK HAZARD</text>
        <text x="814" y="176" fill="${c.muted}" font-size="11.5">• Safe touch-level DC voltage</text>
        <text x="814" y="196" fill="${c.muted}" font-size="11.5">• Protected by 5A automotive fuses</text>

        <rect x="800" y="234" width="270" height="118" rx="10" fill="${c.danger}" fill-opacity="0.12" stroke="${c.danger}" stroke-width="2"/>
        <circle cx="828" cy="264" r="14" fill="${c.danger}"/>
        <path d="M821 257 L835 271 M835 257 L821 271" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <text x="852" y="262" fill="${c.text}" font-size="13.5" font-weight="800">120V AC Wall Power</text>
        <text x="852" y="280" fill="${c.danger}" font-size="11.5" font-weight="800">NEVER CONNECT TO BOARD</text>
        <text x="814" y="308" fill="${c.muted}" font-size="11.5">• 12V fuse blocks are not 120V rated</text>
        <text x="814" y="328" fill="${c.muted}" font-size="11.5">• Never plug DIY test lamp into wall</text>

        <text x="935" y="388" text-anchor="middle" fill="${c.muted}" font-size="11.5">Click any yellow stamp on the left</text>
        <text x="935" y="405" text-anchor="middle" fill="${c.muted}" font-size="11.5">to inspect that safety label</text>
      </g>

      <g class="anim-fade d-5">
        <rect x="34" y="486" width="1056" height="84" rx="12" fill="${c.cardBg}" stroke="${c.warn}" stroke-width="2"/>
        <rect x="50" y="502" width="10" height="52" rx="4" fill="${c.warn}"/>
        <text x="74" y="522" fill="${c.warn}" font-size="13" font-weight="800">SELECTED LABEL: ${details.title.toUpperCase()}</text>
        <text x="74" y="548" fill="${c.text}" font-size="12.5">${details.desc}</text>
      </g>
    `;
  }

  // PANEL 6: Knolling Bench
  function renderPanel6(c) {
    const sel = state.bomSelected;
    const item = BOM_ITEMS.find((b) => b.id === sel) || BOM_ITEMS[0];
    const isSel = (id) => sel === id;
    const boxAttr = (id) => `class="svg-hit" data-action="bom-select" data-id="${id}"`;
    const hi = (id, defStroke) => (isSel(id) ? '#f59e0b' : defStroke);
    const hiW = (id) => (isSel(id) ? 3.5 : 1.8);

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 06 · KNOLLING WORKBENCH — CLICK ANY PART OR CHECK OFF ITEMS IN THE BOM DRAWER')}

      <rect x="24" y="44" width="1072" height="444" rx="14" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="2"/>

      <text x="44" y="70" fill="${c.muted}" font-size="11.5" font-weight="800">1. BOARD &amp; FRAMING</text>
      <g ${boxAttr('plywood')}>
        <rect x="44" y="80" width="182" height="96" rx="6" fill="${c.plywood}" stroke="${hi('plywood', c.plywoodEdge)}" stroke-width="${hiW('plywood')}"/>
        <text x="135" y="124" text-anchor="middle" fill="#111827" font-size="12" font-weight="800">2' × 4' Plywood</text>
        <text x="135" y="142" text-anchor="middle" fill="#451a03" font-size="10.5">1/2" or 3/4" thick</text>
      </g>
      <g ${boxAttr('studs')}>
        <rect x="44" y="188" width="136" height="16" rx="3" fill="${c.stud}" stroke="${hi('studs', c.studStroke)}" stroke-width="${hiW('studs')}"/>
        <rect x="44" y="208" width="136" height="16" rx="3" fill="${c.stud}" stroke="${hi('studs', c.studStroke)}" stroke-width="${hiW('studs')}"/>
        <rect x="44" y="228" width="136" height="16" rx="3" fill="${c.stud}" stroke="${hi('studs', c.studStroke)}" stroke-width="${hiW('studs')}"/>
        <text x="112" y="262" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="700">3× 2ft (2×4) Studs</text>
      </g>
      <g ${boxAttr('screws')}>
        <rect x="190" y="188" width="56" height="58" rx="6" fill="${c.stageBg}" stroke="${hi('screws', c.cardStroke)}" stroke-width="${hiW('screws')}"/>
        <path d="M205 204 L231 204 M218 204 L218 230" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
        <text x="218" y="262" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Screws</text>
      </g>

      <text x="274" y="70" fill="${c.muted}" font-size="11.5" font-weight="800">2. POWER &amp; MAIN PANEL</text>
      <g ${boxAttr('psu')}>
        <rect x="274" y="82" width="118" height="72" rx="8" fill="${c.stageBg}" stroke="${hi('psu', c.ok)}" stroke-width="${hiW('psu')}"/>
        <rect x="288" y="96" width="44" height="32" rx="4" fill="#1e293b" stroke="#64748b"/>
        <path d="M332 112 L358 112" stroke="${c.redWire}" stroke-width="3"/>
        <rect x="356" y="102" width="22" height="20" rx="3" fill="#16a34a"/>
        <text x="333" y="145" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">12V 5A PSU</text>
      </g>
      <g ${boxAttr('fuseblock')}>
        <rect x="402" y="82" width="108" height="72" rx="8" fill="${c.stageBg}" stroke="${hi('fuseblock', c.warn)}" stroke-width="${hiW('fuseblock')}"/>
        <rect x="416" y="94" width="18" height="24" rx="2" fill="#f59e0b"/>
        <rect x="438" y="94" width="18" height="24" rx="2" fill="#ef4444"/>
        <rect x="460" y="94" width="18" height="24" rx="2" fill="#3b82f6"/>
        <rect x="482" y="94" width="18" height="24" rx="2" fill="#eab308"/>
        <text x="456" y="145" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Fuse Block</text>
      </g>
      <g ${boxAttr('busbars')}>
        <rect x="274" y="166" width="118" height="78" rx="8" fill="${c.stageBg}" stroke="${hi('busbars', c.brass)}" stroke-width="${hiW('busbars')}"/>
        <rect x="288" y="182" width="90" height="12" rx="2" fill="url(#brass-grad)"/>
        <rect x="288" y="202" width="90" height="12" rx="2" fill="url(#brass-grad)"/>
        <text x="333" y="234" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">2× Brass Bus Bars</text>
      </g>
      <g ${boxAttr('enclosure')}>
        <rect x="402" y="166" width="108" height="78" rx="8" fill="${c.stageBg}" stroke="${hi('enclosure', c.cardStroke)}" stroke-width="${hiW('enclosure')}"/>
        <rect x="422" y="178" width="68" height="44" rx="5" fill="#cbd5e1" fill-opacity="0.2" stroke="#94a3b8" stroke-width="2"/>
        <text x="456" y="236" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Panel Box</text>
      </g>

      <text x="536" y="70" fill="${c.muted}" font-size="11.5" font-weight="800">3. WIRE, BOXES &amp; HARDWARE</text>
      <g ${boxAttr('romex142')}>
        <circle cx="584" cy="124" r="38" fill="none" stroke="${hi('romex142', c.whiteWireBorder)}" stroke-width="${isSel('romex142') ? 10 : 8}"/>
        <circle cx="584" cy="124" r="38" fill="none" stroke="${c.whiteWire}" stroke-width="5"/>
        <text x="584" y="128" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="800">14/2</text>
        <text x="584" y="176" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">25' Romex</text>
      </g>
      <g ${boxAttr('romex143')}>
        <circle cx="686" cy="124" r="38" fill="none" stroke="${hi('romex143', '#ea580c')}" stroke-width="${isSel('romex143') ? 10 : 8}"/>
        <circle cx="686" cy="124" r="38" fill="none" stroke="#facc15" stroke-width="4.5"/>
        <text x="686" y="128" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="800">14/3</text>
        <text x="686" y="176" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">15' Romex</text>
      </g>
      <g ${boxAttr('boxes1g')}>
        <rect x="748" y="86" width="44" height="58" rx="4" fill="${c.blueBox}" stroke="${hi('boxes1g', c.blueBoxDark)}" stroke-width="${hiW('boxes1g')}"/>
        <text x="770" y="120" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">4×</text>
        <text x="770" y="162" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">1-Gang</text>
      </g>
      <g ${boxAttr('boxoct')}>
        <polygon points="818,96 832,86 852,86 866,96 866,116 852,126 832,126 818,116" fill="${c.blueBox}" stroke="${hi('boxoct', c.blueBoxDark)}" stroke-width="${hiW('boxoct')}"/>
        <text x="842" y="110" text-anchor="middle" fill="#ffffff" font-size="10.5" font-weight="800">OCT</text>
        <text x="842" y="146" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Ceiling Box</text>
      </g>
      <g ${boxAttr('wagos')}>
        <rect x="542" y="192" width="112" height="54" rx="7" fill="${c.stageBg}" stroke="${hi('wagos', '#ea580c')}" stroke-width="${hiW('wagos')}"/>
        <rect x="554" y="204" width="24" height="16" rx="2" fill="#94a3b8"/>
        <rect x="558" y="199" width="6" height="8" fill="#f97316"/>
        <rect x="568" y="199" width="6" height="8" fill="#f97316"/>
        <polygon points="608,222 618,200 628,222" fill="#eab308"/>
        <text x="598" y="238" text-anchor="middle" fill="${c.text}" font-size="10" font-weight="700">Wago 221 / Nuts</text>
      </g>
      <g ${boxAttr('staples')}>
        <rect x="664" y="192" width="98" height="54" rx="7" fill="${c.stageBg}" stroke="${hi('staples', c.cardStroke)}" stroke-width="${hiW('staples')}"/>
        <path d="M692 220 L692 204 L732 204 L732 220" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <text x="713" y="238" text-anchor="middle" fill="${c.text}" font-size="10" font-weight="700">1/2" Staples</text>
      </g>
      <g ${boxAttr('groundscrews')}>
        <rect x="772" y="192" width="98" height="54" rx="7" fill="${c.stageBg}" stroke="${hi('groundscrews', c.greenGround)}" stroke-width="${hiW('groundscrews')}"/>
        <circle cx="802" cy="212" r="7" fill="${c.greenGround}"/>
        <circle cx="822" cy="212" r="7" fill="${c.greenGround}"/>
        <circle cx="842" cy="212" r="7" fill="${c.greenGround}"/>
        <text x="821" y="238" text-anchor="middle" fill="${c.text}" font-size="10" font-weight="700">Green Screws</text>
      </g>

      <text x="44" y="298" fill="${c.muted}" font-size="11.5" font-weight="800">4. SWITCHES, OUTLETS &amp; 12V LOADS</text>
      <g ${boxAttr('outlets')}>
        <rect x="44" y="308" width="116" height="86" rx="8" fill="${c.stageBg}" stroke="${hi('outlets', c.cardStroke)}" stroke-width="${hiW('outlets')}"/>
        <rect x="58" y="318" width="24" height="44" rx="4" fill="#f8fafc" stroke="#64748b"/>
        <rect x="88" y="318" width="24" height="44" rx="4" fill="#f8fafc" stroke="#64748b"/>
        <rect x="118" y="318" width="24" height="44" rx="4" fill="#f8fafc" stroke="#64748b"/>
        <text x="102" y="382" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">3× Duplex Outlets</text>
      </g>
      <g ${boxAttr('sw1p')}>
        <rect x="170" y="308" width="94" height="86" rx="8" fill="${c.stageBg}" stroke="${hi('sw1p', c.cardStroke)}" stroke-width="${hiW('sw1p')}"/>
        <rect x="200" y="318" width="32" height="44" rx="4" fill="#f8fafc" stroke="#64748b"/>
        <rect x="212" y="328" width="8" height="20" rx="2" fill="#0f172a"/>
        <text x="217" y="382" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">1-Pole Switch</text>
      </g>
      <g ${boxAttr('sw3w')}>
        <rect x="274" y="308" width="108" height="86" rx="8" fill="${c.stageBg}" stroke="${hi('sw3w', '#3b82f6')}" stroke-width="${hiW('sw3w')}"/>
        <rect x="292" y="318" width="28" height="44" rx="4" fill="#f8fafc" stroke="#64748b"/>
        <rect x="332" y="318" width="28" height="44" rx="4" fill="#f8fafc" stroke="#64748b"/>
        <text x="328" y="382" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">2× 3-Way Sw</text>
      </g>
      <g ${boxAttr('lampholder')}>
        <rect x="392" y="308" width="110" height="86" rx="8" fill="${c.stageBg}" stroke="${hi('lampholder', c.cardStroke)}" stroke-width="${hiW('lampholder')}"/>
        <circle cx="447" cy="340" r="22" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
        <circle cx="447" cy="340" r="10" fill="#cbd5e1"/>
        <text x="447" y="382" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Keyless E26</text>
      </g>
      <g ${boxAttr('bulbs12v')}>
        <rect x="512" y="308" width="116" height="86" rx="8" fill="${c.stageBg}" stroke="${hi('bulbs12v', c.warn)}" stroke-width="${hiW('bulbs12v')}"/>
        <circle cx="550" cy="338" r="15" fill="#fde047" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="590" cy="338" r="15" fill="#fde047" stroke="#f59e0b" stroke-width="2"/>
        <text x="570" y="382" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">2× 12V DC Bulbs</text>
      </g>
      <g ${boxAttr('testplug')}>
        <rect x="638" y="308" width="118" height="86" rx="8" fill="${c.stageBg}" stroke="${hi('testplug', c.warn)}" stroke-width="${hiW('testplug')}"/>
        <rect x="660" y="328" width="24" height="20" rx="3" fill="#1e293b"/>
        <path d="M684 338 L710 338" stroke="#64748b" stroke-width="3"/>
        <circle cx="722" cy="338" r="12" fill="#fde047" stroke="#f59e0b"/>
        <text x="697" y="382" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">DIY Test Lamp</text>
      </g>
      <g ${boxAttr('plates')}>
        <rect x="766" y="308" width="104" height="86" rx="8" fill="${c.stageBg}" stroke="${hi('plates', c.cardStroke)}" stroke-width="${hiW('plates')}"/>
        <rect x="800" y="318" width="36" height="44" rx="3" fill="#f8fafc" stroke="#94a3b8"/>
        <text x="818" y="382" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Wall Plates</text>
      </g>

      <text x="896" y="70" fill="${c.muted}" font-size="11.5" font-weight="800">5. BASIC TOOLS</text>
      <g ${boxAttr('strippers')}>
        <rect x="896" y="82" width="176" height="70" rx="8" fill="${c.stageBg}" stroke="${hi('strippers', '#ef4444')}" stroke-width="${hiW('strippers')}"/>
        <path d="M922 114 L967 114" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
        <path d="M967 114 L992 106 M967 114 L992 122" stroke="#94a3b8" stroke-width="3"/>
        <text x="984" y="138" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">14 AWG Strippers</text>
      </g>
      <g ${boxAttr('pliers')}>
        <rect x="896" y="162" width="176" height="70" rx="8" fill="${c.stageBg}" stroke="${hi('pliers', '#3b82f6')}" stroke-width="${hiW('pliers')}"/>
        <path d="M924 192 L966 192 L994 189 M966 192 L994 195" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/>
        <text x="984" y="218" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Needle-Nose Pliers</text>
      </g>
      <g ${boxAttr('drivers')}>
        <rect x="896" y="242" width="176" height="70" rx="8" fill="${c.stageBg}" stroke="${hi('drivers', '#eab308')}" stroke-width="${hiW('drivers')}"/>
        <rect x="922" y="262" width="36" height="12" rx="4" fill="#eab308"/>
        <line x1="958" y1="268" x2="1006" y2="268" stroke="#94a3b8" stroke-width="3"/>
        <text x="984" y="298" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Screwdrivers</text>
      </g>
      <g ${boxAttr('dmm')}>
        <rect x="896" y="322" width="176" height="74" rx="8" fill="${c.stageBg}" stroke="${hi('dmm', c.ok)}" stroke-width="${hiW('dmm')}"/>
        <rect x="926" y="332" width="44" height="24" rx="3" fill="#064e3b"/>
        <text x="948" y="348" text-anchor="middle" fill="#6ee7b7" font-size="11" font-family="monospace" font-weight="700">12.0V</text>
        <text x="984" y="384" text-anchor="middle" fill="${c.text}" font-size="10.5" font-weight="700">Digital Multimeter</text>
      </g>

      <rect x="24" y="502" width="1072" height="74" rx="12" fill="${c.cardBg}" stroke="${c.warn}" stroke-width="2"/>
      <text x="46" y="530" fill="${c.warn}" font-size="13" font-weight="800">[${item.cat.toUpperCase()}]  ${item.name}</text>
      <text x="46" y="556" fill="${c.text}" font-size="12.5">${item.spec}</text>
    `;
  }

  // PANEL 7: Step 1 — Framing & Boxes
  function renderPanel7(c) {
    const step = state.frameStep;
    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 07 · STEP 1 — FRAME THE 48"×24" MOCK WALL & NAIL ON BOXES')}

      <g class="anim-fade d-1">
        <line x1="70" y1="38" x2="950" y2="38" stroke="${c.muted}" stroke-width="1.5"/>
        <line x1="70" y1="30" x2="70" y2="46" stroke="${c.muted}" stroke-width="1.5"/>
        <line x1="950" y1="30" x2="950" y2="46" stroke="${c.muted}" stroke-width="1.5"/>
        <rect x="454" y="26" width="112" height="22" rx="4" fill="${c.cardBg}" stroke="${c.cardStroke}"/>
        <text x="510" y="41" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">48" (4 ft) Wide</text>

        <line x1="974" y1="54" x2="974" y2="546" stroke="${c.muted}" stroke-width="1.5"/>
        <line x1="966" y1="54" x2="982" y2="54" stroke="${c.muted}" stroke-width="1.5"/>
        <line x1="966" y1="546" x2="982" y2="546" stroke="${c.muted}" stroke-width="1.5"/>
        <rect x="986" y="282" width="102" height="32" rx="6" fill="${c.cardBg}" stroke="${c.cardStroke}"/>
        <text x="1037" y="302" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">24" (2 ft)</text>
      </g>

      ${svgPlywoodBoard(c, { showStuds: step >= 1, animStuds: true })}

      ${step >= 1 ? `
        <g class="anim-pop d-3">
          <rect x="180" y="72" width="132" height="26" rx="5" fill="${c.cardBg}" stroke="${c.cardStroke}"/>
          <text x="246" y="89" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="700">① 3× 2ft Studs</text>
        </g>
      ` : ''}

      ${step >= 2 ? `
        <g class="anim-pop d-2">
          <rect x="92" y="138" width="144" height="236" rx="10" fill="${c.cardBg}" stroke="${c.warn}" stroke-width="3"/>
          <rect x="102" y="148" width="124" height="26" rx="4" fill="#f59e0b"/>
          <text x="164" y="165" text-anchor="middle" fill="#111827" font-size="11.5" font-weight="800">12V DC ONLY</text>
          <text x="164" y="256" text-anchor="middle" fill="${c.text}" font-size="12" font-weight="700">② Main Panel</text>
          <text x="164" y="274" text-anchor="middle" fill="${c.muted}" font-size="11">Left Stud Mount</text>
        </g>
      ` : ''}

      ${step >= 3 ? `
        <g class="anim-pop d-3">
          <rect x="394" y="206" width="76" height="114" rx="7" fill="${c.blueBox}" stroke="#93c5fd" stroke-width="2.5"/>
          <text x="432" y="258" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">1-Pole</text>
          <text x="432" y="274" text-anchor="middle" fill="#dbeafe" font-size="10">Switch</text>

          <rect x="536" y="206" width="76" height="114" rx="7" fill="${c.blueBox}" stroke="#93c5fd" stroke-width="2.5"/>
          <text x="574" y="258" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">3-Way A</text>
          <text x="574" y="274" text-anchor="middle" fill="#dbeafe" font-size="10">Switch</text>

          <rect x="462" y="376" width="84" height="122" rx="7" fill="${c.blueBox}" stroke="#93c5fd" stroke-width="2.5"/>
          <text x="504" y="434" text-anchor="middle" fill="#ffffff" font-size="11.5" font-weight="800">Outlet #1</text>
          <text x="504" y="450" text-anchor="middle" fill="#dbeafe" font-size="10">Center Stud</text>

          <rect x="772" y="206" width="76" height="114" rx="7" fill="${c.blueBox}" stroke="#93c5fd" stroke-width="2.5"/>
          <text x="810" y="258" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">3-Way B</text>
          <text x="810" y="274" text-anchor="middle" fill="#dbeafe" font-size="10">Right Stud</text>

          <rect x="742" y="376" width="84" height="122" rx="7" fill="${c.blueBox}" stroke="#93c5fd" stroke-width="2.5"/>
          <text x="784" y="434" text-anchor="middle" fill="#ffffff" font-size="11.5" font-weight="800">Outlet #2</text>
          <text x="784" y="450" text-anchor="middle" fill="#dbeafe" font-size="10">Parallel</text>

          <rect x="912" y="376" width="84" height="122" rx="7" fill="${c.blueBox}" stroke="#fbbf24" stroke-width="2.5"/>
          <text x="954" y="434" text-anchor="middle" fill="#ffffff" font-size="11.5" font-weight="800">Outlet #3</text>
          <text x="954" y="450" text-anchor="middle" fill="#fde68a" font-size="10">Half-Hot</text>

          <rect x="640" y="316" width="160" height="26" rx="5" fill="${c.cardBg}" stroke="${c.cardStroke}"/>
          <text x="720" y="333" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="700">③ Nail-On Wall Boxes</text>
        </g>
      ` : ''}

      ${step >= 4 ? `
        <g class="anim-pop d-4">
          <polygon points="470,104 490,84 518,84 538,104 538,132 518,152 490,152 470,132"
            fill="${c.blueBox}" stroke="#fde047" stroke-width="3"/>
          <text x="504" y="122" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">OCT</text>
          <rect x="554" y="102" width="178" height="28" rx="6" fill="${c.cardBg}" stroke="${c.ok}" stroke-width="1.5"/>
          <text x="643" y="120" text-anchor="middle" fill="${c.ok}" font-size="11.5" font-weight="700">④ Ceiling Octagon Box</text>
        </g>
      ` : ''}
    `;
  }

  // PANEL 8: Step 2 — Main Panel Cutaway + Main vs Subpanel Bond Toggle
  function renderPanel8(c) {
    const f1 = state.p4Fuse1;
    const f2 = state.p4Fuse2;
    const bonded = !state.p4Subpanel;

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 08 · STEP 2 — MAIN PANEL CUTAWAY (CLICK FUSES OR TOGGLE MAIN VS SUBPANEL BOND)')}

      <rect x="44" y="48" width="700" height="510" rx="18" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="3"/>
      <rect x="68" y="64" width="240" height="34" rx="7" fill="#f59e0b"/>
      <text x="188" y="86" text-anchor="middle" fill="#111827" font-size="14" font-weight="900">12V DC ONLY · ${bonded ? 'MAIN PANEL' : 'SUBPANEL MODE'}</text>

      <!-- Mode Toggle Inside Panel Header -->
      <g class="svg-hit" data-action="p4-toggle-bond">
        <rect x="330" y="64" width="388" height="34" rx="7" fill="${bonded ? c.ok : c.warn}" fill-opacity="0.16" stroke="${bonded ? c.ok : c.warn}" stroke-width="1.8"/>
        <text x="524" y="85" text-anchor="middle" fill="${bonded ? c.ok : c.warn}" font-size="12" font-weight="800">
          ${bonded ? '✓ MAIN SERVICE PANEL (Bond Jumper Installed) — Click to Compare' : '⚠ SUBPANEL (Bond Removed — Neutrals & Grounds Isolated)'}
        </text>
      </g>

      <!-- 12V PSU Input -->
      <rect x="80" y="468" width="236" height="68" rx="10" fill="${c.stageBg}" stroke="${c.ok}" stroke-width="2.5"/>
      <text x="198" y="492" text-anchor="middle" fill="${c.text}" font-size="13" font-weight="800">12V DC 5A Power Supply</text>
      <text x="140" y="516" text-anchor="middle" fill="${c.redWire}" font-size="12" font-weight="800">+12V POS</text>
      <text x="256" y="516" text-anchor="middle" fill="${c.muted}" font-size="12" font-weight="800">-12V NEG</text>

      <!-- Blade Fuse Block -->
      <rect x="80" y="132" width="248" height="256" rx="12" fill="${c.stageBg}" stroke="${c.cardStroke}" stroke-width="2"/>
      <text x="204" y="158" text-anchor="middle" fill="${c.text}" font-size="13" font-weight="800">BLADE FUSE BLOCK (+12V)</text>
      <rect x="108" y="182" width="24" height="180" rx="4" fill="${c.copperBright}" stroke="#78350f" stroke-width="1.5"/>
      <text x="120" y="175" text-anchor="middle" fill="${c.redWire}" font-size="11" font-weight="800">+BUS</text>

      <path d="M120 468 L120 362" fill="none" stroke="${c.redWire}" stroke-width="6" stroke-linecap="round" pathLength="100" class="anim-draw d-1"/>
      <path d="M120 468 L120 362" fill="none" stroke="#fde047" stroke-width="2.5" stroke-linecap="round" class="anim-flow"/>

      <g class="svg-hit" data-action="p4-toggle-f1">
        <rect x="148" y="198" width="160" height="62" rx="8" fill="${f1 ? '#f59e0b' : '#ef4444'}" fill-opacity="0.16" stroke="${f1 ? '#f59e0b' : '#ef4444'}" stroke-width="2.5"/>
        <text x="228" y="224" text-anchor="middle" fill="${c.text}" font-size="13" font-weight="800">FUSE #1 · 5A Blade</text>
        <text x="228" y="244" text-anchor="middle" fill="${f1 ? c.ok : c.danger}" font-size="11.5" font-weight="700">${f1 ? 'INSTALLED · C1 LIVE' : 'PULLED · C1 DEAD'}</text>
      </g>

      <g class="svg-hit" data-action="p4-toggle-f2">
        <rect x="148" y="280" width="160" height="62" rx="8" fill="${f2 ? '#f59e0b' : '#ef4444'}" fill-opacity="0.16" stroke="${f2 ? '#f59e0b' : '#ef4444'}" stroke-width="2.5"/>
        <text x="228" y="306" text-anchor="middle" fill="${c.text}" font-size="13" font-weight="800">FUSE #2 · 5A Blade</text>
        <text x="228" y="326" text-anchor="middle" fill="${f2 ? c.ok : c.danger}" font-size="11.5" font-weight="700">${f2 ? 'INSTALLED · C2 LIVE' : 'PULLED · C2 DEAD'}</text>
      </g>

      <!-- Branch Outputs -->
      <path d="M308 228 L774 228" fill="none" stroke="${f1 ? c.blackWireHighlight : '#64748b'}" stroke-width="5.5" stroke-linecap="round"/>
      ${f1 ? `<path d="M308 228 L774 228" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>` : ''}
      <text x="784" y="224" fill="${f1 ? c.warn : c.muted}" font-size="12" font-weight="800">Circuit 1 Hot (Outlets)</text>
      <text x="784" y="240" fill="${c.muted}" font-size="11">${f1 ? '+12.04V DC' : '0.00V DC'}</text>

      <path d="M308 310 L774 310" fill="none" stroke="${f2 ? c.blackWireHighlight : '#64748b'}" stroke-width="5.5" stroke-linecap="round"/>
      ${f2 ? `<path d="M308 310 L774 310" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>` : ''}
      <text x="784" y="306" fill="${f2 ? c.warn : c.muted}" font-size="12" font-weight="800">Circuit 2 Hot (3-Way Light)</text>
      <text x="784" y="322" fill="${c.muted}" font-size="11">${f2 ? '+12.04V DC' : '0.00V DC'}</text>

      <!-- Neutral & Ground Bus Bars -->
      <rect x="434" y="132" width="68" height="256" rx="8" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="2.5"/>
      <text x="468" y="122" text-anchor="middle" fill="${c.text}" font-size="12" font-weight="800">NEUTRAL BUS</text>
      ${[166, 206, 246, 286, 326, 362].map((yy) => `<circle cx="468" cy="${yy}" r="7" fill="#78350f" stroke="#fef08a" stroke-width="1.5"/>`).join('')}

      <path d="M256 468 L256 432 L468 432 L468 362" fill="none" stroke="${c.blackWire}" stroke-width="6" stroke-linecap="round"/>

      <rect x="606" y="132" width="68" height="256" rx="8" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="2.5"/>
      <text x="640" y="122" text-anchor="middle" fill="${c.greenGround}" font-size="12" font-weight="800">GROUND BUS</text>
      ${[166, 206, 246, 286, 326, 362].map((yy) => `<circle cx="640" cy="${yy}" r="7" fill="#78350f" stroke="#fef08a" stroke-width="1.5"/>`).join('')}

      <!-- Main Bonding Jumper -->
      ${bonded ? `
        <path d="M468 362 L640 362" fill="none" stroke="${c.copper}" stroke-width="8" stroke-linecap="round" pathLength="100" class="anim-draw d-3"/>
        <rect x="488" y="374" width="136" height="38" rx="6" fill="${c.stageBg}" stroke="${c.copper}" stroke-width="1.5"/>
        <text x="556" y="391" text-anchor="middle" fill="${c.copperBright}" font-size="11" font-weight="800">BONDING JUMPER</text>
        <text x="556" y="405" text-anchor="middle" fill="${c.muted}" font-size="10">Main Panel Only</text>
      ` : `
        <line x1="480" y1="362" x2="628" y2="362" stroke="${c.danger}" stroke-width="3" stroke-dasharray="6 6"/>
        <rect x="480" y="374" width="152" height="38" rx="6" fill="${c.stageBg}" stroke="${c.danger}" stroke-width="1.5"/>
        <text x="556" y="391" text-anchor="middle" fill="${c.danger}" font-size="11" font-weight="800">ISOLATED (NO BOND)</text>
        <text x="556" y="405" text-anchor="middle" fill="${c.muted}" font-size="10">Subpanel Rule</text>
      `}

      <path d="M774 166 L468 166" fill="none" stroke="${c.whiteWire}" stroke-width="5" stroke-linecap="round"/>
      <text x="784" y="170" fill="${c.text}" font-size="11.5" font-weight="700">White Neutrals → Neutral Bus</text>
      <path d="M774 266 L640 266" fill="none" stroke="${c.copper}" stroke-width="4" stroke-linecap="round"/>
      <text x="784" y="270" fill="${c.copperBright}" font-size="11.5" font-weight="700">Bare Grounds → Ground Bus</text>

      <!-- Diagnostic Card -->
      <rect x="774" y="356" width="318" height="202" rx="12" fill="${c.cardBg}" stroke="${c.ok}" stroke-width="2"/>
      <text x="933" y="384" text-anchor="middle" fill="${c.muted}" font-size="11.5" font-weight="800">PANEL DIAGNOSTIC READOUT</text>
      <rect x="798" y="398" width="270" height="50" rx="8" fill="#064e3b"/>
      <text x="933" y="431" text-anchor="middle" fill="#6ee7b7" font-size="24" font-family="monospace" font-weight="800">12.04 V DC</text>
      <text x="798" y="474" fill="${c.text}" font-size="11.5">• +12V to Neutral Bus: <tspan font-weight="700" fill="${c.ok}">12.04V DC</tspan></text>
      <text x="798" y="496" fill="${c.text}" font-size="11.5">• +12V to Ground Bus: <tspan font-weight="700" fill="${bonded ? c.ok : c.warn}">${bonded ? '12.04V DC' : 'FLOATING'}</tspan></text>
      <text x="798" y="518" fill="${c.text}" font-size="11.5">• N ↔ G Continuity: <tspan font-weight="700" fill="${bonded ? c.ok : c.danger}">${bonded ? '0.1 Ω (BONDED)' : 'OL (ISOLATED)'}</tspan></text>
      <text x="798" y="542" fill="${c.muted}" font-size="10.5">For our training board, keep it BONDED!</text>
    `;
  }

  // PANEL 9: Craft Lab 1 — Strip & Interactive Screw-Torque Physics
  function renderPanel9(c) {
    const cw = state.p5HookMode === 'cw';
    const rot = (state.p5TorqueCount % 4) * 90;
    const cinched = state.p5TorqueCount > 0;

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 09 · CRAFT LAB 1 — NM-B STRIPPING & INTERACTIVE SCREW-TORQUE PHYSICS')}

      <!-- Left Half: Romex Rip & 5/8" Strip -->
      <rect x="28" y="48" width="510" height="516" rx="14" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="2"/>
      <text x="283" y="80" text-anchor="middle" fill="${c.text}" font-size="15" font-weight="800">1. RIP OUTER JACKET &amp; STRIP 5/8"</text>

      <rect x="58" y="182" width="152" height="58" rx="7" fill="${c.whiteWire}" stroke="${c.whiteWireBorder}" stroke-width="2"/>
      <text x="134" y="216" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="800">14/2 NM-B</text>
      <path d="M148 211 L210 211" stroke="#ef4444" stroke-width="3.5" stroke-dasharray="5 3" pathLength="100" class="anim-draw d-1"/>

      <!-- Emerging Conductors -->
      <path d="M210 194 L390 144" fill="none" stroke="${c.blackWire}" stroke-width="11" stroke-linecap="round" pathLength="100" class="anim-draw d-2"/>
      <path d="M390 144 L460 124" fill="none" stroke="${c.copper}" stroke-width="6" stroke-linecap="round" pathLength="100" class="anim-draw d-3"/>
      <text x="295" y="144" fill="${c.text}" font-size="12" font-weight="700">Black (Hot +12V)</text>

      <path d="M210 211 L390 211" fill="none" stroke="${c.whiteWire}" stroke-width="11" stroke-linecap="round" pathLength="100" class="anim-draw d-2"/>
      <path d="M390 211 L460 211" fill="none" stroke="${c.copper}" stroke-width="6" stroke-linecap="round" pathLength="100" class="anim-draw d-3"/>
      <text x="290" y="236" fill="${c.text}" font-size="12" font-weight="700">White (Neutral -12V)</text>

      <path d="M210 228 L460 296" fill="none" stroke="${c.copper}" stroke-width="6" stroke-linecap="round" pathLength="100" class="anim-draw d-2"/>
      <text x="298" y="286" fill="${c.copperBright}" font-size="12" font-weight="700">Bare Copper (Ground)</text>

      <!-- 5/8" Gauge Ruler -->
      <line x1="390" y1="336" x2="460" y2="336" stroke="${c.warn}" stroke-width="2.5"/>
      <line x1="390" y1="326" x2="390" y2="346" stroke="${c.warn}" stroke-width="2.5"/>
      <line x1="460" y1="326" x2="460" y2="346" stroke="${c.warn}" stroke-width="2.5"/>
      <text x="425" y="362" text-anchor="middle" fill="${c.warn}" font-size="12.5" font-weight="800">5/8" Strip Gauge</text>

      <rect x="52" y="388" width="462" height="150" rx="10" fill="${c.stageBg}" stroke="${c.cardStroke}"/>
      <text x="72" y="418" fill="${c.text}" font-size="13" font-weight="800">Romex Prep Golden Rules:</text>
      <text x="72" y="446" fill="${c.muted}" font-size="12">• Pull 6"–8" of slack into every electrical box for easy working room.</text>
      <text x="72" y="470" fill="${c.muted}" font-size="12">• Leave at least 1/4" of outer jacket inside the box clamp.</text>
      <text x="72" y="494" fill="${c.muted}" font-size="12">• Use the exact 14 AWG notch on strippers—never score/nick copper.</text>
      <text x="72" y="518" fill="${c.muted}" font-size="12">• Zero bare wire outside wire nuts; zero insulation trapped under screws.</text>

      <!-- Right Half: Interactive Screw-Torque Physics Lab -->
      <rect x="562" y="48" width="530" height="516" rx="14" fill="${c.cardBg}" stroke="${cw ? c.ok : c.danger}" stroke-width="2.5"/>
      <text x="827" y="80" text-anchor="middle" fill="${c.text}" font-size="15" font-weight="800">2. J-HOOK SCREW TORQUE SIMULATOR</text>

      <!-- Toggle CW vs CCW -->
      <g class="svg-hit" data-action="p5-hook" data-mode="cw">
        <rect x="596" y="98" width="222" height="36" rx="8" fill="${cw ? c.ok : c.stageBg}" stroke="${c.ok}" stroke-width="2"/>
        <text x="707" y="121" text-anchor="middle" fill="${cw ? '#ffffff' : c.text}" font-size="12.5" font-weight="800">✓ Clockwise Hook (Right)</text>
      </g>
      <g class="svg-hit" data-action="p5-hook" data-mode="ccw">
        <rect x="836" y="98" width="222" height="36" rx="8" fill="${!cw ? c.danger : c.stageBg}" stroke="${c.danger}" stroke-width="2"/>
        <text x="947" y="121" text-anchor="middle" fill="${!cw ? '#ffffff' : c.text}" font-size="12.5" font-weight="800">✗ Counter-CW Hook (Wrong)</text>
      </g>

      <!-- Macro Screw Plate -->
      <circle cx="827" cy="264" r="96" fill="${c.stageBg}" stroke="${c.cardStroke}" stroke-width="2"/>

      ${cw ? `
        <!-- Clockwise J-hook: cinches tighter inward when torqued -->
        <path d="M${cinched ? 784 : 776} 366 L${cinched ? 784 : 776} 264 A${cinched ? 44 : 52} ${cinched ? 44 : 52} 0 1 1 ${cinched ? 862 : 870} 296"
          fill="none" stroke="${c.copper}" stroke-width="13" stroke-linecap="round"/>
        <path d="M776 196 A80 80 0 0 1 904 222" fill="none" stroke="${c.ok}" stroke-width="3.5"/>
        <polygon points="904,222 891,209 909,204" fill="${c.ok}"/>
      ` : `
        <!-- Counter-CW J-hook: flares outward when torqued! -->
        <path d="M${cinched ? 892 : 878} 366 L${cinched ? 892 : 878} 264 A${cinched ? 66 : 52} ${cinched ? 66 : 52} 0 1 0 ${cinched ? 752 : 782} 298"
          fill="none" stroke="${c.copper}" stroke-width="13" stroke-linecap="round"/>
        <path d="M878 196 A80 80 0 0 0 750 222" fill="none" stroke="${c.danger}" stroke-width="3.5"/>
        <polygon points="750,222 763,209 745,204" fill="${c.danger}"/>
      `}

      <!-- Rotating Brass Screw Head -->
      <g transform="rotate(${rot} 827 264)" style="transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);">
        <circle cx="827" cy="264" r="34" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="3"/>
        <line x1="804" y1="264" x2="850" y2="264" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
        <line x1="827" y1="241" x2="827" y2="287" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
      </g>

      <!-- Interactive Torque Screw Button -->
      <g class="svg-hit" data-action="p5-torque">
        <rect x="650" y="384" width="354" height="42" rx="9" fill="#2563eb"/>
        <text x="827" y="410" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="800">
          ↻ Torque Screw Clockwise (Tighten ${state.p5TorqueCount > 0 ? `×${state.p5TorqueCount}` : 'Test'})
        </text>
      </g>

      <rect x="596" y="442" width="462" height="96" rx="10" fill="${c.stageBg}" stroke="${cw ? c.ok : c.danger}" stroke-width="1.5"/>
      <text x="827" y="470" text-anchor="middle" fill="${cw ? c.ok : c.danger}" font-size="13" font-weight="800">
        ${cw
          ? (cinched ? 'CINCHED TIGHT! Friction pulled the copper inward around the post.' : 'GOOD: Clockwise J-hook wraps in the screw’s tightening direction.')
          : (cinched ? 'PUSHED OUT! Screw rotation flared the copper leg outward!' : 'BAD: Tightening clockwise pushes a counter-CW loop right off the screw!')}
      </text>
      <text x="827" y="498" text-anchor="middle" fill="${c.muted}" font-size="12">
        Notice how screws ALWAYS turn clockwise to tighten—match your J-hook to that rotation.
      </text>
      <text x="827" y="520" text-anchor="middle" fill="${c.muted}" font-size="11.5">
        Terminal Legend: Brass = Hot (+) · Silver = Neutral (-) · Green = Ground
      </text>
    `;
  }

  // PANEL 10: Craft Lab 2 — Wago 221 / Wire Nuts & Parallel Pigtail Continuity Test
  function renderPanel10(c) {
    const wago = state.p6SpliceMode === 'wago';
    const pigtail = state.p6WiringStyle === 'pigtail';
    const o1Out = state.p6Outlet1Removed;
    const o1Live = !o1Out;
    const o2Live = pigtail || !o1Out;
    const o3Live = pigtail || !o1Out;

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 10 · CRAFT LAB 2 — WAGO 221 SPLICING & WHY PARALLEL PIGTAILING MATTERS')}

      <!-- Left Half: Interactive Wago 221 / Wire Nut Splice -->
      <rect x="28" y="48" width="480" height="516" rx="14" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="2"/>
      <text x="268" y="80" text-anchor="middle" fill="${c.text}" font-size="15" font-weight="800">1. SPLICING 3 WIRES WITH A PIGTAIL</text>

      <g class="svg-hit" data-action="p6-splice" data-mode="wago">
        <rect x="58" y="98" width="200" height="36" rx="8" fill="${wago ? '#ea580c' : c.stageBg}" stroke="#ea580c" stroke-width="2"/>
        <text x="158" y="121" text-anchor="middle" fill="${wago ? '#ffffff' : c.text}" font-size="12.5" font-weight="800">Wago 221 (Click Levers)</text>
      </g>
      <g class="svg-hit" data-action="p6-splice" data-mode="wirenut">
        <rect x="278" y="98" width="200" height="36" rx="8" fill="${!wago ? '#eab308' : c.stageBg}" stroke="#eab308" stroke-width="2"/>
        <text x="378" y="121" text-anchor="middle" fill="${!wago ? '#111827' : c.text}" font-size="12.5" font-weight="800">Wire Nut Twist</text>
      </g>

      <!-- 3 Entering Wires -->
      <path d="M180 358 L180 264" stroke="${c.blackWire}" stroke-width="10" stroke-linecap="round"/>
      <path d="M268 358 L268 264" stroke="${c.blackWire}" stroke-width="10" stroke-linecap="round"/>
      <path d="M356 358 L356 264" stroke="${c.warn}" stroke-width="10" stroke-linecap="round"/>
      <text x="180" y="382" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">Line In</text>
      <text x="268" y="382" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="700">Load Out</text>
      <text x="356" y="382" text-anchor="middle" fill="${c.warn}" font-size="11.5" font-weight="700">Pigtail</text>

      ${wago ? `
        <rect x="142" y="190" width="252" height="84" rx="10" fill="#cbd5e1" fill-opacity="0.3" stroke="#94a3b8" stroke-width="2.5"/>
        <rect x="162" y="226" width="212" height="14" rx="3" fill="${c.copper}" opacity="0.9"/>
        ${[0, 1, 2].map((idx) => {
          const lx = 166 + idx * 88;
          const closed = state.p6Levers[idx];
          return `
            <g class="svg-hit" data-action="p6-lever" data-idx="${idx}">
              <rect x="${lx}" y="${closed ? 174 : 148}" width="32" height="28" rx="4" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
              <text x="${lx + 16}" y="${closed ? 192 : 166}" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="800">${closed ? 'LOCK' : 'OPEN'}</text>
            </g>
          `;
        }).join('')}
        <text x="268" y="260" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="700">
          ${state.p6Levers.every(Boolean) ? '✓ All 3 Levers Clamped' : 'Click orange levers to clamp!'}
        </text>
      ` : `
        <g class="anim-twist">
          <polygon points="216,266 238,162 298,162 320,266" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="2.5"/>
          <line x1="246" y1="170" x2="236" y2="258" stroke="#a16207" stroke-width="2.5"/>
          <line x1="268" y1="170" x2="268" y2="258" stroke="#a16207" stroke-width="2.5"/>
          <line x1="290" y1="170" x2="300" y2="258" stroke="#a16207" stroke-width="2.5"/>
        </g>
        <text x="268" y="290" text-anchor="middle" fill="${c.warn}" font-size="11.5" font-weight="800">Pre-align tips &amp; twist tight + tug test</text>
      `}

      <rect x="58" y="410" width="420" height="126" rx="10" fill="${c.stageBg}" stroke="${c.cardStroke}"/>
      <text x="76" y="438" fill="${c.text}" font-size="12.5" font-weight="800">Why Pigtail Instead of Chaining Device Screws?</text>
      <text x="76" y="464" fill="${c.muted}" font-size="11.5">• Each outlet connects off a short 6" pigtail spur.</text>
      <text x="76" y="486" fill="${c.muted}" font-size="11.5">• Main current flows straight through the Wago/wire nut.</text>
      <text x="76" y="508" fill="${c.muted}" font-size="11.5">• Removing Outlet #1 won't black out Outlets #2 &amp; #3!</text>

      <!-- Right Half: Interactive Parallel Continuity Test -->
      <rect x="530" y="48" width="562" height="516" rx="14" fill="${c.cardBg}" stroke="${c.primary || '#3b82f6'}" stroke-width="2"/>
      <text x="811" y="80" text-anchor="middle" fill="${c.text}" font-size="15" font-weight="800">2. LIVE CONTINUITY EXPERIMENT</text>

      <!-- Wiring Style Toggle -->
      <g class="svg-hit" data-action="p6-style" data-style="pigtail">
        <rect x="560" y="98" width="240" height="36" rx="8" fill="${pigtail ? c.ok : c.stageBg}" stroke="${c.ok}" stroke-width="2"/>
        <text x="680" y="121" text-anchor="middle" fill="${pigtail ? '#ffffff' : c.text}" font-size="12" font-weight="800">✓ Pigtail Parallel (NEC Best)</text>
      </g>
      <g class="svg-hit" data-action="p6-style" data-style="series">
        <rect x="816" y="98" width="246" height="36" rx="8" fill="${!pigtail ? c.warn : c.stageBg}" stroke="${c.warn}" stroke-width="2"/>
        <text x="939" y="121" text-anchor="middle" fill="${!pigtail ? '#111827' : c.text}" font-size="12" font-weight="800">Device-Screw Feed-Through</text>
      </g>

      <!-- 3 Outlet Status Cards -->
      <path d="M578 214 L1042 214" stroke="${pigtail || !o1Out ? c.hotGlow : '#64748b'}" stroke-width="6"/>
      ${pigtail || !o1Out ? `<path d="M578 214 L1042 214" stroke="#fde047" stroke-width="2.5" class="anim-flow"/>` : ''}

      <!-- Outlet 1 (Removable!) -->
      <g class="svg-hit" data-action="p6-remove-o1">
        <rect x="568" y="238" width="144" height="148" rx="10" fill="${c.stageBg}" stroke="${o1Out ? c.danger : c.ok}" stroke-width="2.5" stroke-dasharray="${o1Out ? '6 4' : 'none'}"/>
        <text x="640" y="266" text-anchor="middle" fill="${c.text}" font-size="13" font-weight="800">OUTLET #1</text>
        <text x="640" y="302" text-anchor="middle" fill="${o1Out ? c.danger : c.ok}" font-size="18" font-weight="800">${o1Out ? 'REMOVED' : '12.04 V'}</text>
        <text x="640" y="362" text-anchor="middle" fill="${c.warn}" font-size="11" font-weight="700">${o1Out ? 'Click to Reinstall' : 'Click to Remove'}</text>
      </g>

      <!-- Outlet 2 -->
      <rect x="740" y="238" width="144" height="148" rx="10" fill="${c.stageBg}" stroke="${o2Live ? c.ok : c.danger}" stroke-width="2.5"/>
      <text x="812" y="266" text-anchor="middle" fill="${c.text}" font-size="13" font-weight="800">OUTLET #2</text>
      <text x="812" y="306" text-anchor="middle" fill="${o2Live ? c.ok : c.danger}" font-size="18" font-weight="800">${o2Live ? '12.04 V' : '0.00 V'}</text>
      <text x="812" y="344" text-anchor="middle" fill="${c.muted}" font-size="11">${o2Live ? 'Downstream LIVE!' : 'LOST POWER!'}</text>

      <!-- Outlet 3 -->
      <rect x="912" y="238" width="144" height="148" rx="10" fill="${c.stageBg}" stroke="${o3Live ? c.ok : c.danger}" stroke-width="2.5"/>
      <text x="984" y="266" text-anchor="middle" fill="${c.text}" font-size="13" font-weight="800">OUTLET #3</text>
      <text x="984" y="306" text-anchor="middle" fill="${o3Live ? c.ok : c.danger}" font-size="18" font-weight="800">${o3Live ? '12.04 V' : '0.00 V'}</text>
      <text x="984" y="344" text-anchor="middle" fill="${c.muted}" font-size="11">${o3Live ? 'Downstream LIVE!' : 'LOST POWER!'}</text>

      <!-- Interactive Toggle Button -->
      <g class="svg-hit" data-action="p6-remove-o1">
        <rect x="610" y="410" width="402" height="44" rx="9" fill="${o1Out ? c.ok : '#ef4444'}"/>
        <text x="811" y="437" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="800">
          ${o1Out ? 'Reinstall Outlet #1' : 'Simulate Removing / Unscrewing Outlet #1'}
        </text>
      </g>

      <rect x="560" y="470" width="502" height="66" rx="10" fill="${c.stageBg}" stroke="${c.cardStroke}"/>
      <text x="811" y="498" text-anchor="middle" fill="${o2Live ? c.ok : c.danger}" font-size="12.5" font-weight="800">
        ${o1Out
          ? (pigtail ? 'PASS: Pigtail splice keeps downstream Outlets #2 & #3 powered!' : 'FAIL: Without pigtails, removing Outlet #1 breaks the downstream feed!')
          : 'Click "Simulate Removing Outlet #1" above to compare both wiring styles.'}
      </text>
      <text x="811" y="520" text-anchor="middle" fill="${c.muted}" font-size="11.5">
        Note: In real homes, pigtails also prevent loose screw connections from overheating downstream loads.
      </text>
    `;
  }

  // PANEL 11: Step 3 — Circuit 1 (Parallel Outlets & Half-Hot Switch)
  function renderPanel11(c) {
    const swOn = state.p7SwitchOn;
    const broken = state.p7TabBroken;
    const topLive = !broken ? true : swOn;

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 11 · STEP 3 — CIRCUIT 1: PARALLEL OUTLETS & HALF-HOT SWITCH (CLICK SWITCH OR TAB)')}

      <g transform="translate(8, 14) scale(0.75)">
        ${svgPlywoodBoard(c)}
        ${svgMainPanelShell(c, { psuOn: true, fuse1: true, fuse2: true })}

        <g opacity="0.28">
          ${svgCeilingLamp(c, 504, 118, false, 'Circuit 2 (Next)')}
          ${svgSwitchBox(c, 536, 210, '3-Way A', '', false, '', '#64748b')}
          ${svgSwitchBox(c, 772, 210, '3-Way B', '', false, '', '#64748b')}
        </g>

        ${svgSwitchBox(c, 394, 210, '1-Pole Switch', 'Controls Top #3', swOn, 'data-action="p7-toggle-sw"', c.hotGlow)}
        ${svgDuplexOutlet(c, 462, 378, 'Outlet #1 (Parallel)', { topHot: true, botHot: true, idPrefix: 'o1' })}
        ${svgDuplexOutlet(c, 706, 378, 'Outlet #2 (Parallel)', { topHot: true, botHot: true, idPrefix: 'o2' })}
        ${svgDuplexOutlet(c, 856, 378, 'Outlet #3 (Half-Hot)', { topHot: topLive, botHot: true, splitTabBroken: broken, idPrefix: 'o3' })}

        <path d="M164 236 L164 468 L462 468 M546 468 L706 468 M790 468 L856 468"
          fill="none" stroke="${c.whiteWire}" stroke-width="8" stroke-linecap="round" pathLength="100" class="anim-draw d-1"/>
        <path d="M164 236 L164 468 L462 468 M546 468 L706 468 M790 468 L856 468"
          fill="none" stroke="${c.hotGlow}" stroke-width="2.8" stroke-linecap="round" class="anim-flow"/>

        ${[[164, 390], [280, 468], [390, 468], [625, 468], [822, 468]].map(([sx, sy], i) => `
          <rect x="${sx - 6}" y="${sy - 6}" width="12" height="12" rx="2" fill="#f8fafc" stroke="#2563eb" stroke-width="2" class="anim-pop d-${(i % 4) + 2}"/>
        `).join('')}

        <path d="M898 378 L898 340 L432 340 L432 324"
          fill="none" stroke="${c.whiteWire}" stroke-width="8" stroke-linecap="round" pathLength="100" class="anim-draw d-3"/>
        <rect x="888" y="346" width="20" height="8" rx="1" fill="#0f172a"/>
        <rect x="422" y="328" width="20" height="8" rx="1" fill="#0f172a"/>

        <path d="M890 378 L890 344 L440 344 L440 324" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>
        ${swOn ? `<path d="M424 324 L424 336 L906 336 L906 394" fill="none" stroke="#ef4444" stroke-width="2.5" class="anim-flow"/>` : ''}
      </g>

      <!-- Right Macro Inset -->
      <g class="anim-fade d-2">
        <rect x="742" y="42" width="352" height="522" rx="14" fill="${c.cardBg}" stroke="${c.warn}" stroke-width="2.2"/>
        <text x="918" y="70" text-anchor="middle" fill="${c.warn}" font-size="13.5" font-weight="800">MACRO: OUTLET #3 HALF-HOT</text>

        <rect x="860" y="96" width="116" height="198" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="2.5"/>
        <rect x="882" y="114" width="72" height="66" rx="10" fill="${topLive ? '#fef3c7' : '#e2e8f0'}" stroke="${topLive ? '#f59e0b' : '#64748b'}" stroke-width="2.5"/>
        <text x="918" y="150" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="800">${topLive ? 'TOP: 12V' : 'TOP: 0V'}</text>
        <text x="918" y="166" text-anchor="middle" fill="${topLive ? '#b45309' : '#475569'}" font-size="10" font-weight="700">${broken ? 'SWITCHED' : 'BACKFED!'}</text>

        <rect x="882" y="206" width="72" height="66" rx="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
        <text x="918" y="242" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="800">BOT: 12V</text>
        <text x="918" y="258" text-anchor="middle" fill="#b45309" font-size="10" font-weight="700">ALWAYS HOT</text>

        <!-- Silver Side (LEFT) -->
        <rect x="848" y="138" width="12" height="110" rx="2" fill="${c.silver}" stroke="#475569" stroke-width="1.5"/>
        <circle cx="854" cy="146" r="8" fill="${c.silver}" stroke="#475569" stroke-width="2"/>
        <circle cx="854" cy="240" r="8" fill="${c.silver}" stroke="#475569" stroke-width="2"/>
        <text x="808" y="196" text-anchor="middle" fill="${c.ok}" font-size="10.5" font-weight="800">KEEP</text>
        <text x="808" y="210" text-anchor="middle" fill="${c.ok}" font-size="10">Silver Tab</text>

        <!-- Brass Side (RIGHT) -->
        <circle cx="982" cy="146" r="9" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="2"/>
        <circle cx="982" cy="240" r="9" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="2"/>
        <g class="svg-hit" data-action="p7-toggle-tab">
          ${broken
            ? `<path d="M976 186 L988 200 M988 186 L976 200" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>`
            : `<rect x="976" y="154" width="12" height="78" rx="2" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="1.8"/>`}
          <text x="1038" y="188" text-anchor="middle" fill="${broken ? c.ok : c.danger}" font-size="10.5" font-weight="800">${broken ? 'BROKEN ✓' : 'INTACT ✗'}</text>
          <text x="1038" y="202" text-anchor="middle" fill="${c.muted}" font-size="9.5">(Click Tab)</text>
        </g>

        <path d="M776 240 L846 240" stroke="${c.whiteWire}" stroke-width="5"/>
        <path d="M991 240 L1056 240" stroke="${c.blackWire}" stroke-width="5"/>
        <path d="M991 146 L1056 146" stroke="${topLive ? '#ef4444' : '#64748b'}" stroke-width="5"/>

        <g class="svg-hit" data-action="p7-toggle-tab">
          <rect x="766" y="310" width="304" height="36" rx="8" fill="${broken ? c.stageBg : '#ef4444'}" stroke="${broken ? c.warn : '#ef4444'}" stroke-width="1.8"/>
          <text x="918" y="333" text-anchor="middle" fill="${broken ? c.warn : '#ffffff'}" font-size="12" font-weight="800">
            ${broken ? 'Brass Tab Broken (Click to Restore)' : 'Tab Intact! Click to Snap Off Brass Tab'}
          </text>
        </g>

        <g class="svg-hit" data-action="p7-toggle-sw">
          <rect x="766" y="356" width="304" height="40" rx="8" fill="${swOn ? c.ok : c.cardStroke}"/>
          <text x="918" y="381" text-anchor="middle" fill="${swOn ? '#ffffff' : c.text}" font-size="12.5" font-weight="800">
            1-Pole Switch: ${swOn ? 'ON (Click to Flip OFF)' : 'OFF (Click to Flip ON)'}
          </text>
        </g>

        <rect x="766" y="408" width="304" height="140" rx="10" fill="${c.stageBg}" stroke="${c.cardStroke}"/>
        <text x="782" y="432" fill="${c.text}" font-size="12" font-weight="800">Switch Loop Convention:</text>
        <text x="782" y="454" fill="${c.muted}" font-size="11">1. Splice incoming Hot to <tspan font-weight="700" fill="${c.text}">White</tspan> (taped</text>
        <text x="782" y="470" fill="${c.muted}" font-size="11">   black!) feeding up to the switch.</text>
        <text x="782" y="492" fill="${c.muted}" font-size="11">2. <tspan font-weight="700" fill="${c.text}">Black</tspan> returns switched +12V back</text>
        <text x="782" y="508" fill="${c.muted}" font-size="11">   to Outlet #3 TOP brass screw.</text>
        <text x="782" y="534" fill="${topLive && !swOn ? c.danger : c.ok}" font-size="11" font-weight="700">
          ${topLive && !swOn ? '⚠ Unbroken tab backfeeds Top socket!' : 'Bottom stays hot · Top follows switch!'}
        </text>
      </g>
    `;
  }

  // PANEL 12: Step 4 — Circuit 2 (3-Way Lighting & Travelers)
  function renderPanel12(c) {
    const swA = state.p8SwA;
    const swB = state.p8SwB;
    const lightOn = swA === swB;
    const blackLive = swA === 'black';
    const redLive = swA === 'red';

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 12 · STEP 4 — CIRCUIT 2: 3-WAY LIGHTING & 14/3 TRAVELERS (CLICK SWITCH A OR B)')}

      <g transform="translate(8, 14) scale(0.75)">
        ${svgPlywoodBoard(c)}
        ${svgMainPanelShell(c, { psuOn: true, fuse1: true, fuse2: true })}

        <g opacity="0.28">
          ${svgSwitchBox(c, 394, 210, '1-Pole', '', false, '', '#64748b')}
          ${svgDuplexOutlet(c, 462, 378, 'Outlet #1', { idPrefix: 'o1' })}
          ${svgDuplexOutlet(c, 706, 378, 'Outlet #2', { idPrefix: 'o2' })}
          ${svgDuplexOutlet(c, 856, 378, 'Outlet #3', { idPrefix: 'o3' })}
        </g>

        ${svgCeilingLamp(c, 504, 118, lightOn, 'Ceiling Lamp (12V E26)')}
        ${svgSwitchBox(c, 536, 210, '3-Way Sw A', 'Center Stud', swA === 'black', 'data-action="p8-flip-a"', '#2563eb')}
        ${svgSwitchBox(c, 772, 210, '3-Way Sw B', 'Right Stud', swB === 'black', 'data-action="p8-flip-b"', '#2563eb')}

        <path d="M164 260 L164 196 L560 196 L560 210" fill="none" stroke="${c.whiteWire}" stroke-width="8" stroke-linecap="round" pathLength="100" class="anim-draw d-1"/>
        <path d="M164 260 L164 196 L560 196 L560 210" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>

        <path d="M612 254 L772 254" fill="none" stroke="${blackLive ? c.blackWireHighlight : '#64748b'}" stroke-width="6" pathLength="100" class="anim-draw d-2"/>
        ${blackLive ? `<path d="M612 254 L772 254" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>` : ''}

        <path d="M612 280 L772 280" fill="none" stroke="${redLive ? c.redWire : '#991b1b'}" stroke-width="6" pathLength="100" class="anim-draw d-2"/>
        ${redLive ? `<path d="M612 280 L772 280" fill="none" stroke="#fde047" stroke-width="2.5" class="anim-flow"/>` : ''}

        <path d="M590 210 L590 162 L795 162 L795 210" fill="none" stroke="${c.whiteWire}" stroke-width="5" stroke-dasharray="6 3"/>

        <path d="M810 210 L810 118 L538 118" fill="none" stroke="${lightOn ? c.blackWireHighlight : '#64748b'}" stroke-width="8" stroke-linecap="round" pathLength="100" class="anim-draw d-3"/>
        ${lightOn ? `<path d="M810 210 L810 118 L538 118" fill="none" stroke="#fde047" stroke-width="3" class="anim-flow"/>` : ''}

        <rect x="646" y="228" width="94" height="20" rx="4" fill="#ea580c" class="anim-pop d-3"/>
        <text x="693" y="242" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="800">14/3 ROMEX</text>
      </g>

      <!-- Right Side: X-Ray SPDT Diagram + Truth Table -->
      <g class="anim-fade d-2">
        <rect x="742" y="42" width="352" height="522" rx="14" fill="${c.cardBg}" stroke="#3b82f6" stroke-width="2.2"/>
        <text x="918" y="70" text-anchor="middle" fill="#60a5fa" font-size="13.5" font-weight="800">X-RAY: SPDT 3-WAY LOGIC</text>

        <rect x="762" y="84" width="312" height="218" rx="10" fill="${c.stageBg}" stroke="${c.cardStroke}"/>

        <g class="svg-hit" data-action="p8-flip-a">
          <rect x="778" y="102" width="84" height="128" rx="8" fill="${c.cardBg}" stroke="#3b82f6" stroke-width="2"/>
          <text x="820" y="120" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="800">SWITCH A</text>
          <circle cx="792" cy="166" r="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="784" y="184" fill="${c.warn}" font-size="9" font-weight="700">COM</text>
          <circle cx="848" cy="144" r="6" fill="${c.brass}" stroke="#854d0e" stroke-width="1.5"/>
          <circle cx="848" cy="190" r="6" fill="${c.brass}" stroke="#854d0e" stroke-width="1.5"/>
          <line x1="792" y1="166" x2="848" y2="${swA === 'black' ? 144 : 190}" stroke="${c.hotGlow}" stroke-width="4" stroke-linecap="round"/>
          <text x="820" y="220" text-anchor="middle" fill="#60a5fa" font-size="10" font-weight="700">Click to Flip</text>
        </g>

        <line x1="854" y1="144" x2="974" y2="144" stroke="${blackLive ? c.blackWireHighlight : '#64748b'}" stroke-width="6"/>
        ${blackLive ? `<line x1="854" y1="144" x2="974" y2="144" stroke="${c.hotGlow}" stroke-width="2.5" class="anim-flow"/>` : ''}
        <text x="914" y="136" text-anchor="middle" fill="${blackLive ? c.warn : c.muted}" font-size="10" font-weight="700">Black Traveler</text>

        <line x1="854" y1="190" x2="974" y2="190" stroke="${redLive ? c.redWire : '#991b1b'}" stroke-width="6"/>
        ${redLive ? `<line x1="854" y1="190" x2="974" y2="190" stroke="#fde047" stroke-width="2.5" class="anim-flow"/>` : ''}
        <text x="914" y="206" text-anchor="middle" fill="${redLive ? c.redWire : c.muted}" font-size="10" font-weight="700">Red Traveler</text>

        <g class="svg-hit" data-action="p8-flip-b">
          <rect x="966" y="102" width="84" height="128" rx="8" fill="${c.cardBg}" stroke="#3b82f6" stroke-width="2"/>
          <text x="1008" y="120" text-anchor="middle" fill="${c.text}" font-size="11" font-weight="800">SWITCH B</text>
          <circle cx="980" cy="144" r="6" fill="${c.brass}" stroke="#854d0e" stroke-width="1.5"/>
          <circle cx="980" cy="190" r="6" fill="${c.brass}" stroke="#854d0e" stroke-width="1.5"/>
          <circle cx="1036" cy="166" r="6" fill="#0f172a" stroke="${lightOn ? c.ok : '#64748b'}" stroke-width="2"/>
          <text x="1024" y="184" fill="${lightOn ? c.ok : c.muted}" font-size="9" font-weight="700">COM</text>
          <line x1="1036" y1="166" x2="980" y2="${swB === 'black' ? 144 : 190}" stroke="${lightOn ? c.ok : '#94a3b8'}" stroke-width="4" stroke-linecap="round"/>
          <text x="1008" y="220" text-anchor="middle" fill="#60a5fa" font-size="10" font-weight="700">Click to Flip</text>
        </g>

        <rect x="778" y="246" width="280" height="42" rx="8" fill="${lightOn ? c.ok : c.cardBg}" fill-opacity="${lightOn ? 0.18 : 1}" stroke="${lightOn ? c.ok : c.cardStroke}" stroke-width="1.8"/>
        <text x="918" y="272" text-anchor="middle" fill="${lightOn ? c.ok : c.muted}" font-size="13" font-weight="800">
          CEILING LIGHT: ${lightOn ? 'ON (TRAVELERS MATCHED)' : 'OFF (OPEN CIRCUIT)'}
        </text>

        <text x="766" y="330" fill="${c.text}" font-size="12" font-weight="800">4-STATE 3-WAY TRUTH TABLE</text>
        ${[
          ['black', 'black', true, 'Black + Black'],
          ['black', 'red', false, 'Black + Red'],
          ['red', 'black', false, 'Red + Black'],
          ['red', 'red', true, 'Red + Red']
        ].map(([a, b, on, label], idx) => {
          const active = swA === a && swB === b;
          const ry = 342 + idx * 38;
          return `
            <rect x="762" y="${ry}" width="312" height="32" rx="6" fill="${active ? '#3b82f6' : c.stageBg}" fill-opacity="${active ? 0.22 : 1}" stroke="${active ? '#3b82f6' : c.cardStroke}" stroke-width="${active ? 2 : 1}"/>
            <text x="778" y="${ry + 20}" fill="${c.text}" font-size="11.5" font-weight="${active ? 800 : 600}">${label}</text>
            <text x="1058" y="${ry + 20}" text-anchor="end" fill="${on ? c.ok : c.muted}" font-size="11.5" font-weight="800">${on ? '● LIGHT ON' : '○ LIGHT OFF'}</text>
          `;
        }).join('')}

        <g class="svg-hit" data-action="p8-cycle">
          <rect x="762" y="506" width="312" height="38" rx="8" fill="${state.p8Cycling ? c.warn : '#2563eb'}"/>
          <text x="918" y="530" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">
            ${state.p8Cycling ? '■ Stop Auto-Cycling States' : '▶ Auto-Cycle All 4 Switch States'}
          </text>
        </g>
      </g>
    `;
  }

  // PANEL 13: Hands-On Wire-It-Yourself Interactive Challenge Lab
  function renderPanel13(c) {
    const ch = WIRING_CHALLENGES[state.p9Idx];
    const conn = state.p9Connected[state.p9Idx] || {};
    const allWired = ch.terminals.every((t) => Boolean(conn[t.id])) && (!ch.requiresTabBreak || state.p9TabBroken);

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 13 · HANDS-ON LAB — SELECT A WIRE ON THE LEFT, THEN CLICK ITS TERMINAL SCREW')}

      <!-- Wire Palette Column on Stage -->
      <rect x="28" y="48" width="262" height="516" rx="14" fill="${c.cardBg}" stroke="${c.cardStroke}" stroke-width="2"/>
      <text x="159" y="80" text-anchor="middle" fill="${c.text}" font-size="13.5" font-weight="800">1. PICK A WIRE LEAD</text>

      ${ch.wires.map((w, idx) => {
        const active = state.p9ActiveWire === w.id;
        const used = Object.values(conn).includes(w.id);
        const wy = 104 + idx * 78;
        return `
          <g class="svg-hit" data-action="p9-pick-wire" data-wire="${w.id}">
            <rect x="48" y="${wy}" width="222" height="62" rx="10" fill="${c.stageBg}" stroke="${active ? c.warn : (used ? c.ok : c.cardStroke)}" stroke-width="${active ? 3 : 1.8}"/>
            <rect x="64" y="${wy + 20}" width="36" height="14" rx="4" fill="${w.color}" stroke="${w.stroke}" stroke-width="2"/>
            <text x="112" y="${wy + 28}" fill="${c.text}" font-size="12" font-weight="800">${w.label}</text>
            <text x="112" y="${wy + 46}" fill="${used ? c.ok : (active ? c.warn : c.muted)}" font-size="10.5" font-weight="700">
              ${used ? '✓ Terminated' : (active ? '▶ Selected (Click Screw)' : 'Click to Select')}
            </text>
          </g>
        `;
      }).join('')}

      <rect x="48" y="364" width="222" height="176" rx="10" fill="${c.stageBg}" stroke="${allWired ? c.ok : c.cardStroke}" stroke-width="1.8"/>
      <text x="159" y="392" text-anchor="middle" fill="${allWired ? c.ok : c.text}" font-size="13" font-weight="800">
        ${allWired ? '★ CHALLENGE PASSED!' : '2. CLICK TERMINAL SCREW'}
      </text>
      <text x="159" y="422" text-anchor="middle" fill="${c.muted}" font-size="11.5">Brass = +12V Hot</text>
      <text x="159" y="444" text-anchor="middle" fill="${c.muted}" font-size="11.5">Silver = -12V Neutral</text>
      <text x="159" y="466" text-anchor="middle" fill="${c.muted}" font-size="11.5">Green = Bare Ground</text>
      <text x="159" y="488" text-anchor="middle" fill="${c.muted}" font-size="11.5">Dark = 3-Way Common</text>
      ${ch.requiresTabBreak ? `<text x="159" y="514" text-anchor="middle" fill="${state.p9TabBroken ? c.ok : c.warn}" font-size="11" font-weight="800">${state.p9TabBroken ? '✓ Brass Tab Broken' : '⚠ Also click Brass Tab!'}</text>` : ''}

      <!-- Device Workbench Center/Right -->
      <rect x="312" y="48" width="780" height="516" rx="14" fill="${c.cardBg}" stroke="${allWired ? c.ok : c.cardStroke}" stroke-width="2.5"/>
      <text x="702" y="82" text-anchor="middle" fill="${c.text}" font-size="15.5" font-weight="800">${ch.title.toUpperCase()}</text>
      <text x="702" y="106" text-anchor="middle" fill="${c.muted}" font-size="12">${ch.subtitle}</text>

      <!-- Device Body -->
      <rect x="396" y="142" width="128" height="270" rx="14" fill="#f8fafc" stroke="#64748b" stroke-width="3"/>
      ${state.p9Idx === 2 ? `
        <rect x="434" y="218" width="52" height="110" rx="8" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
        <text x="460" y="278" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="800">3-WAY</text>
      ` : `
        <rect x="422" y="166" width="76" height="92" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
        <rect x="422" y="286" width="76" height="92" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
        <text x="460" y="216" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="800">TOP</text>
        <text x="460" y="336" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="800">BOT</text>
      `}

      <!-- Breakable Brass Tab for Challenge 2 -->
      ${ch.requiresTabBreak ? `
        <g class="svg-hit" data-action="p9-break-tab">
          ${state.p9TabBroken
            ? `<path d="M530 248 L546 268 M546 248 L530 268" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>`
            : `<rect x="530" y="218" width="16" height="78" rx="3" fill="url(#brass-grad)" stroke="#854d0e" stroke-width="2"/>`}
          <rect x="562" y="242" width="166" height="32" rx="7" fill="${state.p9TabBroken ? c.ok : '#ef4444'}" fill-opacity="0.18" stroke="${state.p9TabBroken ? c.ok : '#ef4444'}" stroke-width="1.8"/>
          <text x="645" y="262" text-anchor="middle" fill="${state.p9TabBroken ? c.ok : '#ef4444'}" font-size="11.5" font-weight="800">
            ${state.p9TabBroken ? '✓ Brass Tab Broken' : 'Click Here to Break Tab!'}
          </text>
        </g>
      ` : ''}

      <!-- Clickable Terminal Screws -->
      ${ch.terminals.map((t) => {
        const wiredId = conn[t.id];
        const wiredObj = ch.wires.find((w) => w.id === wiredId);
        const isLeft = t.x < 450;
        const fillCol = t.id === 'green' ? c.greenGround : (t.id === 'silver' ? c.silver : (t.id === 'common' ? '#0f172a' : 'url(#brass-grad)'));

        return `
          <g class="svg-hit" data-action="p9-click-term" data-term="${t.id}">
            ${wiredObj ? `
              <path d="M${isLeft ? t.x - 110 : t.x + 110} ${t.y} L${t.x} ${t.y}" stroke="${wiredObj.color}" stroke-width="10" stroke-linecap="round"/>
              <path d="M${isLeft ? t.x - 110 : t.x + 110} ${t.y} L${t.x} ${t.y}" stroke="${wiredObj.stroke}" stroke-width="3" stroke-linecap="round"/>
            ` : ''}
            <circle cx="${t.x}" cy="${t.y}" r="18" fill="${fillCol}" stroke="${wiredObj ? c.ok : '#f59e0b'}" stroke-width="${wiredObj ? 3.5 : 2.5}"/>
            <line x1="${t.x - 8}" y1="${t.y}" x2="${t.x + 8}" y2="${t.y}" stroke="#ffffff" stroke-width="2.5" opacity="0.65"/>
            <text x="${isLeft ? t.x - 28 : t.x + 28}" y="${t.y - 22}" text-anchor="${isLeft ? 'end' : 'start'}" fill="${c.text}" font-size="12" font-weight="800">${t.label}</text>
            <text x="${isLeft ? t.x - 28 : t.x + 28}" y="${t.y - 6}" text-anchor="${isLeft ? 'end' : 'start'}" fill="${wiredObj ? c.ok : c.muted}" font-size="11" font-weight="700">
              ${wiredObj ? `✓ ${wiredObj.label}` : 'Click to Land Wire'}
            </text>
          </g>
        `;
      }).join('')}

      <!-- Feedback Banner -->
      <rect x="342" y="458" width="720" height="78" rx="10" fill="${c.stageBg}" stroke="${state.p9Feedback.tone === 'error' ? c.danger : (allWired ? c.ok : c.cardStroke)}" stroke-width="2"/>
      <text x="702" y="492" text-anchor="middle" fill="${state.p9Feedback.tone === 'error' ? c.danger : (allWired ? c.ok : c.text)}" font-size="13.5" font-weight="800">
        ${state.p9Feedback.text}
      </text>
      <text x="702" y="518" text-anchor="middle" fill="${c.muted}" font-size="11.5">
        Use the Challenge 1–3 buttons in the right drawer to switch exercises or reset.
      </text>
    `;
  }

  // PANEL 14: Step 5 — Live 12V Test Bench, Audible DMM & 5-Mode Fault Lab
  function renderPanel14(c) {
    const s = state.sim;
    const ev = evaluateSim();
    const flowCls = s.flowMode === 'conv' ? 'anim-flow' : (s.flowMode === 'elec' ? 'anim-flow-rev' : '');
    const flowOn = s.flowMode !== 'off';

    const socketCenters = {
      'o1-top': [504, 414],
      'o1-bot': [504, 462],
      'o2-top': [748, 414],
      'o2-bot': [748, 462],
      'o3-top': [898, 414],
      'o3-bot': [898, 462]
    };
    const [lx, ly] = socketCenters[s.lampSocket] || [898, 414];
    const blackTravLive = ev.feedC2 && ev.activeTraveler === 'black';
    const redTravLive = ev.feedC2 && ev.activeTraveler === 'red';

    return `
      ${svgDefs(c)}
      ${svgBackground(c, 'PANEL 14 · STEP 5 — LIVE TEST BENCH (CLICK FUSES, SWITCHES, OR ANY SOCKET TO PLUG IN TEST LAMP)')}

      ${svgPlywoodBoard(c)}
      ${svgMainPanelShell(c, { psuOn: s.psuOn, fuse1: s.fuse1Intact, fuse2: s.fuse2Intact, interactive: true })}

      <!-- Circuit 1 Wires -->
      <path d="M164 228 L164 470 L462 470 M546 470 L706 470 M790 470 L856 470"
        fill="none" stroke="${c.whiteWire}" stroke-width="8" stroke-linecap="round"/>
      ${ev.feedC1 && flowOn ? `
        <path d="M164 228 L164 470 L462 470" fill="none" stroke="${c.hotGlow}" stroke-width="3" class="${flowCls}"/>
        ${s.neutralSpliceIntact ? `<path d="M546 470 L706 470 M790 470 L856 470" fill="none" stroke="${c.hotGlow}" stroke-width="3" class="${flowCls}"/>` : ''}
      ` : ''}

      <!-- Fault 4: Open Neutral Splice Indicator between O1 and O2 -->
      ${!s.neutralSpliceIntact ? `
        <g class="svg-hit" data-action="sim-fix-neutral">
          <circle cx="626" cy="470" r="16" fill="#ef4444" fill-opacity="0.25" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2"/>
          <rect x="556" y="492" width="144" height="26" rx="5" fill="#ef4444"/>
          <text x="628" y="509" text-anchor="middle" fill="#ffffff" font-size="10.5" font-weight="800">OPEN NEUTRAL (Click Fix)</text>
        </g>
      ` : ''}

      <!-- Switch Loop 14/2 -->
      <path d="M898 378 L898 342 L432 342 L432 324" fill="none" stroke="${c.whiteWire}" stroke-width="7.5" stroke-linecap="round"/>
      <rect x="889" y="348" width="18" height="7" fill="#0f172a"/>
      <rect x="423" y="328" width="18" height="7" fill="#0f172a"/>
      ${ev.feedC1 && s.neutralSpliceIntact && flowOn ? `<path d="M894 378 L894 345 L436 345 L436 324" fill="none" stroke="${c.hotGlow}" stroke-width="2.2" class="${flowCls}"/>` : ''}
      ${ev.sockets['o3-top'] && flowOn && s.outlet3TabBroken ? `<path d="M428 324 L428 339 L902 339 L902 378" fill="none" stroke="#ef4444" stroke-width="2.5" class="${flowCls}"/>` : ''}

      <!-- Circuit 2 Wires -->
      <path d="M164 256 L164 196 L574 196 L574 210" fill="none" stroke="${c.whiteWire}" stroke-width="8" stroke-linecap="round"/>
      ${ev.feedC2 && flowOn ? `<path d="M164 256 L164 196 L574 196 L574 210" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="${flowCls}"/>` : ''}

      <path d="M612 248 L772 248" fill="none" stroke="${blackTravLive ? c.blackWireHighlight : '#64748b'}" stroke-width="6"/>
      ${blackTravLive && flowOn ? `<path d="M612 248 L772 248" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" class="${flowCls}"/>` : ''}

      ${s.redTravelerConnected ? `
        <path d="M612 276 L772 276" fill="none" stroke="${redTravLive ? c.redWire : '#991b1b'}" stroke-width="6"/>
        ${redTravLive && flowOn ? `<path d="M612 276 L772 276" fill="none" stroke="#fde047" stroke-width="2.5" class="${flowCls}"/>` : ''}
      ` : `
        <path d="M612 276 L732 276" fill="none" stroke="${redTravLive ? c.redWire : '#991b1b'}" stroke-width="6"/>
        <g class="svg-hit" data-action="sim-fix-traveler">
          <circle cx="752" cy="276" r="14" fill="#ef4444" fill-opacity="0.25" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2"/>
          <text x="694" y="302" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="800">LOOSE RED WIRE (Click Fix)</text>
        </g>
      `}

      <path d="M810 210 L810 118 L538 118" fill="none" stroke="${c.whiteWire}" stroke-width="8" stroke-linecap="round"/>
      ${ev.ceilingLightOn && flowOn ? `<path d="M810 210 L810 118 L538 118" fill="none" stroke="#fde047" stroke-width="3" class="${flowCls}"/>` : ''}

      ${svgCeilingLamp(c, 504, 118, ev.ceilingLightOn, 'Ceiling Light (Click Sw A/B)')}
      ${svgSwitchBox(c, 394, 210, '1-Pole Sw', 'Half-Hot #3', s.spSwitchOn, 'data-action="sim-toggle-sp"', c.hotGlow)}
      ${svgSwitchBox(c, 536, 210, '3-Way A', s.sw3WayA === 'black' ? 'Trav: Blk' : 'Trav: Red', s.sw3WayA === 'black', 'data-action="sim-toggle-3wa"', '#2563eb')}
      ${svgSwitchBox(c, 772, 210, '3-Way B', s.sw3WayB === 'black' ? 'Trav: Blk' : 'Trav: Red', s.sw3WayB === 'black', 'data-action="sim-toggle-3wb"', '#2563eb')}

      ${svgDuplexOutlet(c, 462, 378, 'Outlet #1 (Par)', { topHot: ev.sockets['o1-top'], botHot: ev.sockets['o1-bot'], interactive: true, lampSocket: s.lampSocket, idPrefix: 'o1' })}
      ${svgDuplexOutlet(c, 706, 378, 'Outlet #2 (Par)', { topHot: ev.sockets['o2-top'], botHot: ev.sockets['o2-bot'], interactive: true, lampSocket: s.lampSocket, idPrefix: 'o2' })}
      ${svgDuplexOutlet(c, 856, 378, 'Outlet #3 (Split)', { topHot: ev.sockets['o3-top'], botHot: ev.sockets['o3-bot'], splitTabBroken: s.outlet3TabBroken, interactive: true, lampSocket: s.lampSocket, idPrefix: 'o3' })}

      <!-- DIY Plug-In 12V Test Lamp -->
      <g>
        <path d="M${lx} ${ly} Q${lx + 38} ${ly + 32} 1028 450" fill="none" stroke="#3b82f6" stroke-width="3.5" stroke-dasharray="5 3"/>
        <rect x="976" y="346" width="122" height="202" rx="12" fill="${c.cardBg}" stroke="${ev.lampLit ? c.warn : c.cardStroke}" stroke-width="2.5"/>
        <text x="1037" y="370" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="800">DIY TEST LAMP</text>
        <rect x="992" y="378" width="90" height="20" rx="4" fill="#f59e0b"/>
        <text x="1037" y="392" text-anchor="middle" fill="#111827" font-size="10" font-weight="900">12V DC ONLY</text>

        ${ev.lampLit ? `<circle cx="1037" cy="448" r="38" fill="url(#bulb-glow)" class="anim-glow"/>` : ''}
        <circle cx="1037" cy="448" r="22" fill="${ev.lampLit ? '#fde047' : '#e2e8f0'}" stroke="${ev.lampLit ? '#f59e0b' : '#64748b'}" stroke-width="2.5"/>
        <text x="1037" y="452" text-anchor="middle" fill="#111827" font-size="10.5" font-weight="800">${ev.lampLit ? 'LIT!' : 'DARK'}</text>

        <text x="1037" y="496" text-anchor="middle" fill="${c.muted}" font-size="10.5">Plugged into:</text>
        <text x="1037" y="513" text-anchor="middle" fill="${c.text}" font-size="11.5" font-weight="800">${s.lampSocket.toUpperCase()}</text>
        <text x="1037" y="534" text-anchor="middle" fill="${ev.probedHot ? c.ok : c.muted}" font-size="11" font-weight="700">${ev.probedHot ? '12.04 V DC' : '0.00 V DC'}</text>
      </g>

      ${!s.outlet3TabBroken ? `
        <g class="svg-hit" data-action="sim-fix-tab">
          <rect x="760" y="328" width="194" height="28" rx="6" fill="#ef4444"/>
          <text x="857" y="346" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="800">TAB INTACT! Click to Snap Off</text>
        </g>
      ` : ''}

      ${checkAllVerified() ? `
        <g class="anim-stamp">
          <rect x="646" y="70" width="232" height="44" rx="8" fill="#10b981" stroke="#ffffff" stroke-width="2.5"/>
          <text x="762" y="97" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="900">✓ INSPECTION PASSED</text>
        </g>
      ` : ''}
    `;
  }

  function renderMiniPreview(panelId, c) {
    const badges = {
      1: { bg: '#0ea5e9', fg: '#ffffff', txt: 'VOLTS · AMPS · LOOP' },
      2: { bg: '#eab308', fg: '#111827', txt: '14/2 · 14/3 · GROUND' },
      3: { bg: '#8b5cf6', fg: '#ffffff', txt: '8 PARTS & WHY NEEDED' },
      4: { bg: '#10b981', fg: '#ffffff', txt: 'SERIES VS PARALLEL' },
      5: { bg: '#f59e0b', fg: '#111827', txt: '12V DC ONLY · SAFETY' },
      6: { bg: '#2563eb', fg: '#ffffff', txt: '24-ITEM BOM · KNOLLING' },
      7: { bg: '#8b5cf6', fg: '#ffffff', txt: '2×4 STUDS · 5 BOXES' },
      8: { bg: '#10b981', fg: '#ffffff', txt: 'FUSES · N-G BOND' },
      9: { bg: '#ea580c', fg: '#ffffff', txt: 'STRIP & SCREW TORQUE' },
      10: { bg: '#d97706', fg: '#ffffff', txt: 'WAGO 221 · PIGTAILS' },
      11: { bg: '#f59e0b', fg: '#111827', txt: 'PARALLEL + HALF-HOT' },
      12: { bg: '#3b82f6', fg: '#ffffff', txt: '14/3 3-WAY SPDT X-RAY' },
      13: { bg: '#ec4899', fg: '#ffffff', txt: 'WIRE-IT-YOURSELF LAB' },
      14: { bg: '#10b981', fg: '#ffffff', txt: 'LIVE BENCH + 5 FAULTS' }
    }[panelId];

    return `
      <svg viewBox="0 0 320 120">
        <rect x="14" y="14" width="292" height="92" rx="6" fill="${c.plywood}" fill-opacity="0.32" stroke="${c.cardStroke}"/>
        <rect x="28" y="16" width="16" height="88" fill="${c.stud}" opacity="0.65"/>
        <rect x="152" y="16" width="16" height="88" fill="${c.stud}" opacity="0.65"/>
        <rect x="274" y="16" width="16" height="88" fill="${c.stud}" opacity="0.65"/>
        <path d="M36 52 L36 86 L282 86" fill="none" stroke="${c.hotGlow}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M36 42 L160 42 L282 42" fill="none" stroke="${c.redWire}" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="24" y="34" width="24" height="36" rx="3" fill="${c.cardBg}" stroke="${c.warn}" stroke-width="1.5"/>
        <circle cx="160" cy="24" r="9" fill="#fde047" stroke="#f59e0b" stroke-width="1.5"/>
        <rect x="148" y="74" width="20" height="24" rx="2" fill="${c.blueBox}"/>
        <rect x="270" y="74" width="20" height="24" rx="2" fill="${c.blueBox}"/>
        <rect x="54" y="46" width="212" height="24" rx="5" fill="${badges.bg}"/>
        <text x="160" y="62" text-anchor="middle" fill="${badges.fg}" font-size="11" font-weight="800">${badges.txt}</text>
      </svg>
    `;
  }

  // =========================================================================
  // 7. QUICK ACTIONS & SIDE INSPECTOR DRAWERS
  // =========================================================================
  function renderQuickActions(p) {
    if (p === 1) {
      return `<button type="button" data-action="intro-toggle-loop" class="ui-btn ${state.introLoopClosed ? 'success' : ''}">Switch Loop: ${state.introLoopClosed ? 'CLOSED' : 'OPEN'}</button>`;
    }
    if (p === 2) {
      return `<button type="button" data-action="intro-toggle-gf" class="ui-btn">${state.introGroundFault ? '↺ Clear Ground Fault' : '⚡ Test Ground Fault'}</button>`;
    }
    if (p === 3) {
      return `<button type="button" data-action="intro-toggle-overload" class="ui-btn">${state.introFuseOverload ? '↺ Replace 5A Fuse' : '🔥 Test 7A Overload'}</button>`;
    }
    if (p === 4) {
      return `<button type="button" data-action="intro-toggle-unplug" class="ui-btn primary">${state.introBulbRemoved ? '↺ Plug Bulb #1 Back In' : '🔌 Unplug Bulb #1'}</button>`;
    }
    if (p === 7) {
      return [1, 2, 3, 4].map((st) => `
        <button type="button" data-action="p3-step" data-step="${st}"
          class="ui-btn ${state.frameStep === st ? 'primary' : ''}">Beat ${st}</button>
      `).join('');
    }
    if (p === 8) {
      return `
        <button type="button" data-action="p4-toggle-f1" class="ui-btn">Fuse #1: ${state.p4Fuse1 ? 'ON' : 'OFF'}</button>
        <button type="button" data-action="p4-toggle-f2" class="ui-btn">Fuse #2: ${state.p4Fuse2 ? 'ON' : 'OFF'}</button>
        <button type="button" data-action="p4-toggle-bond" class="ui-btn">${state.p4Subpanel ? 'Subpanel' : 'Main Bonded'}</button>
      `;
    }
    if (p === 9) {
      return `<button type="button" data-action="p5-torque" class="ui-btn primary">↻ Torque Screw</button>`;
    }
    if (p === 10) {
      return `
        <button type="button" data-action="p6-remove-o1" class="ui-btn ${state.p6Outlet1Removed ? 'success' : ''}">
          ${state.p6Outlet1Removed ? 'Reinstall Outlet #1' : 'Remove Outlet #1'}
        </button>
      `;
    }
    if (p === 11) {
      return `
        <button type="button" data-action="p7-toggle-tab" class="ui-btn">${state.p7TabBroken ? 'Brass Tab: Broken' : 'Brass Tab: Intact'}</button>
        <button type="button" data-action="p7-toggle-sw" class="ui-btn ${state.p7SwitchOn ? 'success' : ''}">1-Pole Sw: ${state.p7SwitchOn ? 'ON' : 'OFF'}</button>
      `;
    }
    if (p === 12) {
      return `
        <button type="button" data-action="p8-flip-a" class="ui-btn">Flip Sw A (${state.p8SwA})</button>
        <button type="button" data-action="p8-flip-b" class="ui-btn">Flip Sw B (${state.p8SwB})</button>
      `;
    }
    if (p === 13) {
      return `<button type="button" data-action="p9-reset" class="ui-btn">Reset Challenge</button>`;
    }
    if (p === 14) {
      const nextFlow = state.sim.flowMode === 'conv' ? 'Conventional (+→-)' : (state.sim.flowMode === 'elec' ? 'Electron (-→+)' : 'Flow: OFF');
      return `
        <button type="button" data-action="sim-cycle-flow" class="ui-btn active-toggle">${nextFlow}</button>
        <button type="button" data-action="sim-reset" class="ui-btn">Reset Bench</button>
      `;
    }
    return `<span class="font-mono" style="color:var(--muted);">Click interactive elements on the stage</span>`;
  }

  function renderSideDrawer() {
    const grid = document.getElementById('theater-grid');
    const drawer = document.getElementById('side-drawer');

    if (state.panel === 3) {
      grid.classList.add('with-drawer');
      drawer.classList.remove('hidden');

      drawer.innerHTML = `
        <div class="drawer-box">
          <div class="drawer-header">
            <div>
              <h3 class="drawer-title">Beginner Parts Encyclopedia</h3>
              <p class="brand-sub">Select any part to see why our board needs it</p>
            </div>
            <span class="phase-pill font-mono">8 Parts</span>
          </div>
          <div style="display:grid; gap:6px; max-height:515px; overflow-y:auto; padding-right:4px;">
            ${PARTS_GUIDE.map((pt) => {
              const active = state.introPartSel === pt.id;
              return `
                <button type="button" data-action="intro-pick-part" data-part="${pt.id}"
                  class="ui-btn ${active ? 'active-toggle' : ''}" style="text-align:left; padding:8px 10px;">
                  <div style="display:flex; justify-content:space-between; gap:6px; align-items:center;">
                    <strong>${pt.name}</strong>
                    <span class="font-mono" style="font-size:10px; color:var(--warning);">${pt.badge}</span>
                  </div>
                  ${active ? `
                    <div style="font-weight:400; font-size:11.5px; color:var(--muted); margin-top:5px; line-height:1.45;">
                      <div><strong style="color:var(--success);">What:</strong> ${pt.what}</div>
                      <div style="margin-top:3px;"><strong style="color:var(--warning);">Why:</strong> ${pt.why}</div>
                      <div style="margin-top:3px;"><strong style="color:var(--text);">In a House:</strong> ${pt.home}</div>
                    </div>
                  ` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
      return;
    }

    if (state.panel === 6) {
      grid.classList.add('with-drawer');
      drawer.classList.remove('hidden');

      const cats = ['All', 'Board & Framing', 'Power & Panel', 'Wire & Boxes', 'Devices & Loads', 'Tools'];
      const visible = state.bomCat === 'All' ? BOM_ITEMS : BOM_ITEMS.filter((i) => i.cat === state.bomCat);
      const pct = Math.round((state.bomChecked.size / BOM_ITEMS.length) * 100);

      drawer.innerHTML = `
        <div class="drawer-box">
          <div class="drawer-header">
            <div>
              <h3 class="drawer-title">Materials Checklist</h3>
              <p class="brand-sub">Click name to inspect · Box to check off</p>
            </div>
            <span class="phase-pill font-mono">${state.bomChecked.size}/${BOM_ITEMS.length} (${pct}%)</span>
          </div>
          <div class="autoplay-track"><div class="autoplay-fill" style="width:${pct}%"></div></div>
          <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:4px;">
            ${cats.map((cat) => `
              <button type="button" data-action="bom-cat" data-cat="${cat}"
                class="ui-btn ${state.bomCat === cat ? 'primary' : ''}" style="padding:4px 8px; font-size:11.5px;">
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="bom-scroll">
          ${visible.map((item) => {
            const checked = state.bomChecked.has(item.id);
            const selected = state.bomSelected === item.id;
            return `
              <div class="bom-row ${selected ? 'selected' : ''}">
                <input type="checkbox" ${checked ? 'checked' : ''} data-action="bom-check" data-id="${item.id}" style="margin-top:2px; cursor:pointer;" />
                <button type="button" data-action="bom-select" data-id="${item.id}">
                  <div style="font-weight:700; ${checked ? 'text-decoration:line-through; color:var(--muted);' : ''}">${item.name}</div>
                  <div style="color:var(--muted); font-size:11px; margin-top:2px;">${item.cat}</div>
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `;
      return;
    }

    if (state.panel === 13) {
      grid.classList.add('with-drawer');
      drawer.classList.remove('hidden');

      const ch = WIRING_CHALLENGES[state.p9Idx];
      const conn = state.p9Connected[state.p9Idx] || {};
      const passedCount = WIRING_CHALLENGES.filter((c, i) => {
        const cn = state.p9Connected[i] || {};
        return c.terminals.every((t) => Boolean(cn[t.id])) && (!c.requiresTabBreak || state.p9TabBroken);
      }).length;

      drawer.innerHTML = `
        <div class="drawer-box">
          <div class="drawer-header">
            <h3 class="drawer-title">Wire-It-Yourself Exercises</h3>
            <span class="phase-pill font-mono">${passedCount}/3 Passed</span>
          </div>
          <div style="display:grid; gap:6px;">
            ${WIRING_CHALLENGES.map((c, idx) => {
              const cn = state.p9Connected[idx] || {};
              const done = c.terminals.every((t) => Boolean(cn[t.id])) && (!c.requiresTabBreak || state.p9TabBroken);
              return `
                <button type="button" data-action="p9-select-ch" data-idx="${idx}"
                  class="ui-btn ${state.p9Idx === idx ? 'primary' : ''}" style="text-align:left;">
                  ${done ? '✓ ' : ''}${c.title}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="drawer-box">
          <h3 class="drawer-title">Active Challenge Progress</h3>
          <ul class="callout-list">
            ${ch.terminals.map((t) => `
              <li class="callout-item">
                <span style="font-weight:800; color:${conn[t.id] ? 'var(--success)' : 'var(--muted)'}">${conn[t.id] ? '✓' : '○'}</span>
                <span><strong>${t.label}</strong></span>
              </li>
            `).join('')}
            ${ch.requiresTabBreak ? `
              <li class="callout-item">
                <span style="font-weight:800; color:${state.p9TabBroken ? 'var(--success)' : 'var(--warning)'}">${state.p9TabBroken ? '✓' : '○'}</span>
                <span><strong>Break Brass Hot Tab</strong></span>
              </li>
            ` : ''}
          </ul>
          <button type="button" data-action="p9-reset" class="ui-btn">Clear &amp; Retry This Challenge</button>
        </div>
      `;
      return;
    }

    if (state.panel === 14) {
      grid.classList.add('with-drawer');
      drawer.classList.remove('hidden');

      const s = state.sim;
      const ev = evaluateSim();
      const v = s.verify;
      const test1Pass = v.o1Tested && v.o2Tested;
      const test2Pass = v.o3TopOffObserved && v.o3TopOnObserved;
      const test3Pass = v.swAChanged && v.swBChanged;
      const passNum = [test1Pass, test2Pass, test3Pass].filter(Boolean).length;

      const dmmReadout = s.dmmMode === 'vdc'
        ? (ev.probedHot ? '12.04 V DC' : '0.00 V DC')
        : '0.1 Ω · BEEP';
      const dmmSub = s.dmmMode === 'vdc'
        ? `Probing ${s.lampSocket.toUpperCase()} (${ev.probedHot ? 'Energized' : 'No Voltage'})`
        : 'Neutral Bus ↔ Ground Bus Bond Verified';

      drawer.innerHTML = `
        <div class="drawer-box">
          <div class="drawer-header">
            <h3 class="drawer-title">Digital Multimeter</h3>
            <div class="segmented">
              <button type="button" data-action="sim-dmm-mode" data-mode="vdc" class="seg-btn ${s.dmmMode === 'vdc' ? 'active' : ''}" style="padding:3px 8px;">V DC</button>
              <button type="button" data-action="sim-dmm-mode" data-mode="cont" class="seg-btn ${s.dmmMode === 'cont' ? 'active' : ''}" style="padding:3px 8px;">Ω Bond</button>
            </div>
          </div>
          <div class="dmm-lcd font-mono ${s.dmmMode === 'vdc' && !ev.probedHot ? 'zero' : ''}">${dmmReadout}</div>
          <p class="brand-sub">${dmmSub}</p>
        </div>

        <div class="drawer-box">
          <div class="drawer-header">
            <h3 class="drawer-title">Step 5 Inspection Certificate</h3>
            <span class="phase-pill font-mono">${passNum}/3</span>
          </div>
          <ul class="callout-list">
            <li class="callout-item">
              <span style="font-weight:800; color:${test1Pass ? 'var(--success)' : 'var(--muted)'}">${test1Pass ? '✓' : '○'}</span>
              <span><strong>Parallel Outlets:</strong> Plug test lamp into Outlet #1 &amp; Outlet #2 at 12V.</span>
            </li>
            <li class="callout-item">
              <span style="font-weight:800; color:${test2Pass ? 'var(--success)' : 'var(--muted)'}">${test2Pass ? '✓' : '○'}</span>
              <span><strong>Half-Hot Split:</strong> Flip 1-Pole Switch ON &amp; OFF while Outlet #3 Top toggles &amp; Bottom stays hot.</span>
            </li>
            <li class="callout-item">
              <span style="font-weight:800; color:${test3Pass ? 'var(--success)' : 'var(--muted)'}">${test3Pass ? '✓' : '○'}</span>
              <span><strong>3-Way Control:</strong> Flip both Switch A &amp; Switch B to toggle ceiling light.</span>
            </li>
          </ul>
        </div>

        <div class="drawer-box">
          <h3 class="drawer-title">Fault Troubleshooting Lab (5 Modes)</h3>
          <div style="display:grid; gap:6px;">
            ${[
              ['none', 'Normal Build (All Healthy)', 'All circuits wired & verified.'],
              ['fuse1', 'Fault 1: Blown Fuse #1', 'Outlets 1–3 dead; Ceiling Light still works. Click Fuse #1 to replace!'],
              ['tab', 'Fault 2: Unbroken Brass Tab', 'Outlet #3 Top stays stuck ON with switch OFF! Click tab to snap off.'],
              ['traveler', 'Fault 3: Loose Red Traveler', '3-way works on Black+Black, fails on Red+Red! Click loose wire to fix.'],
              ['neutral', 'Fault 4: Open Neutral Splice (O1→O2)', 'Outlet #1 works; Outlets #2 & #3 lose return path! Click open splice to fix.']
            ].map(([fid, label, hint]) => {
              const active = s.activeFault === fid;
              return `
                <button type="button" data-action="sim-fault" data-fault="${fid}"
                  class="ui-btn ${active ? 'active-toggle' : ''}" style="text-align:left; padding:7px 9px;">
                  <div>${label}</div>
                  ${active ? `<div style="font-weight:400; font-size:11px; color:var(--muted); margin-top:3px;">${hint}</div>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
      return;
    }

    grid.classList.remove('with-drawer');
    drawer.classList.add('hidden');
    drawer.innerHTML = '';
  }

  function renderFilmstrip() {
    const container = document.getElementById('filmstrip');
    container.innerHTML = PANELS.map((p) => {
      const active = p.id === state.panel;
      return `
        <button type="button" data-action="go-panel" data-panel="${p.id}" class="film-tab ${active ? 'active' : ''}">
          <div class="film-meta font-mono">
            <span class="film-code">${p.code}</span>
            <span>${p.id}/${PANELS.length}</span>
          </div>
          <div class="film-title">${p.shortTitle}</div>
          <div class="film-phase">${p.phase}</div>
        </button>
      `;
    }).join('');
  }

  function renderGridView() {
    const c = palette();
    const grid = document.getElementById('grid-cards');
    grid.innerHTML = PANELS.map((p) => `
      <button type="button" data-action="grid-open" data-panel="${p.id}" class="grid-card">
        <div class="film-meta font-mono">
          <span style="color:var(--primary); font-weight:700;">${p.code}</span>
          <span>${p.phase}</span>
        </div>
        ${renderMiniPreview(p.id, c)}
        <h3>${p.shortTitle}</h3>
        <p>${p.narration}</p>
      </button>
    `).join('');
  }

  // =========================================================================
  // 8. MASTER RENDER
  // =========================================================================
  function render(opts = {}) {
    const p = PANELS[state.panel - 1];
    const c = palette();

    const theaterEl = document.getElementById('theater-view');
    const gridEl = document.getElementById('grid-view');
    const playControls = document.getElementById('playback-controls');
    const btnTheater = document.getElementById('btn-view-theater');
    const btnGrid = document.getElementById('btn-view-grid');

    if (state.view === 'theater') {
      theaterEl.classList.remove('hidden');
      gridEl.classList.add('hidden');
      playControls.classList.remove('hidden');
      btnTheater.classList.add('active');
      btnGrid.classList.remove('active');
    } else {
      theaterEl.classList.add('hidden');
      gridEl.classList.remove('hidden');
      playControls.classList.add('hidden');
      btnGrid.classList.add('active');
      btnTheater.classList.remove('active');
      renderGridView();
    }

    document.getElementById('btn-play').textContent = state.playing ? '❚❚ Pause' : '▶ Play Storyboard';
    document.getElementById('autoplay-track').classList.toggle('hidden', !state.playing);
    document.getElementById('btn-speed').textContent = `${state.speed}x`;
    document.getElementById('btn-prev').disabled = state.panel <= 1;
    document.getElementById('btn-next').disabled = state.panel >= PANELS.length;

    const btnSound = document.getElementById('btn-sound');
    btnSound.textContent = SoundFX.enabled ? '🔊 Sound' : '🔇 Sound';
    btnSound.classList.toggle('active-toggle', SoundFX.enabled);

    document.getElementById('stage-badge').textContent = `PANEL ${String(p.id).padStart(2, '0')} / ${PANELS.length}`;
    document.getElementById('stage-title').textContent = p.title;
    document.getElementById('stage-phase-pill').textContent = p.phase;
    document.getElementById('stage-narration').textContent = p.narration;
    document.getElementById('stage-quick-actions').innerHTML = renderQuickActions(p.id);

    document.getElementById('stage-callouts').innerHTML = p.callouts.map((co) => `
      <li class="callout-item">
        <span class="callout-tag font-mono ${co.tone}">${co.tag}</span>
        <span>${co.text}</span>
      </li>
    `).join('');

    const svg = document.getElementById('stage-svg');
    const renderers = {
      1: renderPanel1,
      2: renderPanel2,
      3: renderPanel3,
      4: renderPanel4,
      5: renderPanel5,
      6: renderPanel6,
      7: renderPanel7,
      8: renderPanel8,
      9: renderPanel9,
      10: renderPanel10,
      11: renderPanel11,
      12: renderPanel12,
      13: renderPanel13,
      14: renderPanel14
    };
    if (opts.reanimate) svg.innerHTML = '';
    svg.innerHTML = renderers[state.panel](c);

    renderSideDrawer();
    renderFilmstrip();
  }

  // =========================================================================
  // 9. AUTOPLAY & NAVIGATION
  // =========================================================================
  function stopAutoplay() {
    state.playing = false;
    if (autoplayTimer) {
      cancelAnimationFrame(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function stop3WayCycle() {
    state.p8Cycling = false;
    if (cycle3WayTimer) {
      clearInterval(cycle3WayTimer);
      cycle3WayTimer = null;
    }
  }

  function tickAutoplay(ts) {
    if (!state.playing) return;
    const p = PANELS[state.panel - 1];
    const targetMs = p.durationMs / state.speed;
    const pct = Math.min(100, ((ts - autoplayStart) / targetMs) * 100);
    document.getElementById('autoplay-fill').style.width = `${pct}%`;

    if (ts - autoplayStart >= targetMs) {
      if (state.panel < PANELS.length) {
        state.panel += 1;
        autoplayStart = ts;
        render({ reanimate: true });
      } else {
        stopAutoplay();
        render();
        return;
      }
    }
    autoplayTimer = requestAnimationFrame(tickAutoplay);
  }

  function startAutoplay() {
    stop3WayCycle();
    state.view = 'theater';
    if (state.panel >= PANELS.length) state.panel = 1;
    state.playing = true;
    autoplayStart = performance.now();
    render({ reanimate: true });
    autoplayTimer = requestAnimationFrame(tickAutoplay);
  }

  function goToPanel(num) {
    stop3WayCycle();
    state.panel = Math.max(1, Math.min(PANELS.length, num));
    if (state.playing) autoplayStart = performance.now();
    if (state.panel === 14) recordVerifyObservation();
    render({ reanimate: true });
  }

  // =========================================================================
  // 10. EVENT DELEGATION & KEYBOARD SHORTCUTS
  // =========================================================================
  document.getElementById('app').addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    switch (action) {
      case 'set-view':
        state.view = el.dataset.view;
        if (state.view === 'grid') stopAutoplay();
        render();
        break;
      case 'grid-open':
        state.view = 'theater';
        goToPanel(Number(el.dataset.panel));
        break;
      case 'go-panel':
        goToPanel(Number(el.dataset.panel));
        break;
      case 'prev-panel':
        if (state.panel > 1) goToPanel(state.panel - 1);
        break;
      case 'next-panel':
        if (state.panel < PANELS.length) goToPanel(state.panel + 1);
        break;
      case 'replay-panel':
        if (state.playing) autoplayStart = performance.now();
        render({ reanimate: true });
        break;
      case 'toggle-play':
        if (state.playing) {
          stopAutoplay();
          render();
        } else {
          startAutoplay();
        }
        break;
      case 'cycle-speed': {
        const speeds = [0.75, 1.0, 1.5];
        state.speed = speeds[(speeds.indexOf(state.speed) + 1) % speeds.length];
        if (state.playing) autoplayStart = performance.now();
        render();
        break;
      }
      case 'toggle-sound':
        SoundFX.enabled = !SoundFX.enabled;
        if (SoundFX.enabled) SoundFX.snap();
        render();
        break;
      case 'toggle-theme': {
        const light = document.documentElement.classList.toggle('light');
        el.textContent = light ? '☾ Dark' : '☀ Light';
        render();
        break;
      }

      // Beginner Panels 1–4
      case 'intro-toggle-loop':
        SoundFX.click();
        state.introLoopClosed = !state.introLoopClosed;
        render();
        break;
      case 'intro-pick-wire':
        SoundFX.click();
        state.introWireSel = el.dataset.wire;
        render();
        break;
      case 'intro-toggle-gf':
        state.introGroundFault = !state.introGroundFault;
        if (state.introGroundFault) SoundFX.spark();
        else SoundFX.snap();
        render();
        break;
      case 'intro-pick-part':
        SoundFX.click();
        state.introPartSel = el.dataset.part;
        render();
        break;
      case 'intro-toggle-overload':
        state.introFuseOverload = !state.introFuseOverload;
        if (state.introFuseOverload) SoundFX.spark();
        else SoundFX.snap();
        render();
        break;
      case 'intro-toggle-unplug':
        SoundFX.snap();
        state.introBulbRemoved = !state.introBulbRemoved;
        render();
        break;

      // Panel 1
      case 'p1-hotspot':
        SoundFX.click();
        state.safetyHotspot = el.dataset.spot;
        render();
        break;

      // Panel 2
      case 'bom-cat':
        state.bomCat = el.dataset.cat;
        renderSideDrawer();
        break;
      case 'bom-select':
        SoundFX.click();
        state.bomSelected = el.dataset.id;
        render();
        break;
      case 'bom-check': {
        const id = el.dataset.id;
        if (state.bomChecked.has(id)) state.bomChecked.delete(id);
        else {
          state.bomChecked.add(id);
          SoundFX.snap();
        }
        renderSideDrawer();
        break;
      }

      // Panel 3
      case 'p3-step':
        SoundFX.snap();
        state.frameStep = Number(el.dataset.step);
        render({ reanimate: true });
        break;

      // Panel 4
      case 'p4-toggle-f1':
        SoundFX.snap();
        state.p4Fuse1 = !state.p4Fuse1;
        render();
        break;
      case 'p4-toggle-f2':
        SoundFX.snap();
        state.p4Fuse2 = !state.p4Fuse2;
        render();
        break;
      case 'p4-toggle-bond':
        SoundFX.click();
        state.p4Subpanel = !state.p4Subpanel;
        render();
        break;

      // Panel 5
      case 'p5-hook':
        SoundFX.click();
        state.p5HookMode = el.dataset.mode;
        state.p5TorqueCount = 0;
        render();
        break;
      case 'p5-torque':
        SoundFX.snap();
        state.p5TorqueCount += 1;
        render();
        break;

      // Panel 6
      case 'p6-splice':
        SoundFX.click();
        state.p6SpliceMode = el.dataset.mode;
        render();
        break;
      case 'p6-lever': {
        const idx = Number(el.dataset.idx);
        SoundFX.snap();
        state.p6Levers[idx] = !state.p6Levers[idx];
        render();
        break;
      }
      case 'p6-style':
        SoundFX.click();
        state.p6WiringStyle = el.dataset.style;
        render();
        break;
      case 'p6-remove-o1':
        SoundFX.click();
        state.p6Outlet1Removed = !state.p6Outlet1Removed;
        render();
        break;

      // Panel 7
      case 'p7-toggle-sw':
        SoundFX.click();
        state.p7SwitchOn = !state.p7SwitchOn;
        render();
        break;
      case 'p7-toggle-tab':
        SoundFX.snap();
        state.p7TabBroken = !state.p7TabBroken;
        render();
        break;

      // Panel 8
      case 'p8-flip-a':
        stop3WayCycle();
        SoundFX.click();
        state.p8SwA = state.p8SwA === 'black' ? 'red' : 'black';
        render();
        break;
      case 'p8-flip-b':
        stop3WayCycle();
        SoundFX.click();
        state.p8SwB = state.p8SwB === 'black' ? 'red' : 'black';
        render();
        break;
      case 'p8-cycle':
        if (state.p8Cycling) {
          stop3WayCycle();
          render();
        } else {
          state.p8Cycling = true;
          let stepIdx = 0;
          const pairs = [['black', 'black'], ['black', 'red'], ['red', 'red'], ['red', 'black']];
          cycle3WayTimer = setInterval(() => {
            stepIdx = (stepIdx + 1) % pairs.length;
            state.p8SwA = pairs[stepIdx][0];
            state.p8SwB = pairs[stepIdx][1];
            SoundFX.click();
            render();
          }, 1100);
          render();
        }
        break;

      // Panel 9 Wire-It-Yourself
      case 'p9-select-ch': {
        SoundFX.click();
        state.p9Idx = Number(el.dataset.idx);
        const ch = WIRING_CHALLENGES[state.p9Idx];
        state.p9ActiveWire = ch.wires[0].id;
        state.p9Feedback = { tone: 'neutral', text: 'Pick a conductor wire, then click its matching terminal screw!' };
        render();
        break;
      }
      case 'p9-pick-wire':
        SoundFX.click();
        state.p9ActiveWire = el.dataset.wire;
        render();
        break;
      case 'p9-click-term': {
        const termId = el.dataset.term;
        const ch = WIRING_CHALLENGES[state.p9Idx];
        const term = ch.terminals.find((t) => t.id === termId);
        const wireId = state.p9ActiveWire;
        if (!term || !wireId) break;

        if (term.accept.includes(wireId)) {
          const conn = state.p9Connected[state.p9Idx];
          // Remove wire from any previous terminal in this challenge
          Object.keys(conn).forEach((k) => { if (conn[k] === wireId) delete conn[k]; });
          conn[termId] = wireId;
          const nextUnwired = ch.wires.find((w) => !Object.values(conn).includes(w.id));
          if (nextUnwired) state.p9ActiveWire = nextUnwired.id;

          const done = ch.terminals.every((t) => Boolean(conn[t.id])) && (!ch.requiresTabBreak || state.p9TabBroken);
          if (done) {
            SoundFX.chime();
            state.p9Feedback = { tone: 'ok', text: 'Perfect! All terminals & safety tabs correctly completed!' };
          } else {
            SoundFX.snap();
            state.p9Feedback = { tone: 'ok', text: `Good termination! ${ch.requiresTabBreak && !state.p9TabBroken ? 'Remember to break the Brass Tab too.' : 'Continue with remaining wires.'}` };
          }
        } else {
          SoundFX.spark();
          state.p9Feedback = { tone: 'error', text: `Mismatch! ${term.hint}` };
        }
        render();
        break;
      }
      case 'p9-break-tab':
        SoundFX.snap();
        state.p9TabBroken = !state.p9TabBroken;
        if (state.p9TabBroken) {
          const ch = WIRING_CHALLENGES[1];
          const conn = state.p9Connected[1];
          if (ch.terminals.every((t) => Boolean(conn[t.id]))) SoundFX.chime();
        }
        render();
        break;
      case 'p9-reset': {
        SoundFX.click();
        state.p9Connected[state.p9Idx] = {};
        if (state.p9Idx === 1) state.p9TabBroken = false;
        state.p9ActiveWire = WIRING_CHALLENGES[state.p9Idx].wires[0].id;
        state.p9Feedback = { tone: 'neutral', text: 'Challenge reset. Pick a conductor wire to start!' };
        render();
        break;
      }

      // Panel 10 Live Simulator
      case 'sim-toggle-psu':
        SoundFX.click();
        state.sim.psuOn = !state.sim.psuOn;
        recordVerifyObservation();
        render();
        break;
      case 'sim-toggle-fuse1':
        SoundFX.snap();
        state.sim.fuse1Intact = !state.sim.fuse1Intact;
        if (state.sim.fuse1Intact && state.sim.activeFault === 'fuse1') state.sim.activeFault = 'none';
        recordVerifyObservation();
        render();
        break;
      case 'sim-toggle-fuse2':
        SoundFX.snap();
        state.sim.fuse2Intact = !state.sim.fuse2Intact;
        render();
        break;
      case 'sim-toggle-sp':
        SoundFX.click();
        state.sim.spSwitchOn = !state.sim.spSwitchOn;
        recordVerifyObservation();
        if (checkAllVerified()) SoundFX.chime();
        render();
        break;
      case 'sim-toggle-3wa': {
        SoundFX.click();
        const before = evaluateSim().ceilingLightOn;
        state.sim.sw3WayA = state.sim.sw3WayA === 'black' ? 'red' : 'black';
        if (before !== evaluateSim().ceilingLightOn) state.sim.verify.swAChanged = true;
        if (checkAllVerified()) SoundFX.chime();
        render();
        break;
      }
      case 'sim-toggle-3wb': {
        SoundFX.click();
        const before = evaluateSim().ceilingLightOn;
        state.sim.sw3WayB = state.sim.sw3WayB === 'black' ? 'red' : 'black';
        if (before !== evaluateSim().ceilingLightOn) state.sim.verify.swBChanged = true;
        if (checkAllVerified()) SoundFX.chime();
        render();
        break;
      }
      case 'sim-plug':
        SoundFX.snap();
        state.sim.lampSocket = el.dataset.socket;
        recordVerifyObservation();
        if (checkAllVerified()) SoundFX.chime();
        render();
        break;
      case 'sim-dmm-mode':
        state.sim.dmmMode = el.dataset.mode;
        if (state.sim.dmmMode === 'cont') SoundFX.beep();
        else SoundFX.click();
        renderSideDrawer();
        break;
      case 'sim-cycle-flow': {
        SoundFX.click();
        const modes = ['conv', 'elec', 'off'];
        state.sim.flowMode = modes[(modes.indexOf(state.sim.flowMode) + 1) % modes.length];
        render();
        break;
      }
      case 'sim-fix-tab':
        SoundFX.snap();
        state.sim.outlet3TabBroken = true;
        if (state.sim.activeFault === 'tab') state.sim.activeFault = 'none';
        recordVerifyObservation();
        render();
        break;
      case 'sim-fix-traveler':
        SoundFX.snap();
        state.sim.redTravelerConnected = true;
        if (state.sim.activeFault === 'traveler') state.sim.activeFault = 'none';
        render();
        break;
      case 'sim-fix-neutral':
        SoundFX.snap();
        state.sim.neutralSpliceIntact = true;
        if (state.sim.activeFault === 'neutral') state.sim.activeFault = 'none';
        recordVerifyObservation();
        render();
        break;
      case 'sim-fault': {
        const f = el.dataset.fault;
        if (f !== 'none') SoundFX.spark();
        else SoundFX.snap();
        state.sim.activeFault = f;
        state.sim.psuOn = true;
        state.sim.fuse1Intact = f !== 'fuse1';
        state.sim.fuse2Intact = true;
        state.sim.outlet3TabBroken = f !== 'tab';
        state.sim.redTravelerConnected = f !== 'traveler';
        state.sim.neutralSpliceIntact = f !== 'neutral';
        if (f === 'tab') {
          state.sim.spSwitchOn = false;
          state.sim.lampSocket = 'o3-top';
        } else if (f === 'traveler') {
          state.sim.sw3WayA = 'red';
          state.sim.sw3WayB = 'red';
        } else if (f === 'neutral') {
          state.sim.lampSocket = 'o2-top';
        }
        recordVerifyObservation();
        render();
        break;
      }
      case 'sim-reset':
        SoundFX.click();
        state.sim.psuOn = true;
        state.sim.fuse1Intact = true;
        state.sim.fuse2Intact = true;
        state.sim.outlet3TabBroken = true;
        state.sim.redTravelerConnected = true;
        state.sim.neutralSpliceIntact = true;
        state.sim.spSwitchOn = true;
        state.sim.sw3WayA = 'black';
        state.sim.sw3WayB = 'black';
        state.sim.lampSocket = 'o3-top';
        state.sim.activeFault = 'none';
        state.sim.verify = {
          o1Tested: false,
          o2Tested: false,
          o3TopOffObserved: false,
          o3TopOnObserved: false,
          swAChanged: false,
          swBChanged: false
        };
        recordVerifyObservation();
        render();
        break;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' && state.panel < PANELS.length) {
      goToPanel(state.panel + 1);
    } else if (e.key === 'ArrowLeft' && state.panel > 1) {
      goToPanel(state.panel - 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      if (state.playing) {
        stopAutoplay();
        render();
      } else {
        startAutoplay();
      }
    } else if (e.key.toLowerCase() === 'r') {
      render({ reanimate: true });
    } else if (e.key.toLowerCase() === 'm') {
      SoundFX.enabled = !SoundFX.enabled;
      render();
    } else if (e.key.toLowerCase() === 'g') {
      state.view = state.view === 'theater' ? 'grid' : 'theater';
      if (state.view === 'grid') stopAutoplay();
      render();
    }
  });

  window.addEventListener('themechange', () => {
    render();
  });

  render({ reanimate: true });
})();
