import { createFromRoot } from "codama";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { renderVisitor } from "@codama/renderers-js";

import path from "path";
import { promises as fs } from "fs";

const loadIdl = async () => {
  const filePath = path.join("target", "idl", "cascade.json");
  console.log("Loading IDL from:", filePath);

  try {
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch (err) {
    console.error("Error reading directory:", err);
    throw err;
  }
};

const idl = await loadIdl();

const codama = createFromRoot(rootNodeFromAnchor(idl));
const genPath = path.join("client", "cascade");

codama.accept(renderVisitor(genPath));

console.log(`Generated types at ${genPath}`);
