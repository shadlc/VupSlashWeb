/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { clearCanvas } from "./canvas";

// 立绘
class Portrait {
  img: HTMLImageElement;
  isLoad = false;

  constructor() {
    this.img = new Image();
    this.img.setAttribute("crossOrigin", "anonymous");
  }

  import(url: string, card: Card | null = null) {
    this.isLoad = false;
    this.img.src = url;
    this.img.onload = () => {
      this.isLoad = true;
      if (card) {
        card.portraitW = this.img.width;
        card.portraitH = this.img.height;
      }
    };
  }
}

// 遮罩阴影
class Shadow {
  img: HTMLImageElement;
  isLoad = false;

  constructor() {
    this.img = new Image();
    this.img.setAttribute("crossOrigin", "anonymous");
  }

  import(url: string, card: Card | null = null) {
    this.img.src = url;
    this.img.onload = () => {
      this.isLoad = true;
      if (card) {
        card.shadowDistance = 50;
      }
    };
  }
}

// 势力图标
class Logo {
  img: HTMLImageElement;
  isLoad = false;

  constructor() {
    this.img = new Image();
    this.img.setAttribute("crossOrigin", "anonymous");
  }

  import(url: string, card: Card | null = null) {
    this.isLoad = false;
    this.img.src = url;
    this.img.onload = () => {
      this.isLoad = true;
      if (card) {
        card.logoX = 30;
        card.logoY = 30;
        card.logoW = card.logo.img.width;
        card.logoH = card.logo.img.height;
      }
    };
  }
}

// 卡牌
export class Card {
  portrait: Portrait = new Portrait();
  portraitX = 0;
  portraitY = 0;
  portraitW = 0;
  portraitH = 0;

  shadow: Shadow = new Shadow();
  shadowType = "default";
  isShine = false;
  isOverflow = true;
  shadowDistance = 0;

  logo: Logo = new Logo();
  logoX = 30;
  logoY = 30;
  logoW = 100;
  logoH = 100;

  code = "undefined";
  name = "未知名称";
  nameEng = "undefined";
  label = "未知称号";
  party = "undefined";

  themeColor = "#999999";
  shineColor = "#000000";
  nameColor = "#000000";
  labelColor = "#dddddd";
  borderColor = "#333333";

  // 导入立绘
  importPortrait(url: string, card: Card | null = null) {
    this.portrait.import(url, card);
  }
  // 导入阴影
  importShadow(url: string) {
    this.shadow.import(url);
  }
  // 导入势力图标
  importLogo(url: string, card: Card | null = null) {
    this.logo.import(url, card);
  }
  // 生成卡牌
  draw(cvs: HTMLCanvasElement) {
    // 绘制背景
    drawBackground(cvs, this);
    // 绘制立绘
    drawPortrait(cvs, this);
    // 绘制上层
    drawCover(cvs, this);
    // 绘制称号
    drawLabel(cvs, this);
    // 绘制名称
    drawName(cvs, this);
    // 绘制势力符号
    drawPartyLogo(cvs, this);
    // 绘制圆角
    drawRadius(cvs, 60);
  }
}

export function setParty(card: Card, parties: any) {
  parties.forEach((p: any) => {
    if (p.code == card.party) {
      card.importLogo(
        "assets/img/logo/" + card.party + ".png",
        card
      );
      card.themeColor = p.themeColor ?? card.themeColor;
      card.nameColor = p.nameColor ?? card.nameColor;
      card.labelColor = p.labelColor ?? card.labelColor;
      card.borderColor = p.borderColor ?? card.borderColor;
    }
  });
}

export function setShadow(card: Card) {
  card.importShadow(
    "assets/img/shadow/" + card.shadowType + ".png"
  );
}

// 获取势力名称
export function getPartyName(code: string, parties: any): string {
  let name = "未知势力";
  parties.forEach((p: any) => {
    if (p.code == code) {
      name = p.name;
    }
  });
  return name;
}

// 获取势力代码
export function getPartyCode(name: string, parties: any): string {
  let code = "undefined";
  parties.forEach((p: any) => {
    if (p.name == name) {
      code = p.code;
    }
  });
  return code;
}

function drawBackground(cvs: HTMLCanvasElement, card: Card) {
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  for (let i = 5; i < cvs.width; i += 30) {
    for (let j = 5; j < cvs.height; j += 30) {
      draw_cross(ctx, i, j, card.themeColor);
    }
  }

  if (card.isOverflow) {
    ctx.beginPath();
    ctx.fillStyle = card.themeColor;
    ctx.moveTo(0, 0);
    ctx.lineTo(cvs.width, 0);
    ctx.lineTo(cvs.width, cvs.height / 10);
    ctx.lineTo(0, cvs.height / 5);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
  }
}

function draw_cross(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(x + 10, y + 5);
  ctx.lineTo(x + 10, y + 15);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(x + 5, y + 10);
  ctx.lineTo(x + 15, y + 10);
  ctx.closePath();
  ctx.stroke();
}

function drawPartyLogo(cvs: HTMLCanvasElement, card: Card) {
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  if (card.logo.isLoad) {
    ctx.drawImage(
      card.logo.img,
      card.logoX,
      card.logoY,
      card.logoW,
      card.logoH
    );
  }
}

function drawPortrait(cvs: HTMLCanvasElement, card: Card) {
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  if (card.portrait.isLoad && card.shadow.isLoad) {
    const temp_cvs = document.createElement("canvas");
    temp_cvs.width = cvs.width;
    temp_cvs.height = cvs.height;
    const temp_ctx = temp_cvs.getContext("2d") as CanvasRenderingContext2D;

    if (card.shadowDistance != 0) {
      temp_ctx.save();
      if (card.isShine) {
        temp_ctx.shadowColor = card.shineColor;
        temp_ctx.shadowBlur = 40;
      }
      temp_ctx.drawImage(
        card.portrait.img,
        card.portraitX + card.portraitW * 0.05 + card.shadowDistance * 1.2,
        card.portraitY + card.portraitH * 0.05 - card.shadowDistance * 1,
        card.portraitW * 0.9,
        card.portraitH * 0.9
      );
      temp_ctx.globalCompositeOperation = "source-in";
      temp_ctx.drawImage(card.shadow.img, 0, 0);
      temp_ctx.restore();
    }
    if (card.isShine) {
      temp_ctx.shadowColor = card.shineColor;
      temp_ctx.shadowBlur = 40;
    }
    temp_ctx.drawImage(
      card.portrait.img,
      card.portraitX,
      card.portraitY,
      card.portraitW,
      card.portraitH
    );
    ctx.drawImage(temp_cvs, 0, 0);
  }
}

function drawCover(cvs: HTMLCanvasElement, card: Card) {
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  const temp_cvs = document.createElement("canvas");
  const temp_ctx = temp_cvs.getContext("2d") as CanvasRenderingContext2D;
  temp_cvs.width = cvs.width;
  temp_cvs.height = cvs.height;

  if (!card.isOverflow) {
    temp_ctx.beginPath();
    temp_ctx.fillStyle = card.themeColor;
    temp_ctx.moveTo(0, 0);
    temp_ctx.lineTo(cvs.width, 0);
    temp_ctx.lineTo(cvs.width, cvs.height / 10);
    temp_ctx.lineTo(0, cvs.height / 5);
    temp_ctx.lineTo(0, 0);
    temp_ctx.closePath();
    temp_ctx.fill();
  }

  temp_ctx.beginPath();
  temp_ctx.fillStyle = card.themeColor;
  temp_ctx.moveTo(0, cvs.height);
  temp_ctx.lineTo(cvs.width, cvs.height);
  temp_ctx.lineTo(cvs.width, (cvs.height / 100) * 78);
  temp_ctx.lineTo(0, (cvs.height / 100) * 86);
  temp_ctx.lineTo(0, cvs.height);
  temp_ctx.closePath();
  temp_ctx.fill();
  temp_ctx.translate(0, (cvs.height / 100) * 96);
  temp_ctx.font = "46px zhengkuchaojihei";
  temp_ctx.fillStyle = card.nameColor + "11";
  temp_ctx.fillText(repeat(card.name, 100), 0, 0);
  temp_ctx.fillRect(0, cvs.height * 0.01, cvs.width, cvs.height);
  temp_ctx.font = "32px zhengkuchaojihei";
  temp_ctx.fillStyle = card.themeColor;
  temp_ctx.fillText(repeat(card.nameEng, 100), 0, cvs.height * 0.035);
  ctx.drawImage(temp_cvs, 0, 0);
}

function drawLabel(cvs: HTMLCanvasElement, card: Card) {
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  const temp_cvs = document.createElement("canvas");
  const temp_ctx = temp_cvs.getContext("2d") as CanvasRenderingContext2D;
  temp_cvs.width = cvs.width;
  temp_cvs.height = cvs.height;

  let fontSize = 60;
  let temp = computeText(
    card.label,
    "zhengkuchaojihei",
    fontSize,
    card.labelColor,
    card.borderColor
  );
  let text_cvs = temp[0];
  let fontBoxWidth = Math.max(160, temp[1]);
  while (fontBoxWidth > (cvs.width * 2) / 3) {
    fontSize -= 1;
    temp = computeText(
      card.label,
      "zhengkuchaojihei",
      fontSize,
      card.labelColor,
      card.borderColor
    );
    text_cvs = temp[0];
    fontBoxWidth = Math.max(160, temp[1]);
  }

  temp_ctx.transform(1, -0.12, 0, 1, 0, cvs.height * 0.865 - fontSize * 1.43);

  temp_ctx.fillStyle = hexToRgba(card.themeColor + "aa");
  temp_ctx.beginPath();
  temp_ctx.moveTo(cvs.width, 0);
  temp_ctx.lineTo(cvs.width, fontSize * 1.4);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 32, fontSize * 1.4);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 32, 0);
  temp_ctx.closePath();
  temp_ctx.fill();
  temp_ctx.beginPath();
  temp_ctx.moveTo(cvs.width - fontBoxWidth - 46, 0);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 44, fontSize * 1.4);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 56, fontSize * 1.4);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 54, 0);
  temp_ctx.closePath();
  temp_ctx.fill();
  temp_ctx.beginPath();
  temp_ctx.moveTo(cvs.width - fontBoxWidth - 66, 0);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 64, fontSize * 1.4);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 76, fontSize * 1.4);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 74, 0);
  temp_ctx.closePath();
  temp_ctx.fill();
  temp_ctx.beginPath();
  temp_ctx.moveTo(cvs.width - fontBoxWidth - 86, 0);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 84, fontSize * 1.4);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 156, fontSize * 1.4);
  temp_ctx.lineTo(cvs.width - fontBoxWidth - 150, 0);
  temp_ctx.closePath();
  temp_ctx.fill();

  temp_ctx.drawImage(text_cvs, cvs.width - fontBoxWidth - 16, 0);

  ctx.drawImage(temp_cvs, 0, 0);
}

function drawName(cvs: HTMLCanvasElement, card: Card) {
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  const temp_cvs = document.createElement("canvas");
  const temp_ctx = temp_cvs.getContext("2d") as CanvasRenderingContext2D;
  temp_cvs.width = cvs.width;
  temp_cvs.height = cvs.height;

  temp_ctx.transform(1, -0.12, 0, 1, 0, cvs.height * 0.84);

  let fontSize = 80;
  let temp = computeText(
    card.name,
    "zhengkuchaojihei",
    fontSize,
    card.nameColor,
    "#FFFFFF"
  );
  let text_cvs = temp[0];
  let fontBoxWidth = Math.max(160, temp[1]);
  while (fontBoxWidth > (cvs.width * 2) / 3) {
    fontSize -= 1;
    temp = computeText(
      card.name,
      "zhengkuchaojihei",
      fontSize,
      card.nameColor,
      "#FFFFFF"
    );
    text_cvs = temp[0];
    fontBoxWidth = Math.max(160, temp[1]);
  }
  temp_ctx.drawImage(text_cvs, cvs.width - fontBoxWidth - 16, fontSize * 0.1);

  let fontSizeEng = 40;
  temp = computeText(
    card.nameEng,
    "zhengkuchaojihei",
    fontSizeEng,
    card.nameColor,
    "#FFFFFF"
  );
  text_cvs = temp[0];
  let fontBoxWidthEng = Math.max(160, temp[1]);
  while (fontBoxWidthEng > (cvs.width * 2) / 3) {
    fontSizeEng -= 1;
    temp = computeText(
      card.nameEng,
      "zhengkuchaojihei",
      fontSizeEng,
      card.nameColor,
      "#FFFFFF"
    );
    text_cvs = temp[0];
    fontBoxWidthEng = Math.max(160, temp[1]);
  }
  temp_ctx.drawImage(
    text_cvs,
    cvs.width - fontBoxWidthEng - 16,
    fontSize * 1.2
  );

  ctx.drawImage(temp_cvs, 0, 0);
}

function drawRadius(cvs: HTMLCanvasElement, radius: number) {
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  const temp_cvs = document.createElement("canvas");
  const temp_ctx = temp_cvs.getContext("2d") as CanvasRenderingContext2D;
  temp_cvs.width = cvs.width;
  temp_cvs.height = cvs.height;

  temp_ctx.drawImage(cvs, 0, 0);
  temp_ctx.globalCompositeOperation = "destination-in";
  temp_ctx.fillStyle = "white";
  temp_ctx.beginPath();
  temp_ctx.moveTo(radius, 0);
  temp_ctx.arcTo(cvs.width, 0, cvs.width, cvs.height, radius);
  temp_ctx.arcTo(cvs.width, cvs.height, 0, cvs.height, radius);
  temp_ctx.arcTo(0, cvs.height, 0, 0, radius);
  temp_ctx.arcTo(0, 0, cvs.width, 0, radius);
  temp_ctx.closePath();
  temp_ctx.fill();
  clearCanvas(cvs);
  ctx.drawImage(temp_cvs, 0, 0);
}

function computeText(
  text: string,
  font: string,
  fontSize: number,
  fontColor: string,
  borderColor: string
): [HTMLCanvasElement, number] {
  const temp_cvs = document.createElement("canvas");
  const temp_ctx = temp_cvs.getContext("2d") as CanvasRenderingContext2D;
  if (text.length) temp_cvs.width = fontSize * text.length;
  else temp_cvs.width = fontSize;
  temp_cvs.height = fontSize * 1.3;
  if (text.indexOf("^") != -1) {
    temp_cvs.height *= 1.05;
  }

  temp_ctx.textAlign = "left";
  temp_ctx.textBaseline = "bottom";
  temp_ctx.lineWidth = fontSize / 10;
  if (borderColor) temp_ctx.strokeStyle = borderColor;
  if (fontColor) temp_ctx.fillStyle = fontColor;
  font = "px " + font;
  temp_ctx.font = fontSize + font;
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] != "^" && text[i] != "_") {
      if (borderColor)
        temp_ctx.strokeText(text[i], width, temp_cvs.height * 0.92);
      if (fontColor) temp_ctx.fillText(text[i], width, temp_cvs.height * 0.92);
      width += temp_ctx.measureText(text[i]).width;
      temp_ctx.font = fontSize + font;
    } else if (text[i] == "^") {
      temp_ctx.font = fontSize * 1.2 + font;
    } else if (text[i] == "_") {
      temp_ctx.font = fontSize * 0.8 + font;
    }
  }
  return [temp_cvs, width];
}
function repeat(str: string, num: number): string {
  return num > 1 ? (str += repeat(str, --num)) : str;
}

// 16进制颜色转化为RGBA方法
function hexToRgba(hex: string) {
  const rgba =
    "rgba(" +
    parseInt("0x" + hex.slice(1, 3)) +
    "," +
    parseInt("0x" + hex.slice(3, 5)) +
    "," +
    parseInt("0x" + hex.slice(5, 7)) +
    "," +
    parseInt("0x" + hex.slice(7, 9)) / 255 +
    ")";
  return rgba;
}
