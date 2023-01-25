import { Matrix4 } from "three";

import { CubismBlendMode } from "./CubismBlendMode";
import type { CubismMesh } from "./CubismMesh";
import type { CubismModel } from "./CubismModel";
import { CubismRendererMeshProgram } from "./CubismRendererMeshProgram";
import { CubismRendererTexture } from "./CubismRendererTexture";

class CubismRenderer {
  private readonly meshProgram: CubismRendererMeshProgram;
  private readonly indexBuffer: WebGLBuffer;
  private readonly positionBuffer: WebGLBuffer;
  private readonly textureCoordBuffer: WebGLBuffer;
  private readonly textures: readonly CubismRendererTexture[];

  private readonly matrix = new Matrix4();
  private readonly meshIndices: Int32Array;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly model: CubismModel,
  ) {
    this.meshProgram = new CubismRendererMeshProgram(this.gl);
    this.indexBuffer = this.gl.createBuffer()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.positionBuffer = this.gl.createBuffer()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.textureCoordBuffer = this.gl.createBuffer()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.textures = this.model.textures.map((texture) => {
      return new CubismRendererTexture(this.gl, texture.imageBitmap);
    });

    this.meshIndices = new Int32Array(this.model.meshes.length);
  }

  render() {
    for (const [index, mesh] of this.model.meshes.entries()) {
      this.meshIndices[mesh.renderOrder] = index;
    }

    for (const index of this.meshIndices) {
      const mesh = this.model.meshes[index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      this.renderMesh(mesh, this.matrix);
    }
  }

  private renderMesh(mesh: CubismMesh, matrix: Matrix4, isMask = false) {
    if (!isMask && !mesh.isVisible) {
      return;
    }

    this.gl.useProgram(this.meshProgram.id);
    this.gl.uniformMatrix4fv(this.meshProgram.uMatrix, false, matrix.elements);
    this.gl.uniform1f(this.meshProgram.uOpacity, isMask ? 1 : mesh.opacity);
    this.setIsCulling(mesh.isCulling);
    this.setBlendMode(isMask ? CubismBlendMode.Normal : mesh.blendMode);
    this.setTexture(
      this.meshProgram.uTexture,
      0,
      this.textures[mesh.textureIndex]!.id, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );

    this.drawMesh(
      mesh,
      this.meshProgram.aPosition,
      this.meshProgram.aTextureCoord,
    );
  }

  private drawMesh(mesh: CubismMesh, aPosition: number, aTextureCoord: number) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      mesh.vertexIndices,
      this.gl.DYNAMIC_DRAW,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      mesh.vertexPositions,
      this.gl.DYNAMIC_DRAW,
    );
    this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      mesh.textureCoords,
      this.gl.DYNAMIC_DRAW,
    );
    this.gl.vertexAttribPointer(aTextureCoord, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.drawElements(
      this.gl.TRIANGLES,
      mesh.vertexIndices.length,
      this.gl.UNSIGNED_SHORT,
      0,
    );
  }

  private setIsCulling(isCulling: boolean) {
    if (isCulling) {
      this.gl.enable(this.gl.CULL_FACE);
    } else {
      this.gl.disable(this.gl.CULL_FACE);
    }
  }

  private setBlendMode(blendMode: CubismBlendMode) {
    switch (blendMode) {
      case CubismBlendMode.Normal:
        this.gl.blendFuncSeparate(
          this.gl.ONE,
          this.gl.ONE_MINUS_SRC_ALPHA,
          this.gl.ONE,
          this.gl.ONE_MINUS_SRC_ALPHA,
        );
        break;
      case CubismBlendMode.Additive:
        this.gl.blendFuncSeparate(
          this.gl.ONE,
          this.gl.ONE,
          this.gl.ZERO,
          this.gl.ONE,
        );
        break;
      case CubismBlendMode.Multiplicative:
        this.gl.blendFuncSeparate(
          this.gl.DST_COLOR,
          this.gl.ONE_MINUS_SRC_ALPHA,
          this.gl.ZERO,
          this.gl.ONE,
        );
        break;
    }
  }

  private setTexture(
    location: WebGLUniformLocation,
    index: number,
    texture: WebGLTexture,
  ) {
    this.gl.activeTexture(this.gl.TEXTURE0 + index);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.uniform1i(location, index);
  }

  destroy() {
    this.meshProgram.destroy();
    this.gl.deleteBuffer(this.indexBuffer);
    this.gl.deleteBuffer(this.positionBuffer);
    this.gl.deleteBuffer(this.textureCoordBuffer);
    this.textures.map((texture) => {
      texture.destroy();
    });
  }
}

export { CubismRenderer };
