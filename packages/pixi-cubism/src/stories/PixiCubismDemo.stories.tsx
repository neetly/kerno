import { CubismModelFactory } from "@kerno/cubism";
import type { Meta, StoryObj } from "@storybook/react";

import { PixiCubismDemo } from "./PixiCubismDemo";

export default {
  component: PixiCubismDemo,
} satisfies Meta<typeof PixiCubismDemo>;

export const Default: StoryObj<typeof PixiCubismDemo> = {
  args: {
    factory: await CubismModelFactory.createFromURL({
      fileName: "Hiyori.model3.json",
      baseURL: new URL(
        "/third-party/live2d-cubism-models/Hiyori/",
        document.baseURI,
      ),
    }),
  },
};
