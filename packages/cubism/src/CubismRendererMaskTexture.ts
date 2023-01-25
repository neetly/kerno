const WIDTH = 256;
const HEIGHT = 256;

class CubismRendererMaskTexture {
  readonly id: WebGLTexture;
  private readonly framebuffer: WebGLFramebuffer;

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.id = this.gl.createTexture()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      WIDTH,
      HEIGHT,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR,
    );

    this.framebuffer = this.gl.createFramebuffer()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      this.id,
      0,
    );
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  destroy() {
    this.gl.deleteTexture(this.id);
    this.gl.deleteFramebuffer(this.framebuffer);
  }
}

export { CubismRendererMaskTexture };
