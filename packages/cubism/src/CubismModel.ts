import { CubismCoreModel } from "@kerno/cubism-core";

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

  readonly parameters: readonly CubismParameter[];
  readonly meshes: readonly CubismMesh[];

  private constructor(
    private readonly core: CubismCoreModel,
    readonly textures: readonly CubismModelTexture[],
  ) {
    const parameters: CubismParameter[] = [];
    for (let index = 0; index < this.core.parameters.count; index++) {
      parameters.push(new CubismParameter(this.core.parameters, index));
    }
    this.parameters = parameters;

    const meshes: CubismMesh[] = [];
    for (let index = 0; index < this.core.drawables.count; index++) {
      meshes.push(new CubismMesh(this.core.drawables, index));
    }
    this.meshes = meshes;
  }

  update() {
    this.core.update();
  }

  destroy() {
    this.core.release();
  }
}

export { CubismModel };
