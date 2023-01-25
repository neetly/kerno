import { type CubismModel, CubismRenderer } from "@kerno/cubism";
import { type Renderer, Matrix } from "@pixi/core";
import { Container as PixiContainer } from "@pixi/display";

const matrix = new Matrix();

class PixiCubismView extends PixiContainer {
  private cubismRenderer: CubismRenderer | null = null;

  constructor(private readonly model: CubismModel) {
    super();
  }

  protected override _calculateBounds() {
    this._bounds.addFrame(
      this.transform,
      this.model.boundingBox.min.x,
      this.model.boundingBox.min.y,
      this.model.boundingBox.max.x,
      this.model.boundingBox.max.y,
    );
  }

  protected override _render(renderer: Renderer) {
    renderer.batch.flush();

    this.cubismRenderer ??= new CubismRenderer(this.model, renderer.gl);
    this.cubismRenderer.setDefaultViewport(
      0,
      0,
      renderer.width,
      renderer.height,
    );
    this.cubismRenderer.setMatrix(
      this.getCubismRendererMatrix(
        renderer.screen.width,
        renderer.screen.height,
      ),
    );

    this.model.update();
    this.cubismRenderer.render();

    renderer.state.reset();
  }

  private getCubismRendererMatrix(screenWidth: number, screenHeight: number) {
    matrix
      .identity()
      .scale(this.model.unitSize, -this.model.unitSize)
      .prepend(this.transform.worldTransform)
      .scale(2 / screenWidth, -2 / screenHeight)
      .translate(-1, 1);

    const { a, b, c, d, tx, ty } = matrix;

    // prettier-ignore
    return [
      a,  b,  0,  0,
      c,  d,  0,  0,
      0,  0,  1,  0,
      tx, ty, 0,  1,
    ];
  }
}

export { PixiCubismView };
