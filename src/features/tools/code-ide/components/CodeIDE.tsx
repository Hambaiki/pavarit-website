"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "highlight.js/styles/github-dark.css";
import { FaDownload, FaUpload } from "react-icons/fa6";

import {
  type ProjectState,
  addDir,
  addFile,
  basename,
  buildTreeView,
  createEmptyProject,
  deleteNode,
  dirname,
  joinPath,
  renameNode,
  updateFileContent,
} from "../lib/fileTree";
import { idbGet, idbSet } from "../lib/idb";
import { projectToZip, zipToProject } from "../lib/zip";
import CodeEditor from "./CodeEditor";
import FileTree from "./FileTree";
import Tabs from "./Tabs";

const STORAGE_KEY = "active-project";
const AUTOSAVE_DELAY_MS = 600;

function defaultProject(): ProjectState {
  let p = createEmptyProject("my-project");
  p = addFile(
    p,
    "index.ts",
    `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));\n`
  );
  p = addFile(p, "README.md", "# my-project\n\nStart editing index.ts.\n");
  return p;
}

export default function CodeIDE() {
  const [project, setProject] = useState<ProjectState | null>(null);
  const [openPaths, setOpenPaths] = useState<string[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<Record<string, string>>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from IndexedDB on mount, falling back to a starter project if
  // nothing's been saved yet (first visit) or load fails for any reason.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await idbGet<ProjectState>(STORAGE_KEY);
        if (cancelled) return;
        if (saved && Object.keys(saved.nodes).length > 0) {
          setProject(saved);
          const firstFile = Object.values(saved.nodes).find(
            (n) => n.type === "file"
          );
          if (firstFile) {
            setOpenPaths([firstFile.path]);
            setActivePath(firstFile.path);
          }
        } else {
          const fresh = defaultProject();
          setProject(fresh);
          setOpenPaths(["index.ts"]);
          setActivePath("index.ts");
        }
      } catch {
        // IndexedDB unavailable (private browsing, old browser, etc.) —
        // fall back to a working in-memory session rather than a blank screen.
        const fresh = defaultProject();
        if (!cancelled) {
          setProject(fresh);
          setOpenPaths(["index.ts"]);
          setActivePath("index.ts");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced autosave whenever the project changes. After a successful
  // save, snapshot each file's content so tabs can show a dirty-dot for
  // any file that's changed since the last persisted save.
  useEffect(() => {
    if (!project) return;
    const timer = setTimeout(() => {
      idbSet(STORAGE_KEY, project)
        .then(() => {
          const snapshot: Record<string, string> = {};
          for (const node of Object.values(project.nodes)) {
            if (node.type === "file") snapshot[node.path] = node.content;
          }
          setSavedSnapshot(snapshot);
        })
        .catch(() => {
          // Best-effort autosave — if it fails, the user still has the
          // session in memory and can export to a zip manually.
        });
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [project]);

  const activeNode =
    project && activePath ? project.nodes[activePath] : undefined;

  const handleSelectFile = useCallback((path: string) => {
    setActivePath(path);
    setOpenPaths((prev) => (prev.includes(path) ? prev : [...prev, path]));
  }, []);

  const handleCloseTab = useCallback(
    (path: string) => {
      setOpenPaths((prev) => {
        const next = prev.filter((p) => p !== path);
        if (activePath === path) {
          setActivePath(next.length > 0 ? next[next.length - 1] : null);
        }
        return next;
      });
    },
    [activePath]
  );

  const handleContentChange = useCallback(
    (content: string) => {
      if (!project || !activePath) return;
      setProject(updateFileContent(project, activePath, content));
    },
    [project, activePath]
  );

  const handleCreateFile = useCallback(
    (parentDir: string) => {
      if (!project) return;
      const name = window.prompt("New file name:");
      if (!name) return;
      const path = joinPath(parentDir, name);
      try {
        const next = addFile(project, path, "");
        setProject(next);
        handleSelectFile(path);
      } catch (err) {
        window.alert(
          err instanceof Error ? err.message : "Could not create file"
        );
      }
    },
    [project, handleSelectFile]
  );

  const handleCreateDir = useCallback(
    (parentDir: string) => {
      if (!project) return;
      const name = window.prompt("New folder name:");
      if (!name) return;
      try {
        setProject(addDir(project, joinPath(parentDir, name)));
      } catch (err) {
        window.alert(
          err instanceof Error ? err.message : "Could not create folder"
        );
      }
    },
    [project]
  );

  const handleRename = useCallback(
    (path: string) => {
      if (!project) return;
      const currentName = basename(path);
      const newName = window.prompt("Rename to:", currentName);
      if (!newName || newName === currentName) return;
      const newPath = joinPath(dirname(path), newName);
      try {
        const next = renameNode(project, path, newPath);
        setProject(next);
        setOpenPaths((prev) =>
          prev.map((p) =>
            p === path || p.startsWith(`${path}/`)
              ? newPath + p.slice(path.length)
              : p
          )
        );
        if (activePath === path || activePath?.startsWith(`${path}/`)) {
          setActivePath(newPath + activePath.slice(path.length));
        }
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "Could not rename");
      }
    },
    [project, activePath]
  );

  const handleDelete = useCallback(
    (path: string) => {
      if (!project) return;
      if (!window.confirm(`Delete "${path}"? This cannot be undone.`)) return;
      const next = deleteNode(project, path);
      setProject(next);
      setOpenPaths((prev) =>
        prev.filter((p) => p !== path && !p.startsWith(`${path}/`))
      );
      if (activePath === path || activePath?.startsWith(`${path}/`)) {
        const remaining = openPaths.filter(
          (p) => p !== path && !p.startsWith(`${path}/`)
        );
        setActivePath(
          remaining.length > 0 ? remaining[remaining.length - 1] : null
        );
      }
    },
    [project, activePath, openPaths]
  );

  const handleExport = useCallback(() => {
    if (!project) return;
    const bytes = projectToZip(project);
    // .slice() guarantees a plain ArrayBuffer-backed copy, satisfying
    // BlobPart's type regardless of TS lib version quirks around
    // Uint8Array<ArrayBufferLike> vs SharedArrayBuffer.
    const blob = new Blob([bytes.slice().buffer], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name || "project"}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }, [project]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // allow re-selecting the same file later
      if (!file) return;
      if (
        project &&
        Object.keys(project.nodes).length > 0 &&
        !window.confirm(
          "Importing will replace your current project. Continue?"
        )
      ) {
        return;
      }
      try {
        const buf = new Uint8Array(await file.arrayBuffer());
        const projectName =
          file.name.replace(/\.zip$/i, "") || "imported-project";
        const imported = zipToProject(buf, projectName);
        setProject(imported);
        const firstFile = Object.values(imported.nodes).find(
          (n) => n.type === "file"
        );
        setOpenPaths(firstFile ? [firstFile.path] : []);
        setActivePath(firstFile ? firstFile.path : null);
      } catch (err) {
        window.alert(
          err instanceof Error
            ? `Could not import zip: ${err.message}`
            : "Could not import zip"
        );
      }
    },
    [project]
  );

  if (!project) {
    return (
      <div className="flex items-center justify-center h-128 text-sm text-gray-500">
        Loading editor…
      </div>
    );
  }

  const tree = buildTreeView(project);
  const tabs = openPaths
    .map((path) => project.nodes[path])
    .filter(
      (n): n is Extract<NonNullable<typeof n>, { type: "file" }> =>
        !!n && n.type === "file"
    )
    .map((n) => ({
      path: n.path,
      name: n.name,
      dirty:
        savedSnapshot[n.path] !== undefined &&
        savedSnapshot[n.path] !== n.content,
    }));

  return (
    <div className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-gray-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-gray-900 shrink-0">
        <span className="text-xs font-mono text-gray-400">{project.name}</span>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={handleImportFile}
          />
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors"
          >
            <FaUpload className="w-3 h-3" />
            Import .zip
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors"
          >
            <FaDownload className="w-3 h-3" />
            Export .zip
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-128">
        {/* Sidebar */}
        <div className="w-56 shrink-0 border-r border-white/10 bg-gray-900 overflow-y-auto py-2">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] uppercase tracking-wide text-gray-500 px-1">
              Files
            </span>
            <button
              type="button"
              title="New file at root"
              onClick={() => handleCreateFile("")}
              className="text-gray-400 hover:text-white text-xs px-1"
            >
              + file
            </button>
          </div>
          <FileTree
            tree={tree}
            activePath={activePath}
            onSelectFile={handleSelectFile}
            onCreateFile={handleCreateFile}
            onCreateDir={handleCreateDir}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </div>

        {/* Main editor area */}
        <div className="flex flex-col flex-1 min-w-0">
          <Tabs
            tabs={tabs}
            activePath={activePath}
            onSelect={setActivePath}
            onClose={handleCloseTab}
          />
          {activeNode && activeNode.type === "file" ? (
            <CodeEditor
              path={activeNode.path}
              content={activeNode.content}
              onChange={handleContentChange}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              Select a file to start editing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
