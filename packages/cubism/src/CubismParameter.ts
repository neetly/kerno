import type { CubismCoreParameters } from "@kerno/cubism-core";

class CubismParameter {
  constructor(
    private readonly parameters: CubismCoreParameters,
    private readonly index: number,
  ) {}

  get name() {
    return this.parameters.ids[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get minValue() {
    return this.parameters.minimumValues[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get maxValue() {
    return this.parameters.maximumValues[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get defaultValue() {
    return this.parameters.defaultValues[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  get value() {
    return this.parameters.values[this.index]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  set value(value: number) {
    this.parameters.values[this.index] = value;
  }
}

export { CubismParameter };
