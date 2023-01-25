import { type Box2, Matrix4 } from "three";

import { CubismBlendMode } from "./CubismBlendMode";
import type { CubismMesh } from "./CubismMesh";
import type { CubismModel } from "./CubismModel";
import { CubismRendererMaskTexture } from "./CubismRendererMaskTexture";
import { CubismRendererMeshProgram } from "./CubismRendererMeshProgram";
import { CubismRendererMeshWithMaskProgram } from "./CubismRendererMeshWithMaskProgram";
import type { CubismRendererProgram } from "./CubismRendererProgram";
import { CubismRendererState } from "./CubismRendererState";
import { CubismRendererTexture } from "./CubismRendererTexture";

const maskMatrix = new Matrix4();

class CubismRenderer {
  private readonly state: CubismRendererState;

  private readonly meshProgram: CubismRendererMeshProgram;
  private readonly meshWithMaskProgram: CubismRendererMeshWithMaskProgram;
  private readonly indexBuffer: WebGLBuffer;
  private readonly positionBuffer: WebGLBuffer;
  private readonly textureCoordBuffer: WebGLBuffer;
  private readonly textures: readonly CubismRendererTexture[];
  private readonly maskTextures: ReadonlyMap<
    CubismMesh,
    CubismRendererMaskTexture
  >;

  private readonly matrix = new Matrix4();
  private readonly meshIndices: Int32Array;

  constructor(
    private readonly model: CubismModel,
    private readonly gl: WebGL2RenderingContext,
  ) {
    this.state = CubismRendererState.of(this.gl);

    this.meshProgram = new CubismRendererMeshProgram(this.gl);
    this.meshWithMaskProgram = new CubismRendererMeshWithMaskProgram(this.gl);
    this.indexBuffer = this.gl.createBuffer()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.positionBuffer = this.gl.createBuffer()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.textureCoordBuffer = this.gl.createBuffer()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    this.textures = this.model.textures.map((texture) => {
      return new CubismRendererTexture(this.gl, texture.imageBitmap);
    });

    const maskTextures = new Map<CubismMesh, CubismRendererMaskTexture>();
    for (const mesh of this.model.meshes) {
      if (mesh.hasMask) {
        maskTextures.set(mesh, new CubismRendererMaskTexture(this.gl));
      }
    }
    this.maskTextures = maskTextures;

    this.meshIndices = new Int32Array(this.model.meshes.length);
  }

  setDefaultViewport(x: number, y: number, width: number, height: number) {
    this.state.setDefaultViewport(x, y, width, height);
  }

  setMatrix(matrix: number[]) {
    this.matrix.fromArray(matrix);
  }

  render() {
    for (const [mesh, maskTexture] of this.maskTextures) {
      this.renderMask(mesh, maskTexture);
    }

    for (const mesh of this.getSortedMeshes()) {
      if (mesh.hasMask) {
        const maskTexture = this.maskTextures.get(mesh)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
        this.renderMeshWithMask(mesh, maskTexture, this.matrix);
      } else {
        this.renderMesh(mesh, this.matrix);
      }
    }
  }

  private *getSortedMeshes() {
    for (const [index, mesh] of this.model.meshes.entries()) {
      this.meshIndices[mesh.renderOrder] = index;
    }
    for (const index of this.meshIndices) {
      yield this.model.meshes[index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }
  }

  private renderMesh(mesh: CubismMesh, matrix: Matrix4) {
    if (!mesh.isVisible) {
      return;
    }

    const program = this.meshProgram;
    this.gl.useProgram(program.id);
    this.gl.uniformMatrix4fv(program.uMatrix, false, matrix.elements);
    this.gl.uniform1f(program.uOpacity, mesh.opacity);
    this.setIsCulling(mesh.isCulling);
    this.setBlendMode(mesh.blendMode);
    const texture = this.textures[mesh.textureIndex]!.id; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.setTexture(program.uTexture, 0, texture);

    this.drawMesh(mesh, program);
  }

  private renderMeshWithMask(
    mesh: CubismMesh,
    maskTexture: CubismRendererMaskTexture,
    matrix: Matrix4,
  ) {
    if (!mesh.isVisible) {
      return;
    }

    const program = this.meshWithMaskProgram;
    this.gl.useProgram(program.id);
    this.gl.uniformMatrix4fv(program.uMatrix, false, matrix.elements);
    this.gl.uniform1f(program.uOpacity, mesh.opacity);
    this.setIsCulling(mesh.isCulling);
    this.setBlendMode(mesh.blendMode);
    const texture = this.textures[mesh.textureIndex]!.id; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.setTexture(program.uTexture, 0, texture);

    maskMatrix.identity();
    this.gl.uniformMatrix4fv(program.uMaskMatrix, false, maskMatrix.elements);
    this.gl.uniform1f(program.uMaskCoeff, mesh.hasInvertedMask ? 1 : 0);
    this.setTexture(program.uMaskTexture, 1, maskTexture.id);

    this.drawMesh(mesh, program);
  }

  private renderMask(mesh: CubismMesh, maskTexture: CubismRendererMaskTexture) {
    const maskBoundingBox = mesh.getMaskBoundingBox();
    toOrthographic(maskMatrix, maskBoundingBox);

    maskTexture.render(() => {
      for (const maskMesh of mesh.maskMeshes) {
        this.renderMaskMesh(maskMesh, maskMatrix);
      }
    });
  }

  private renderMaskMesh(mesh: CubismMesh, matrix: Matrix4) {
    const program = this.meshProgram;
    this.gl.useProgram(program.id);
    this.gl.uniformMatrix4fv(program.uMatrix, false, matrix.elements);
    this.gl.uniform1f(program.uOpacity, 1);
    this.setIsCulling(mesh.isCulling);
    this.setBlendMode(CubismBlendMode.Normal);
    const texture = this.textures[mesh.textureIndex]!.id; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.setTexture(program.uTexture, 0, texture);

    this.drawMesh(mesh, program);
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

  private drawMesh(mesh: CubismMesh, program: CubismRendererProgram) {
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
    this.gl.vertexAttribPointer(
      program.aPosition,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      mesh.textureCoords,
      this.gl.DYNAMIC_DRAW,
    );
    this.gl.vertexAttribPointer(
      program.aTextureCoord,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );

    this.gl.drawElements(
      this.gl.TRIANGLES,
      mesh.vertexIndices.length,
      this.gl.UNSIGNED_SHORT,
      0,
    );
  }

  destroy() {
    this.meshProgram.destroy();
    this.meshWithMaskProgram.destroy();
    this.gl.deleteBuffer(this.indexBuffer);
    this.gl.deleteBuffer(this.positionBuffer);
    this.gl.deleteBuffer(this.textureCoordBuffer);
    this.textures.forEach((texture) => {
      texture.destroy();
    });
    this.maskTextures.forEach((maskTexture) => {
      maskTexture.destroy();
    });
  }
}

const toOrthographic = (matrix: Matrix4, boundingBox: Box2) => {
  matrix.makeOrthographic(
    boundingBox.min.x,
    boundingBox.max.x,
    boundingBox.max.y,
    boundingBox.min.y,
    1,
    -1,
  );
};

export { CubismRenderer };
