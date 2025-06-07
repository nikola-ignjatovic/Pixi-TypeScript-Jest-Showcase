// TODO implement Magic Words
// TODO Host the application

import * as PIXI from "pixi.js";
import { Menu } from "./Menu";

// Creating PIXI Application
export const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x1e1e1e,
  resolution: window.devicePixelRatio || 1,
});

const canvas = app.view as HTMLCanvasElement;
document.body.appendChild(canvas);
canvas.id = "gameCanvas";

// Simple FPS Counter
const fpsCounter = document.createElement("div");
fpsCounter.id = "fpsCounter";
document.body.appendChild(fpsCounter);

app.ticker.add(() => {
  fpsCounter.textContent = `FPS: ${Math.round(app.ticker.FPS)}`;
});

const menu = new Menu();
menu.show();

/**
 * Responsive scaling
 */
function resize() {
  // Get new window size
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Resize the renderer explicitly
  app.renderer.resize(width, height);

  // base design size
  const baseWidth = 800;
  const baseHeight = 600;

  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;

  // Smaller scale to fit inside window
  const scale = Math.min(scaleX, scaleY);

  app.stage.scale.set(scale);

  // centering the stage
  app.stage.position.set(
    (width - baseWidth * scale) / 2,
    (height - baseHeight * scale) / 2
  );
}

// Listen for window resize and adapt
window.addEventListener("resize", () => {
  resize();
});

/**
 * Helper to clear the stage for switching examples, but we can pass containerToKeep to prevent it from deletion (menu in this case)
 * @param containerToKeep
 */
export function clearStageExcept(containerToKeep: PIXI.Container) {
  app.stage.children
    .filter((child) => child !== containerToKeep)
    .forEach((child) => app.stage.removeChild(child));
}

resize();
