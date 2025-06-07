import * as PIXI from "pixi.js";

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

// Helper to clear the stage for switching examples
export function clearStage() {
  app.stage.removeChildren();
}
