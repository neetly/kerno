class CubismRendererTexture {
  readonly id: WebGLTexture;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    imageBitmap: ImageBitmap,
  ) {
    this.id = this.gl.createTexture()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      imageBitmap,
    );
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR_MIPMAP_LINEAR,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR,
    );
  }

  destroy() {
    this.gl.deleteTexture(this.id);
  }
}

export { CubismRendererTexture };
