import type { CubismModel } from "@kerno/cubism";
import { Container as PixiContainer } from "@pixi/display";

import { PixiCubismView } from "./PixiCubismView";

class PixiCubism extends PixiContainer {
  private currentModel: CubismModel | null = null;
  private currentView: PixiCubismView | null = null;

  get model() {
    return this.currentModel;
  }

  set model(model: CubismModel | null) {
    if (model !== this.currentModel) {
      this.currentModel = model;
      this.currentView?.destroy();
      if (this.currentModel) {
        this.currentView = new PixiCubismView(this.currentModel);
        this.addChild(this.currentView);
      } else {
        this.currentView = null;
      }
    }
  }

  override destroy() {
    super.destroy({ children: true });
  }
}

export { PixiCubism };
