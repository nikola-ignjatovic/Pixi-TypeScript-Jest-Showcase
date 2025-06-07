import { app, clearStage } from "./App";
import * as PIXI from "pixi.js";
import { runAceOfShadows } from "./examples/AceOfShadows";

type Example = {
  name: string;
  run: () => void;
};

export class Menu {
  private container: PIXI.Container;
  private examples: Example[];

  constructor() {
    this.container = new PIXI.Container();
    this.examples = [];
  }

  public show() {
    clearStage();

    app.stage.addChild(this.container);

    const titleStyle = new PIXI.TextStyle({
      fill: "white",
      fontSize: 36,
      fontWeight: "bold",
    });

    const title = new PIXI.Text("Select an Example", titleStyle);
    title.anchor.set(0.5);
    title.x = app.renderer.width / 2;
    title.y = 100;
    this.container.addChild(title);

    const buttonStyle = new PIXI.TextStyle({
      fill: "#00ccff",
      fontSize: 28,
      fontWeight: "bold",
    });

    this.examples.forEach((example, i) => {
      const btn = new PIXI.Text(example.name, buttonStyle);

      btn.interactive = true;
      (btn as any).buttonMode = true;
      btn.anchor.set(0.5);
      btn.x = app.renderer.width / 2;
      btn.y = 200 + i * 60;

      btn.on("pointerdown", () => {
        clearStage();
        example.run();
      });

      this.container.addChild(btn);
    });
  }
}
