// Dipakai lewat: node --import ./scripts/ts-paths.mjs <script.ts>
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./ts-paths-hooks.mjs", pathToFileURL(import.meta.filename));
