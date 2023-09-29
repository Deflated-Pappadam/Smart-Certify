export function captureCanvasImage(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise((resolve) => {
      const image = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
      resolve(image);
    });
  }

  