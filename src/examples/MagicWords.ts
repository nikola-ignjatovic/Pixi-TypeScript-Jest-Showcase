import * as PIXI from "pixi.js";
import { app } from "../App";

interface EmojiData {
  name: string;
  url: string;
  texture?: PIXI.Texture;
}

interface AvatarData {
  name: string;
  url: string;
  position: "left" | "right";
  texture?: PIXI.Texture;
}

interface DialogueLine {
  name: string;
  text: string;
}

interface MagicWordsData {
  dialogue: DialogueLine[];
  emojies: EmojiData[];
  avatars: AvatarData[];
}

// Type to differentiate parts of parsed text
type ParsedPart =
  | { type: "text"; text: string }
  | { type: "emoji"; name: string };

export class MagicWords {
  private container: PIXI.Container;
  private data: MagicWordsData | null = null;

  private emojiMap = new Map<string, EmojiData>();
  private avatarMap = new Map<string, AvatarData>();

  private readonly TEXT_FONT_SIZE = 10;
  private readonly DIALOGUE_START_Y = 165;
  private readonly LINE_SPACING = 20;
  private readonly AVATAR_SIZE = 15;
  private readonly EMOJI_SIZE = 10;
  private readonly MARGIN = 10;

  constructor() {
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);

    this.loadDataAndRender(
      "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords"
    );
  }

  async loadDataAndRender(url: string) {
    const res = await fetch(url);
    this.data = await res.json();

    // Prepare maps and load textures
    await this.preloadTextures();

    this.renderDialogue();
  }

  private async preloadTextures() {
    if (!this.data) return;

    // Load emoji textures
    await Promise.all(
      this.data.emojies.map(async (emoji) => {
        const texture = await PIXI.Texture.fromURL(emoji.url);
        emoji.texture = texture;
        this.emojiMap.set(emoji.name, emoji);
      })
    );

    // Load avatar textures
    await Promise.all(
      this.data.avatars.map(async (avatar) => {
        const texture = await PIXI.Texture.fromURL(avatar.url);
        avatar.texture = texture;
        this.avatarMap.set(avatar.name, avatar);
      })
    );
  }

  private renderDialogue() {
    if (!this.data) return;

    this.container.removeChildren();

    this.data.dialogue.forEach((line, idx) => {
      const y = this.DIALOGUE_START_Y + idx * this.LINE_SPACING;
      this.renderLine(line, y);
    });
  }

  private renderLine(line: DialogueLine, y: number) {
    const avatar = this.avatarMap.get(line.name);
    if (!avatar) {
      console.warn(`No avatar found for ${line.name}`);
      return;
    }

    // Avatar sprite
    const avatarSprite = new PIXI.Sprite(avatar.texture!);
    avatarSprite.width = this.AVATAR_SIZE;
    avatarSprite.height = this.AVATAR_SIZE;
    avatarSprite.y = y;

    avatarSprite.x = this.MARGIN;

    this.container.addChild(avatarSprite);

    // Text container for text+emojis
    const textContainer = new PIXI.Container();

    textContainer.x = avatarSprite.x + this.AVATAR_SIZE + this.MARGIN;
    textContainer.y = y;

    this.container.addChild(textContainer);

    // Parse text to handle {emojiName} tokens
    const parsedParts = this.parseTextWithEmojis(line.text);

    let cursorX = 0;
    const baseTextStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: this.TEXT_FONT_SIZE,
      fill: 0xffffff,
    });

    parsedParts.forEach((part) => {
      if (part.type === "text") {
        const text = new PIXI.Text(part.text, baseTextStyle);
        text.x = cursorX;
        text.y = 0;
        textContainer.addChild(text);
        cursorX += text.width;
      } else if (part.type === "emoji") {
        const emojiData = this.emojiMap.get(part.name);
        if (emojiData && emojiData.texture) {
          const emojiSprite = new PIXI.Sprite(emojiData.texture);
          emojiSprite.width = this.EMOJI_SIZE;
          emojiSprite.height = this.EMOJI_SIZE;
          emojiSprite.x = cursorX;
          emojiSprite.y = 2; // baseline alignment
          textContainer.addChild(emojiSprite);
          cursorX += this.EMOJI_SIZE + 4;
        } else {
          // If emoji not found, fallback to rendering the raw text with braces
          const fallbackText = new PIXI.Text(`{${part.name}}`, baseTextStyle);
          fallbackText.x = cursorX;
          fallbackText.y = 0;
          textContainer.addChild(fallbackText);
          cursorX += fallbackText.width;
        }
      }
    });
  }

  private parseTextWithEmojis(text: string): ParsedPart[] {
    const regex = /\{(\w+)\}/g;
    const parts: ParsedPart[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          text: text.substring(lastIndex, match.index),
        });
      }
      parts.push({ type: "emoji", name: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", text: text.substring(lastIndex) });
    }

    return parts;
  }
}
