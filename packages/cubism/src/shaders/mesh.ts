const vertexShaderSource = `
#version 300 es

uniform mat4 uMatrix;
in vec4 aPosition;
in vec2 aTextureCoord;
out vec2 vTextureCoord;

void main() {
  gl_Position = uMatrix * aPosition;
  vTextureCoord = aTextureCoord;
}
`.trim();

const fragmentShaderSource = `
#version 300 es
precision mediump float;

uniform vec4 uBaseColor;
uniform sampler2D uTexture;
in vec2 vTextureCoord;
out vec4 fragmentColor;

void main() {
  fragmentColor = texture(uTexture, vTextureCoord) * uBaseColor;
}
`.trim();

export { fragmentShaderSource, vertexShaderSource };
