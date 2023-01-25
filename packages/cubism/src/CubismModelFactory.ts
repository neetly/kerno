import { CubismError } from "./CubismError";
import { CubismModel } from "./CubismModel";
import { CubismModelManifest } from "./CubismModelManifest";
import { CubismModelMoc } from "./CubismModelMoc";
import { CubismModelTexture } from "./CubismModelTexture";

class CubismModelFactory {
  static async create({
    fileName,
    loadFileData,
  }: {
    fileName: string;
    loadFileData: (fileName: string) => Promise<ArrayBuffer>;
  }) {
    const manifest = CubismModelManifest.from(await loadFileData(fileName));
    if (manifest.version !== 3) {
      throw new CubismError(`Model "${fileName}" is not supported.`);
    }
    const moc = CubismModelMoc.from(await loadFileData(manifest.mocFileName));
    const textures = await Promise.all(
      manifest.textureFileNames.map(async (textureFileName) => {
        return CubismModelTexture.from(await loadFileData(textureFileName));
      }),
    );
    return new CubismModelFactory(moc, textures);
  }

  static async createFromURL({
    fileName,
    baseURL,
  }: {
    fileName: string;
    baseURL: string | URL;
  }) {
    return CubismModelFactory.create({
      fileName,
      loadFileData: async (fileName) => {
        const response = await fetch(new URL(fileName, baseURL));
        if (!response.ok) {
          throw new CubismError(`Cannot load file "${fileName}".`);
        }
        return response.arrayBuffer();
      },
    });
  }

  private constructor(
    private readonly moc: CubismModelMoc,
    private readonly textures: readonly CubismModelTexture[],
  ) {}

  createModel() {
    return CubismModel.from({
      moc: this.moc,
      textures: this.textures,
    });
  }

  destroy() {
    this.moc.destroy();
    this.textures.forEach((texture) => {
      texture.destroy();
    });
  }
}

export { CubismModelFactory };
