abstract class CubismRendererProgram {
  readonly id: WebGLProgram;
  private readonly vertexShader: WebGLShader;
  private readonly fragmentShader: WebGLShader;
  readonly aPosition: number;
  readonly aTextureCoord: number;

  constructor(
    protected readonly gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ) {
    this.id = this.gl.createProgram()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.gl.shaderSource(this.vertexShader, vertexShaderSource);
    this.gl.compileShader(this.vertexShader);
    this.gl.attachShader(this.id, this.vertexShader);

    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.gl.shaderSource(this.fragmentShader, fragmentShaderSource);
    this.gl.compileShader(this.fragmentShader);
    this.gl.attachShader(this.id, this.fragmentShader);

    this.gl.linkProgram(this.id);

    this.aPosition = this.gl.getAttribLocation(this.id, "aPosition");
    this.aTextureCoord = this.gl.getAttribLocation(this.id, "aTextureCoord");

    this.gl.enableVertexAttribArray(this.aPosition);
    this.gl.enableVertexAttribArray(this.aTextureCoord);
  }

  destroy() {
    this.gl.disableVertexAttribArray(this.aPosition);
    this.gl.disableVertexAttribArray(this.aTextureCoord);

    this.gl.deleteProgram(this.id);
    this.gl.deleteShader(this.vertexShader);
    this.gl.deleteShader(this.fragmentShader);
  }
}

export { CubismRendererProgram };
