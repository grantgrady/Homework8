# Homework 8: Sound, Feedback, and Game States - Food Collection Game

## Name: Grant Grady

## Project Overview
An interactive game built on the previous assignment, adding **sound effects**, **background music**, **health system**, and **good/bad food types**. This project demonstrates classes, arrays, animation techniques, audio feedback, and game mechanics in p5.js. Features a character with idle/walk animations, collectible good/bad food objects, health tracking, countdown timer, and multiple game states.

## Updates from Homework 7

| Homework 7 | Homework 8 (New) |
|-----------------|--------------------------|
| Only good food | ✅ **Good food AND Bad food** - two distinct types |
| Score only | ✅ **Score + Health system** - track both |
| No sound | ✅ **Full audio feedback** - background music + sound effects |
| Game starts immediately | ✅ **Start screen** - click to begin |
| Single game over condition | ✅ **Two game over conditions** - health = 0 OR time = 0 |
| Basic visual feedback | ✅ **Enhanced visual feedback** - character appearance changes with health |
| No audio library | ✅ **p5.sound library** - professional audio integration |
| Simple food visuals | ✅ **Type indicators** - visual distinction between good/bad food |

## Features Implemented

### ✅ Character Animation (Requirements 1)
- **Two animation sets** stored in arrays:
  - `idleFrames` (4 frames) - gentle bouncing up and down
  - `walkFrames` (4 frames) - bouncing with leg movement
- **Animation switching** based on movement (idle → walk when using WASD)
- **Frame counter** (`ANIMATION_SPEED = 8`) controls animation timing
- **Smooth looping** through animation frames using modulo operator
- **Dynamic character appearance** - changes based on health level:
  - Normal eyes and smile when healthy (health > 2)
  - Worried eyes and frown when low health (health ≤ 2)

### ✅ Enhanced Food Class (Requirements 2, 3, 4)
- **Food class** (in `food.js`) with properties:
  - Position (x, y)
  - Size (30-45px)
  - Colors (mainColor, accentColor)
  - Shape type (0 = circle/berry, 1 = square/cracker)
  - **NEW: Food type** ("good" or "bad")
  - Collected status (boolean)
  - Float offset for animation
  - `moveTimer` for random movement intervals
- **NEW METHODS ADDED TO FOOD CLASS:**
  - `update()` - Handles timer-based random movement
  - `checkCollection()` - Collision detection logic
  - `collect()` - Marks food as collected
  - `respawn()` - Resets food after collection (70% good / 30% bad)
- **Display function** with enhanced visuals:
  - **Good food**: Bright colors with yellow glow
  - **Bad food**: Dark colors with red glow and X marking
- **6 food objects** (mix of good and bad)
- **Each food is unique**:
  - Different positions, sizes, colors, shapes
  - 70% chance to be good, 30% chance to be bad

### ✅ NEW: Good Food and Bad Food System
- **Good Food (Red/Pink)**:
  - Increases score by +1 when collected
  - Plays positive chime sound effect
  - Bright, appealing colors with yellow glow
- **Bad Food (Purple/Black)**:
  - Decreases health by -1 when collected
  - Plays negative buzz sound effect
  - Dark colors with red glow and X marking
- Visual distinction ensures players can easily identify food types

### ✅ NEW: Health System
- **Starting health**: 5 (displayed as heart icons)
- **Health decreases** only when bad food is collected
- **Visual health indicators**:
  - Red hearts for remaining health
  - Gray hearts for lost health
  - Character appearance changes at low health
  - Sky color darkens as health decreases
- **Game over** when health reaches 0

### ✅ NEW: Sound System (Requirements 1, 2, 5)
- **Background Music**:
  - Loaded from external file (`background-music.mp3`)
  - Starts when player clicks mouse (not on page load)
  - Loops continuously during gameplay
  - Volume set to 30% (background level)
  
- **Sound Effects**:
  - **Good food sound** (`good-food.wav`): Positive chime
  - **Bad food sound** (`bad-food.wav`): Negative buzz
  - **Game over sound** (`game-over.wav`): Dramatic finish
  - Each sound plays only once per event
  - Volume balanced for clear feedback

- **Sound Credits**:
  All sounds obtained from [Freesound.org](https://freesound.org):
  - Background music: ["Mushroom Background Music" by Sunsai](https://freesound.org/people/Sunsai/sounds/415804/) (CC BY 3.0)
  - Good food sound: ["WeaponSwipe03" by Yap_Audio_Production](https://freesound.org/people/Yap_Audio_Production/sounds/219005/) (CC BY 4.0)
  - Bad food sound: ["error" by Licht2003](https://freesound.org/people/Licht2003/sounds/808522/) (CC0)
  - Game over sound: ["8-bit Game Over Sound/Tune" by EVRetro](https://freesound.org/people/EVRetro/sounds/533034/) (CC BY 3.0)

### ✅ NEW: Game States
- **Start State**:
  - Instructions screen with game rules
  - "Click anywhere to start" prompt
  - Music starts on first click
  
- **Playing State**:
  - Active gameplay with movement and collection
  - All sound effects active
  - Timer counts down from 60 seconds
  
- **Game Over State**:
  - Triggered by: health = 0 OR time = 0
  - Dark overlay covers screen
  - Final score and time survived displayed
  - Click to restart

### ✅ Scoring System
- **Real-time score tracking** displayed in top-left
- **Score increases by +1** for each good food collected
- **Score unaffected** by bad food collection
- **Final score displayed** on game over screen

### ✅ Countdown Timer
- **60-second timer** starts when game begins
- **Real-time countdown** using `millis()` for accuracy
- **Visual warning**: Timer turns RED when less than 10 seconds remain
- **Game ends** when timer reaches zero (win condition if health > 0)

### ✅ Random Food Movement
- **Food moves to random locations** at unpredictable intervals
- **Timer-based system**: Each food has independent `moveTimer`
- **Random intervals**: Between 60-180 frames (approx 1-3 seconds at 60fps)
- Movement continues throughout gameplay

### ✅ Additional Features
- **Interactive movement** (WASD keys)
- **Screen boundary prevention** - character stays on canvas
- **Visual feedback** with floating animation (food gently bobs)
- **Proper folder structure** (index.html, js/, libs/, sounds/)
- **Title in upper-left corner**
- **Name in lower-right corner**
- **Animation indicator** shows current animation and frame number
