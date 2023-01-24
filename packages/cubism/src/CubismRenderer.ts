import type { CubismMesh } from "./CubismMesh";
import type { CubismModel } from "./CubismModel";
import { CubismRendererMeshProgram } from "./CubismRendererMeshProgram";
import { CubismRendererTexture } from "./CubismRendererTexture";

class CubismRenderer {
  private readonly textures: readonly CubismRendererTexture[];
  private readonly meshProgram: CubismRendererMeshProgram;

  private readonly meshIndices: Int32Array;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly model: CubismModel,
  ) {
    this.textures = this.model.textures.map((texture) => {
      return new CubismRendererTexture(this.gl, texture.imageBitmap);
    });
    this.meshProgram = new CubismRendererMeshProgram(this.gl);

    this.meshIndices = new Int32Array(this.model.meshes.length);
  }

  render() {
    for (const [index, mesh] of this.model.meshes.entries()) {
      this.meshIndices[mesh.renderOrder] = index;
    }

    for (const index of this.meshIndices) {
      const mesh = this.model.meshes[index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      this.renderMesh(mesh);
    }
  }

  renderMesh(mesh: CubismMesh) {
    if (!mesh.isVisible) {
      return;
    }

    this.gl.useProgram(this.meshProgram.id);
  }

  destroy() {
    this.textures.map((texture) => {
      texture.destroy();
    });
    this.meshProgram.destroy();
  }
}

export { CubismRenderer };
