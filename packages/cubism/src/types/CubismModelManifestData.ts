interface CubismModelManifestData {
  readonly Version: number;
  readonly FileReferences: {
    readonly Moc: string;
    readonly Textures: readonly string[];
  };
}

export { type CubismModelManifestData };
