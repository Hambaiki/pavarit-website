// Pure, framework-free file tree model.
// A project is a flat map of path -> node, which is much easier to reason
// about than a nested tree when it comes to renaming/moving (no recursive
// pointer surgery) — the nested *view* is derived from this map on render.

export type FileNode = {
  type: "file";
  path: string; // full path, e.g. "src/components/Button.tsx"
  name: string; // "Button.tsx"
  content: string;
};

export type DirNode = {
  type: "dir";
  path: string; // "" for root
  name: string;
};

export type Node = FileNode | DirNode;

export type ProjectState = {
  name: string;
  nodes: Record<string, Node>; // path -> node, excludes the implicit "" root
};

export function dirname(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx === -1 ? "" : path.slice(0, idx);
}

export function basename(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx === -1 ? path : path.slice(idx + 1);
}

export function joinPath(dir: string, name: string): string {
  return dir ? `${dir}/${name}` : name;
}

export function createEmptyProject(name = "untitled-project"): ProjectState {
  return { name, nodes: {} };
}

function assertNoCollision(nodes: Record<string, Node>, path: string) {
  if (nodes[path]) {
    throw new Error(`A file or folder already exists at "${path}"`);
  }
}

// Ensures every ancestor directory of `path` exists as a DirNode.
// Needed because our model only stores explicit nodes — there is no
// implicit dir creation when you add "a/b/c.ts" unless "a" and "a/b" exist.
function ensureAncestorDirs(nodes: Record<string, Node>, path: string) {
  const dir = dirname(path);
  if (!dir) return;
  if (!nodes[dir]) {
    ensureAncestorDirs(nodes, dir);
    nodes[dir] = { type: "dir", path: dir, name: basename(dir) };
  } else if (nodes[dir].type !== "dir") {
    throw new Error(`"${dir}" exists and is not a folder`);
  }
}

export function addFile(
  project: ProjectState,
  path: string,
  content = ""
): ProjectState {
  assertNoCollision(project.nodes, path);
  const nodes = { ...project.nodes };
  ensureAncestorDirs(nodes, path);
  nodes[path] = { type: "file", path, name: basename(path), content };
  return { ...project, nodes };
}

export function addDir(project: ProjectState, path: string): ProjectState {
  assertNoCollision(project.nodes, path);
  const nodes = { ...project.nodes };
  ensureAncestorDirs(nodes, path);
  nodes[path] = { type: "dir", path, name: basename(path) };
  return { ...project, nodes };
}

export function updateFileContent(
  project: ProjectState,
  path: string,
  content: string
): ProjectState {
  const node = project.nodes[path];
  if (!node || node.type !== "file") {
    throw new Error(`No file at "${path}"`);
  }
  return {
    ...project,
    nodes: { ...project.nodes, [path]: { ...node, content } },
  };
}

// Deletes a node. If it's a dir, deletes every descendant too.
export function deleteNode(project: ProjectState, path: string): ProjectState {
  const nodes = { ...project.nodes };
  const prefix = `${path}/`;
  for (const key of Object.keys(nodes)) {
    if (key === path || key.startsWith(prefix)) {
      delete nodes[key];
    }
  }
  return { ...project, nodes };
}

// Renames/moves a node (and all descendants, if a dir) from oldPath to newPath.
export function renameNode(
  project: ProjectState,
  oldPath: string,
  newPath: string
): ProjectState {
  if (oldPath === newPath) return project;
  if (project.nodes[newPath]) {
    throw new Error(`A file or folder already exists at "${newPath}"`);
  }
  const node = project.nodes[oldPath];
  if (!node) throw new Error(`No node at "${oldPath}"`);

  const nodes = { ...project.nodes };
  ensureAncestorDirs(nodes, newPath);

  const prefix = `${oldPath}/`;
  const toMove = Object.keys(nodes).filter(
    (key) => key === oldPath || key.startsWith(prefix)
  );

  for (const key of toMove) {
    const rest = key.slice(oldPath.length); // "" or "/child/..."
    const movedPath = `${newPath}${rest}`;
    const oldNode = nodes[key];
    delete nodes[key];
    nodes[movedPath] =
      oldNode.type === "file"
        ? { ...oldNode, path: movedPath, name: basename(movedPath) }
        : { ...oldNode, path: movedPath, name: basename(movedPath) };
  }

  return { ...project, nodes };
}

// Builds the nested tree structure used for rendering, sorted dirs-first then
// alphabetically, at every level.
export type TreeViewNode =
  | { type: "file"; path: string; name: string }
  | { type: "dir"; path: string; name: string; children: TreeViewNode[] };

export function buildTreeView(project: ProjectState): TreeViewNode[] {
  const childrenByParent = new Map<string, Node[]>();
  for (const node of Object.values(project.nodes)) {
    const parent = dirname(node.path);
    if (!childrenByParent.has(parent)) childrenByParent.set(parent, []);
    childrenByParent.get(parent)!.push(node);
  }

  function build(parentPath: string): TreeViewNode[] {
    const children = childrenByParent.get(parentPath) ?? [];
    const sorted = [...children].sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return sorted.map((node) =>
      node.type === "dir"
        ? {
            type: "dir" as const,
            path: node.path,
            name: node.name,
            children: build(node.path),
          }
        : { type: "file" as const, path: node.path, name: node.name }
    );
  }

  return build("");
}
