# Adding a Scrolling Background to Main Menu

This guide covers how to add an upward-scrolling, looping background image to `mainMenu.js`.

---

## Step 1 — Add the asset in `preloader.js`

Add this alongside the other `this.load.image` calls:

```javascript
this.load.image('menuBg', 'assets/your-menu-background.png');
```

> Replace `'assets/your-menu-background.png'` with the actual filename once the art is ready.

---

## Step 2 — Set up the background in `mainMenu.js` → `create()`

Add these lines inside `create()`:

```javascript
this.bg = this.add.image(0, 0, 'menuBg');
var scaleFactor = this.game.width / this.bg.texture.width;
this.bg.scale.setTo(scaleFactor, scaleFactor);
this.bgScaledHeight = this.bg.texture.height * scaleFactor;
this.bgScrollSpeed = 30; // pixels per second — adjust to taste
```

> The background must be added **before** any text or UI elements in `create()` so it renders behind them.

---

## Step 3 — Scroll the background in `mainMenu.js` → `update()`

Add these lines inside `update()`:

```javascript
// Scroll upward
this.bg.y -= this.bgScrollSpeed * this.time.physicsElapsed;

// When the full image has scrolled past, loop back to the top
if (this.bg.y <= -(this.bgScaledHeight - this.game.height)) {
  this.bg.y = 0;
}
```

---

## How It Works

- The image starts at `y = 0`, showing the **top** of the image at the top of the screen
- Each frame the image moves upward (negative y direction)
- When the bottom of the image reaches the bottom of the screen, `bg.y` resets to `0` and it loops
- `this.time.physicsElapsed` ensures the scroll speed is consistent regardless of frame rate

---

## Notes

- **Seamless looping** — works best if the top and bottom of the background image match visually, otherwise there will be a visible jump when it resets
- **Scroll speed** — `bgScrollSpeed` is in pixels per second. Lower = slower scroll. Typical range: 20–60
- **Scaling** — the image is scaled to fit the game width exactly, maintaining its original aspect ratio on the vertical axis
