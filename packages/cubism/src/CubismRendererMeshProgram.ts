import { CubismRendererProgram } from "./CubismRendererProgram";
import { fragmentShaderSource, vertexShaderSource } from "./shaders/mesh";

class CubismRendererMeshProgram extends CubismRendererProgram {
  readonly uMatrix: WebGLUniformLocation;
  readonly uOpacity: WebGLUniformLocation;
  readonly uTexture: WebGLUniformLocation;

  constructor(gl: WebGL2RenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.uMatrix = this.gl.getUniformLocation(this.id, "uMatrix")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uOpacity = this.gl.getUniformLocation(this.id, "uOpacity")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uTexture = this.gl.getUniformLocation(this.id, "uTexture")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }
}

export { CubismRendererMeshProgram };
