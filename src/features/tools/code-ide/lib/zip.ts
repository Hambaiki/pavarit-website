import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

import { type ProjectState, createEmptyProject, dirname } from "./fileTree";

// Files we never want to zip up or restore — binary/lock/build noise.
// (Kept intentionally small/explicit rather than a giant ignore list, since
// this is a lightweight in-browser editor, not a general-purpose archiver.)
const SKIP_NAMES = new Set([".DS_Store"]);

export function projectToZip(project: ProjectState): Uint8Array {
  const files: Record<string, Uint8Array> = {};

  for (const node of Object.values(project.nodes)) {
    if (node.type !== "file") continue;
    if (SKIP_NAMES.has(node.name)) continue;
    files[node.path] = strToU8(node.content);
  }

  // If a project is completely empty, zipSync would throw on an empty
  // object in some edge cases — guard with a placeholder so export never
  // produces a broken/empty archive silently.
  if (Object.keys(files).length === 0) {
    files["README.md"] = strToU8(
      `# ${project.name}\n\n(This project was empty when exported.)\n`
    );
  }

  return zipSync(files, { level: 6 });
}

export function zipToProject(
  zipBytes: Uint8Array,
  projectName: string
): ProjectState {
  const unzipped = unzipSync(zipBytes);
  let project = createEmptyProject(projectName);
  const nodes = { ...project.nodes };

  const entries = Object.entries(unzipped)
    // directories appear as keys ending in "/" with empty content in some
    // zip tools; skip those, our model derives dirs from file paths
    .filter(([path]) => !path.endsWith("/"))
    .filter(([path]) => !SKIP_NAMES.has(path.split("/").pop() ?? ""));

  for (const [path, bytes] of entries) {
    let content: string;
    try {
      content = strFromU8(bytes);
    } catch {
      // Binary file — we're a text/code editor, so store a clear
      // placeholder instead of corrupting binary data as "text".
      content = `// Binary file (${bytes.length} bytes) — not editable here.`;
    }
    nodes[path] = { type: "file", path, name: path.split("/").pop()!, content };

    // backfill ancestor dirs
    let dir = dirname(path);
    while (dir && !nodes[dir]) {
      nodes[dir] = { type: "dir", path: dir, name: dir.split("/").pop()! };
      dir = dirname(dir);
    }
  }

  project = { ...project, nodes };
  return project;
}
