const createGLProgram = (
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
) => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
};

export { createGLProgram };
