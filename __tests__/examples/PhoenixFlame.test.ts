/**
 * @jest-environment jsdom
 */

// Mock the PIXI Application (app) and related properties
jest.mock("../../src/App", () => {
  return {
    app: {
      stage: {
        addChild: jest.fn(),
        removeChild: jest.fn(),
      },
      ticker: {
        add: jest.fn(),
        remove: jest.fn(),
      },
      renderer: {
        resize: jest.fn(),
      },
      view: {},
    },
  };
});

import { app } from "../../src/App";
import PhoenixFlame from "../../src/examples/PhoenixFlame";

describe("PhoenixFlame", () => {
  let phoenixFlame: PhoenixFlame;

  beforeEach(() => {
    jest.clearAllMocks();
    phoenixFlame = new PhoenixFlame();
  });

  afterEach(() => {
    phoenixFlame.destroy();
  });

  test("adds container to app.stage on creation", () => {
    expect(app.stage.addChild).toHaveBeenCalled();
  });

  test("creates maxParticles sprites and adds them to container", () => {
    // Expect container to have maxParticles children
    expect((phoenixFlame as any).particles.length).toBe(10);
  });

  test("particles have alpha initialized to 1", () => {
    const particles = (phoenixFlame as any).particles;
    for (const p of particles) {
      expect(p.sprite.alpha).toBe(1);
    }
  });

  test("update moves particles and reduces alpha", () => {
    const update = (phoenixFlame as any).update.bind(phoenixFlame);
    const particles = (phoenixFlame as any).particles;

    const firstParticle = particles[0];
    const initialY = firstParticle.sprite.y;
    const initialAlpha = firstParticle.sprite.alpha;

    update();

    // y should have decreased by velocityY
    expect(firstParticle.sprite.y).toBeCloseTo(
      initialY - firstParticle.velocityY
    );
    // alpha should have decreased by alphaDecay
    expect(firstParticle.sprite.alpha).toBeCloseTo(
      initialAlpha - firstParticle.alphaDecay
    );
  });
});
