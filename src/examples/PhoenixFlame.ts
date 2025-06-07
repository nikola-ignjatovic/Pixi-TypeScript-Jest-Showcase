import { app } from "../App";
import * as PIXI from "pixi.js";

interface Particle {
  sprite: PIXI.Sprite;
  velocityY: number;
  alphaDecay: number;
}

export default class PhoenixFlame {
  private container: PIXI.Container;
  private particles: Particle[] = [];
  private maxParticles = 10;

  private flameTexture: PIXI.Texture;

  private readonly FLAME_POSITION_X = 650;
  private readonly FLAME_POSITION_Y = 475;

  constructor() {
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);

    // Load texture once - assuming flame.png is in assets/img folder
    this.flameTexture = PIXI.Texture.from("assets/img/Flame.png");

    // Create initial particles
    for (let i = 0; i < this.maxParticles; i++) {
      const sprite = new PIXI.Sprite(this.flameTexture);
      sprite.anchor.set(0.5);
      this.resetParticle(sprite);

      this.container.addChild(sprite);

      this.particles.push({
        sprite,
        velocityY: this.randomRange(0.5, 2),
        alphaDecay: this.randomRange(0.005, 0.02),
      });
    }

    // Start animation
    app.ticker.add(this.update, this);
  }

  /**
   * Resets particles
   * @param sprite
   * @private
   */
  private resetParticle(sprite: PIXI.Sprite) {
    sprite.x = this.FLAME_POSITION_X / 2 + this.randomRange(-50, 50);
    sprite.y = this.FLAME_POSITION_Y - this.randomRange(10, 50);
    sprite.alpha = 1;
    sprite.scale.set(this.randomRange(0.3, 0.7));
    sprite.rotation = this.randomRange(-0.2, 0.2);
  }

  /**
   * Generates a random number from the given range
   * @param min
   * @param max
   * @private
   */
  private randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Updates particles (Position, Alpha, etc...)
   * @private
   */
  private update() {
    for (const p of this.particles) {
      p.sprite.y -= p.velocityY;
      p.sprite.alpha -= p.alphaDecay;

      // Flicker rotation randomly
      p.sprite.rotation += this.randomRange(-0.02, 0.02);

      if (p.sprite.alpha <= 0) {
        this.resetParticle(p.sprite);
        p.velocityY = this.randomRange(0.5, 2);
        p.alphaDecay = this.randomRange(0.005, 0.02);
      }
    }
  }

  /**
   * Destroys phoenix flame (currently not used, only used within tests)
   */
  public destroy() {
    app.ticker.remove(this.update, this);
    this.particles.forEach((p) => {
      this.container.removeChild(p.sprite);
      p.sprite.destroy();
    });
    app.stage.removeChild(this.container);
  }
}
