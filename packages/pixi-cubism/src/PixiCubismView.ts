import type { CubismModel } from "@kerno/cubism";
import { Container as PixiContainer } from "@pixi/display";

class PixiCubismView extends PixiContainer {
  constructor(private readonly model: CubismModel) {
    super();
  }
}

export { PixiCubismView };
