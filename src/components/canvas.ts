/* eslint-disable prettier/prettier */
export class Canvas {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement, width = 0, height = 0) {
    this.cvs = canvas;
    this.ctx = this.cvs.getContext("2d") as CanvasRenderingContext2D;
    this.cvs.width = width;
    this.cvs.height = height;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }
}
// 设置画布大小
export function setCanvasSize(cvs: HTMLCanvasElement, size: number[]) {
  cvs.width = size[0];
  cvs.height = size[1];
}

// 清空画布
export function clearCanvas(cvs: HTMLCanvasElement) {
  const w = cvs.width;
  const h = cvs.height;
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, w, h);
}
