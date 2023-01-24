import { CubismCoreMoc } from "@kerno/cubism-core";

class CubismModelMoc {
  static from(arrayBuffer: ArrayBuffer) {
    const core = CubismCoreMoc.fromArrayBuffer(arrayBuffer);
    return new CubismModelMoc(core);
  }

  private constructor(readonly core: CubismCoreMoc) {}

  destroy() {
    this.core._release();
  }
}

export { CubismModelMoc };
