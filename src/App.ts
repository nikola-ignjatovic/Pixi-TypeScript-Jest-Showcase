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

// Add fullscreen button
const fsButton = document.createElement("button");
fsButton.id = "fsButton";
fsButton.textContent = "Go Fullscreen";
document.body.appendChild(fsButton);

// Todo we can technically put a loading screen and then on press any key to continue call openFullScreen since browsers prevent opening of full screen without users interaction and that way we would force user to interact.
const openFullScreen = () => {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if ((canvas as any).webkitRequestFullscreen) {
    // Safari support
    (canvas as any).webkitRequestFullscreen();
  } else if ((canvas as any).mozRequestFullScreen) {
    // Firefox support
    (canvas as any).mozRequestFullScreen();
  } else if ((canvas as any).msRequestFullscreen) {
    // IE/Edge support
    (canvas as any).msRequestFullscreen();
  }
};

fsButton.addEventListener("click", openFullScreen);

// Simple FPS Counter
const fpsCounter = document.createElement("div");
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

// Also listen for fullscreen changes to resize accordingly
document.addEventListener("fullscreenchange", () => {
  resize();
});

export function clearStageExcept(containerToKeep: PIXI.Container) {
  app.stage.children
    .filter((child) => child !== containerToKeep)
    .forEach((child) => app.stage.removeChild(child));
}

resize();
