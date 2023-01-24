class CubismModelTexture {
  static async from(arrayBuffer: ArrayBuffer) {
    const blob = new Blob([arrayBuffer]);
    const imageBitmap = await createImageBitmap(blob, {
      imageOrientation: "flipY",
      premultiplyAlpha: "premultiply",
    });
    return new CubismModelTexture(imageBitmap);
  }

  private constructor(readonly imageBitmap: ImageBitmap) {}

  destroy() {
    this.imageBitmap.close();
  }
}

export { CubismModelTexture };
