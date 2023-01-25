import { type CubismCoreDrawables, CubismCoreUtils } from "@kerno/cubism-core";
import { Box2, Vector2 } from "three";

import { CubismBlendMode } from "./CubismBlendMode";

const point = new Vector2();

class CubismMesh {
  readonly maskMeshes: CubismMesh[] = [];

  private isBoundingBoxDirty = true;
  private readonly boundingBox = new Box2();
  private readonly maskBoundingBox = new Box2();

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

  get hasMask() {
    return this.maskMeshes.length !== 0;
  }

  getBoundingBox() {
    if (!this.isBoundingBoxDirty) {
      return this.boundingBox;
    }

    this.boundingBox.makeEmpty();
    for (let index = 0; index < this.vertexPositions.length; index += 2) {
      point.set(
        this.vertexPositions[index * 2]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        this.vertexPositions[index * 2 + 1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      );
      this.boundingBox.expandByPoint(point);
    }
    this.isBoundingBoxDirty = false;

    return this.boundingBox;
  }

  getMaskBoundingBox() {
    this.maskBoundingBox.makeEmpty();
    for (const maskMesh of this.maskMeshes) {
      this.maskBoundingBox.union(maskMesh.getBoundingBox());
    }
    return this.maskBoundingBox;
  }

  update() {
    this.isBoundingBoxDirty ||= //
      CubismCoreUtils.hasVertexPositionsDidChangeBit(this.dynamicFlags);
  }
}

export { CubismMesh };
