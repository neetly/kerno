import type { CubismModelManifestData } from "./types/CubismModelManifestData";

const textDecoder = new TextDecoder();

class CubismModelManifest {
  static from(arrayBuffer: ArrayBuffer) {
    const text = textDecoder.decode(arrayBuffer);
    const data = JSON.parse(text) as CubismModelManifestData;
    return new CubismModelManifest(data);
  }

  private constructor(private readonly data: CubismModelManifestData) {}

  get version() {
    return this.data.Version;
  }

  get mocFileName() {
    return this.data.FileReferences.Moc;
  }

  get textureFileNames() {
    return this.data.FileReferences.Textures;
  }
}

export { CubismModelManifest };
