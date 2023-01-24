import { createGLTexture } from "./utils/createGLTexture";

class CubismRendererTexture {
  readonly id: WebGLTexture;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    imageBitmap: ImageBitmap,
  ) {
    this.id = createGLTexture(gl, imageBitmap);
  }

  destroy() {
    this.gl.deleteTexture(this.id);
  }
}

export { CubismRendererTexture };
