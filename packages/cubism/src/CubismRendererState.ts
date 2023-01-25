const map = new WeakMap<WebGL2RenderingContext, CubismRendererState>();

type Viewport = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class CubismRendererState {
  static of(gl: WebGL2RenderingContext) {
    let state = map.get(gl);
    if (!state) {
      state = new CubismRendererState(gl);
      map.set(gl, state);
    }
    return state;
  }

  private readonly defaultViewport: Viewport = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  private constructor(private readonly gl: WebGL2RenderingContext) {}

  setDefaultViewport(x: number, y: number, width: number, height: number) {
    this.defaultViewport.x = x;
    this.defaultViewport.y = y;
    this.defaultViewport.width = width;
    this.defaultViewport.height = height;
  }

  resetViewport() {
    this.gl.viewport(
      this.defaultViewport.x,
      this.defaultViewport.y,
      this.defaultViewport.width,
      this.defaultViewport.height,
    );
  }
}

export { CubismRendererState };
