import { fragmentShaderSource, vertexShaderSource } from "./shaders/mesh";
import { createGLProgram } from "./utils/createGLProgram";

class CubismRendererMeshProgram {
  readonly id: WebGLProgram;
  readonly uMatrix: WebGLUniformLocation;
  readonly uOpacity: WebGLUniformLocation;
  readonly uTexture: WebGLUniformLocation;
  readonly aPosition: number;
  readonly aTextureCoord: number;

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.id = createGLProgram(
      this.gl,
      vertexShaderSource,
      fragmentShaderSource,
    );

    this.uMatrix = this.gl.getUniformLocation(this.id, "uMatrix")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uOpacity = this.gl.getUniformLocation(this.id, "uOpacity")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.uTexture = this.gl.getUniformLocation(this.id, "uTexture")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.aPosition = this.gl.getAttribLocation(this.id, "aPosition");
    this.aTextureCoord = this.gl.getAttribLocation(this.id, "aTextureCoord");

    this.gl.enableVertexAttribArray(this.aPosition);
    this.gl.enableVertexAttribArray(this.aTextureCoord);
  }

  destroy() {
    this.gl.disableVertexAttribArray(this.aPosition);
    this.gl.disableVertexAttribArray(this.aTextureCoord);

    this.gl.deleteProgram(this.id);
  }
}

export { CubismRendererMeshProgram };
