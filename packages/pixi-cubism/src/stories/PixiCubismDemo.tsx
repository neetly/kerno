import type { CubismModelFactory } from "@kerno/cubism";
import { Application as PixiApplication } from "@pixi/app";
import { useEffect, useRef } from "react";

import { PixiCubismView } from "../PixiCubismView";

interface PixiCubismDemoProps {
  factory: CubismModelFactory;
  width?: number;
  height?: number;
}

const PixiCubismDemo = ({
  factory,
  width = 800,
  height = 600,
}: PixiCubismDemoProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const app = new PixiApplication({
      view: ref.current!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      width,
      height,
      resolution: window.devicePixelRatio,
      autoDensity: true,
      backgroundAlpha: 0,
    });

    const model = factory.createModel();

    const view = new PixiCubismView(model);
    view.position.set(width / 2, height / 2);
    view.scale.set(Math.min(width / model.width, height / model.height));
    app.stage.addChild(view);

    return () => {
      view.destroy();
      model.destroy();
      app.destroy();
    };
  }, [factory, width, height]);

  return <canvas ref={ref} />;
};

export { PixiCubismDemo };
