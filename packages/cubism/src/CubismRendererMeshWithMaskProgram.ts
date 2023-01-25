import { CubismRendererProgram } from "./CubismRendererProgram";
import {
  fragmentShaderSource,
  vertexShaderSource,
} from "./shaders/meshWithMask";

class CubismRendererMeshWithMaskProgram extends CubismRendererProgram {
  readonly uMatrix: WebGLUniformLocation;
  readonly uOpacity: WebGLUniformLocation;
  readonly uTexture: WebGLUniformLocation;
  readonly uMaskMatrix: WebGLUniformLocation;
  readonly uMaskCoeff: WebGLUniformLocation;
  readonly uMaskTexture: WebGLUniformLocation;

  constructor(gl: WebGL2RenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.uMatrix = this.gl.getUniformLocation(this.id, "uMatrix")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uOpacity = this.gl.getUniformLocation(this.id, "uOpacity")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uTexture = this.gl.getUniformLocation(this.id, "uTexture")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uMaskMatrix = this.gl.getUniformLocation(this.id, "uMaskMatrix")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uMaskCoeff = this.gl.getUniformLocation(this.id, "uMaskCoeff")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uMaskTexture = this.gl.getUniformLocation(this.id, "uMaskTexture")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }
}

export { CubismRendererMeshWithMaskProgram };
