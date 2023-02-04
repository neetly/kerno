import type { CubismCoreParts } from "@kerno/cubism-core";

class CubismPart {
  parentPart: CubismPart | null = null;

  constructor(
    private readonly parts: CubismCoreParts,
    private readonly index: number,
  ) {}

  get opacity() {
    let opacity = this.parts.opacities[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    if (this.parentPart) {
      opacity *= this.parentPart.opacity;
    }
    return opacity;
  }

  get parentPartIndex() {
    return this.parts.parentIndices[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }
}

export { CubismPart };
