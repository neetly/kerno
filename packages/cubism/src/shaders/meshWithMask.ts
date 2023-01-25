const vertexShaderSource = `
#version 300 es

uniform mat4 uMatrix;
uniform mat4 uMaskMatrix;
in vec4 aPosition;
in vec2 aTextureCoord;
out vec2 vTextureCoord;
out vec2 vMaskTextureCoord;

void main() {
  gl_Position = uMatrix * aPosition;
  vTextureCoord = aTextureCoord;
  vMaskTextureCoord = (uMaskMatrix * aPosition).xy;
}
`.trim();

const fragmentShaderSource = `
#version 300 es
precision mediump float;

uniform float uOpacity;
uniform sampler2D uTexture;
uniform float uMaskCoeff;
uniform sampler2D uMaskTexture;
in vec2 vTextureCoord;
in vec2 vMaskTextureCoord;
out vec4 fragmentColor;

void main() {
  float maskAlpha = texture(uMaskTexture, vMaskTextureCoord).a;
  maskAlpha = (1.0 - uMaskCoeff) * maskAlpha + uMaskCoeff * (1.0 - maskAlpha);
  fragmentColor = texture(uTexture, vTextureCoord) * uOpacity * maskAlpha;
}
`.trim();

export { fragmentShaderSource, vertexShaderSource };
