import type { CubismModelFactory } from "@kerno/cubism";

type PixiCubismDemoProps = {
  factory: CubismModelFactory;
  width?: number;
  height?: number;
};

const PixiCubismDemo = ({ width = 800, height = 600 }: PixiCubismDemoProps) => {
  return <canvas width={width} height={height} />;
};

export { PixiCubismDemo };
