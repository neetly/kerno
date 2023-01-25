#!/usr/bin/env node

import { parse, readFile, writeFile } from "@neetly/codegen-utils";

const ast = parse(
  await readFile("../../third-party/live2d-cubism-core/live2dcubismcore.d.ts"),
  { plugins: ["typescript"] },
);

const getExportName = (name) => {
  return "CubismCore" + name.slice(0, 1).toUpperCase() + name.slice(1);
};

const exports = new Map();
const typeExports = new Map();
for (const node of ast.program.body[0].body.body) {
  switch (node.type) {
    case "VariableDeclaration":
      for (const declaration of node.declarations) {
        exports.set(declaration.id.name, getExportName(declaration.id.name));
      }
      break;
    case "ClassDeclaration":
      exports.set(node.id.name, getExportName(node.id.name));
      typeExports.set(node.id.name, getExportName(node.id.name));
      break;
    case "TSTypeAliasDeclaration":
    case "TSInterfaceDeclaration":
      typeExports.set(node.id.name, getExportName(node.id.name));
      break;
  }
}

await writeFile(
  "./src/index.ts",
  [
    `/// <reference types="live2d-cubism-core/live2dcubismcore" />\n\n`,
    ...Array.from(exports).map(([name, exportName]) => {
      return `export const ${exportName} = Live2DCubismCore.${name};\n`;
    }),
    ...Array.from(typeExports).map(([name, exportName]) => {
      return `export type ${exportName} = Live2DCubismCore.${name};\n`;
    }),
  ].join(""),
);
