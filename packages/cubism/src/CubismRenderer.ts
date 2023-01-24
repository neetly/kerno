import type { CubismModel } from "./CubismModel";
import { CubismRendererMeshProgram } from "./CubismRendererMeshProgram";
import { CubismRendererTexture } from "./CubismRendererTexture";

class CubismRenderer {
  private readonly textures: readonly CubismRendererTexture[];
  private readonly meshProgram: CubismRendererMeshProgram;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly model: CubismModel,
  ) {
    this.textures = this.model.textures.map((texture) => {
      return new CubismRendererTexture(this.gl, texture.imageBitmap);
    });
    this.meshProgram = new CubismRendererMeshProgram(this.gl);
  }

  destroy() {
    this.textures.map((texture) => {
      texture.destroy();
    });
    this.meshProgram.destroy();
  }
}

export { CubismRenderer };
