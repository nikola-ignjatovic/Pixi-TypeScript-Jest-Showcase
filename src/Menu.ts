import { app, clearStageExcept } from "./App";
import * as PIXI from "pixi.js";
import { AceOfShadows } from "./examples/AceOfShadows";
import PhoenixFlame from "./examples/PhoenixFlame";
import { MagicWords } from "./examples/MagicWords";

type Example = {
  name: string;
  run: () => void;
};

export class Menu {
  private container: PIXI.Container;
  private examples: Example[];

  private readonly TITLE_POSITION_X = 400;
  private readonly TITLE_POSITION_Y = 50;

  private readonly MENU_BUTTON_POSITION_X = 400;
  private readonly MENU_BUTTON_POSITION_Y = 75;
  private readonly MENU_GAP_BETWEEN_BUTTONS_Y = 25;

  private readonly TITLE_FONT_SIZE = 26;
  private readonly BUTTON_FONT_SIZE = 20;

  constructor() {
    this.container = new PIXI.Container();
    this.examples = [
      { name: "Ace of Shadows", run: () => new AceOfShadows() },
      { name: "Phoenix Flame", run: () => new PhoenixFlame() },
      { name: "Magic Words", run: () => new MagicWords() },
    ];
  }

  public show() {
    clearStageExcept(this.container); // keep menu container, remove others
    if (!app.stage.children.includes(this.container)) {
      app.stage.addChild(this.container);
    }

    app.stage.addChild(this.container);

    const titleStyle = new PIXI.TextStyle({
      fill: "white",
      fontSize: this.TITLE_FONT_SIZE,
      fontWeight: "bold",
    });

    const title = new PIXI.Text("Select an Example", titleStyle);
    title.anchor.set(0.5);
    title.x = this.TITLE_POSITION_X;
    title.y = this.TITLE_POSITION_Y;
    this.container.addChild(title);

    const buttonStyle = new PIXI.TextStyle({
      fill: "#00ccff",
      fontSize: this.BUTTON_FONT_SIZE,
      fontWeight: "bold",
    });

    this.examples.forEach((example, i) => {
      const btn = new PIXI.Text(example.name, buttonStyle);

      btn.interactive = true;
      (btn as any).buttonMode = true;
      btn.anchor.set(0.5);
      btn.x = this.MENU_BUTTON_POSITION_X;
      btn.y = this.MENU_BUTTON_POSITION_Y + i * this.MENU_GAP_BETWEEN_BUTTONS_Y;

      btn.on("pointerdown", () => {
        clearStageExcept(this.container); // keep menu container, remove others
        if (!app.stage.children.includes(this.container)) {
          app.stage.addChild(this.container);
        }
        example.run();
      });

      this.container.addChild(btn);
    });
  }
}
