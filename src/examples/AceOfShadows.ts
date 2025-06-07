import * as PIXI from "pixi.js";
import { app } from "../App";

export class AceOfShadows {
  private deck1: PIXI.Sprite[] = [];
  private deck2: PIXI.Sprite[] = [];
  private container: PIXI.Container;
  private cardTexture: PIXI.Texture;
  private moveIntervalId?: number;

  // Card layout constants
  private readonly CARD_OFFSET = 2; // pixels vertical offset per card
  private readonly MOVE_DURATION = 2000; // ms animation duration
  private readonly MOVE_INTERVAL = 1000; // ms between moves

  private readonly CARD_WIDTH = 100;
  private readonly CARD_HEIGHT = 130;

  private readonly CARD_AMOUNT = 144;

  private readonly CARD_POSITION_X = 300;
  private readonly CARD_POSITION_Y = 170;

  constructor() {
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);

    this.cardTexture = PIXI.Texture.from("assets/img/CardBackground.png");

    this.createDecks();
    this.startMovingCards();
  }

  private createDecks() {
    // Create deck1 with CARD_AMOUNT cards stacked
    for (let i = 0; i < this.CARD_AMOUNT; i++) {
      const card = new PIXI.Sprite(this.cardTexture);
      card.anchor.set(0.5, 0);
      card.width = this.CARD_WIDTH;
      card.height = this.CARD_HEIGHT;
      card.x = this.CARD_POSITION_X;
      card.y = this.CARD_POSITION_Y + i * this.CARD_OFFSET;
      this.deck1.push(card);
      this.container.addChild(card);
    }

    // Deck2 starts empty
  }

  private startMovingCards() {
    this.moveIntervalId = window.setInterval(() => {
      this.moveTopCard();
    }, this.MOVE_INTERVAL);
  }

  private moveTopCard() {
    if (this.deck1.length === 0) {
      // Stop if deck1 empty
      if (this.moveIntervalId) {
        clearInterval(this.moveIntervalId);
        this.moveIntervalId = undefined;
      }
      return;
    }

    // Take top card from deck1 (last pushed card)
    const card = this.deck1.pop()!;
    // Remove from container (to change z-order)
    this.container.removeChild(card);

    // Target position for deck2
    const targetX = this.CARD_POSITION_X * 2;
    const targetY = this.CARD_POSITION_Y + this.deck2.length * this.CARD_OFFSET;

    // Add card to container so it renders on top
    this.container.addChild(card);

    // Animate move over MOVE_DURATION ms
    const startX = card.x;
    const startY = card.y;
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    let elapsed = 0;

    // Simple PIXI ticker based animation
    const onTick = (delta: number) => {
      elapsed += delta * (1000 / 60); // approx ms per frame
      const progress = Math.min(elapsed / this.MOVE_DURATION, 1);

      // Linear interpolation
      card.x = startX + deltaX * progress;
      card.y = startY + deltaY * progress;

      if (progress >= 1) {
        // Animation complete
        app.ticker.remove(onTick);

        // Add to deck2 array
        this.deck2.push(card);
      }
    };

    app.ticker.add(onTick);
  }
}
