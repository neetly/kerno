import type { CubismCoreDrawables } from "@kerno/cubism-core";
import { CubismCoreUtils } from "@kerno/cubism-core";

import { CubismBlendMode } from "./CubismBlendMode";

class CubismMesh {
  readonly maskMeshes: CubismMesh[] = [];

  constructor(
    private readonly drawables: CubismCoreDrawables,
    private readonly index: number,
  ) {}

  get isVisible() {
    return CubismCoreUtils.hasIsVisibleBit(this.dynamicFlags);
  }

  get opacity() {
    return this.drawables.opacities[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get isCulling() {
    return !CubismCoreUtils.hasIsDoubleSidedBit(this.constantFlags);
  }

  get blendMode() {
    switch (true) {
      case CubismCoreUtils.hasBlendAdditiveBit(this.constantFlags):
        return CubismBlendMode.Additive;
      case CubismCoreUtils.hasBlendMultiplicativeBit(this.constantFlags):
        return CubismBlendMode.Multiplicative;
      default:
        return CubismBlendMode.Normal;
    }
  }

  private get constantFlags() {
    return this.drawables.constantFlags[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  private get dynamicFlags() {
    return this.drawables.dynamicFlags[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get renderOrder() {
    return this.drawables.renderOrders[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get vertexIndices() {
    return this.drawables.indices[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get vertexPositions() {
    return this.drawables.vertexPositions[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get textureIndex() {
    return this.drawables.textureIndices[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get textureCoords() {
    return this.drawables.vertexUvs[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get maskMeshIndices() {
    return this.drawables.masks[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }
}

export { CubismMesh };
