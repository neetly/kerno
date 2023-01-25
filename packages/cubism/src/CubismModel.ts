import { CubismCoreModel } from "@kerno/cubism-core";
import { Box2, Vector2 } from "three";

import { CubismMesh } from "./CubismMesh";
import type { CubismModelMoc } from "./CubismModelMoc";
import type { CubismModelTexture } from "./CubismModelTexture";
import { CubismParameter } from "./CubismParameter";

class CubismModel {
  static from({
    moc,
    textures,
  }: {
    moc: CubismModelMoc;
    textures: readonly CubismModelTexture[];
  }) {
    const core = CubismCoreModel.fromMoc(moc.core);
    return new CubismModel(core, textures);
  }

  readonly unitSize: number;
  readonly boundingBox: Box2;
  readonly parameters: ReadonlyMap<string, CubismParameter>;
  readonly meshes: readonly CubismMesh[];

  private constructor(
    private readonly core: CubismCoreModel,
    readonly textures: readonly CubismModelTexture[],
  ) {
    this.unitSize = this.core.canvasinfo.PixelsPerUnit;
    this.boundingBox = new Box2(
      new Vector2(
        -this.core.canvasinfo.CanvasOriginX,
        -this.core.canvasinfo.CanvasOriginY,
      ),
      new Vector2(
        this.core.canvasinfo.CanvasWidth - this.core.canvasinfo.CanvasOriginX,
        this.core.canvasinfo.CanvasHeight - this.core.canvasinfo.CanvasOriginY,
      ),
    );

    const parameters = new Map<string, CubismParameter>();
    for (let index = 0; index < this.core.parameters.count; index++) {
      const parameter = new CubismParameter(this.core.parameters, index);
      parameters.set(parameter.name, parameter);
    }
    this.parameters = parameters;

    const meshes: CubismMesh[] = [];
    for (let index = 0; index < this.core.drawables.count; index++) {
      meshes.push(new CubismMesh(this.core.drawables, index));
    }
    this.meshes = meshes;

    for (const mesh of this.meshes) {
      for (const index of mesh.maskMeshIndices) {
        if (index !== -1) {
          mesh.maskMeshes.push(this.meshes[index]!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        }
      }
    }
  }

  get width() {
    return this.boundingBox.max.x - this.boundingBox.min.x;
  }

  get height() {
    return this.boundingBox.max.y - this.boundingBox.min.y;
  }

  update() {
    this.core.drawables.resetDynamicFlags();
    this.core.update();
    for (const mesh of this.meshes) {
      mesh.update();
    }
  }

  destroy() {
    this.core.release();
  }
}

export { CubismModel };
