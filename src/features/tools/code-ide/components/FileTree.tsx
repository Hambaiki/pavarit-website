"use client";

import { useState } from "react";

import {
  FaChevronDown,
  FaChevronRight,
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";

import type { TreeViewNode } from "../lib/fileTree";

interface FileTreeProps {
  tree: TreeViewNode[];
  activePath: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile: (parentDir: string) => void;
  onCreateDir: (parentDir: string) => void;
  onRename: (path: string) => void;
  onDelete: (path: string) => void;
}

interface TreeLevelProps {
  nodes: TreeViewNode[];
  depth: number;
  activePath: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile: (parentDir: string) => void;
  onCreateDir: (parentDir: string) => void;
  onRename: (path: string) => void;
  onDelete: (path: string) => void;
}

export default function FileTree({
  tree,
  activePath,
  onSelectFile,
  onCreateFile,
  onCreateDir,
  onRename,
  onDelete,
}: FileTreeProps) {
  return (
    <div className="flex flex-col text-sm">
      <TreeLevel
        nodes={tree}
        depth={0}
        activePath={activePath}
        onSelectFile={onSelectFile}
        onCreateFile={onCreateFile}
        onCreateDir={onCreateDir}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  );
}

function TreeLevel({
  nodes,
  depth,
  activePath,
  onSelectFile,
  onCreateFile,
  onCreateDir,
  onRename,
  onDelete,
}: TreeLevelProps) {
  return (
    <>
      {nodes.map((node) =>
        node.type === "dir" ? (
          <DirRow
            key={node.path}
            node={node}
            depth={depth}
            activePath={activePath}
            onSelectFile={onSelectFile}
            onCreateFile={onCreateFile}
            onCreateDir={onCreateDir}
            onRename={onRename}
            onDelete={onDelete}
          />
        ) : (
          <FileRow
            key={node.path}
            path={node.path}
            name={node.name}
            depth={depth}
            active={activePath === node.path}
            onSelect={() => onSelectFile(node.path)}
            onRename={() => onRename(node.path)}
            onDelete={() => onDelete(node.path)}
          />
        )
      )}
    </>
  );
}

function DirRow({
  node,
  depth,
  activePath,
  onSelectFile,
  onCreateFile,
  onCreateDir,
  onRename,
  onDelete,
}: {
  node: TreeViewNode & { type: "dir" };
  depth: number;
  activePath: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile: (parentDir: string) => void;
  onCreateDir: (parentDir: string) => void;
  onRename: (path: string) => void;
  onDelete: (path: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <div
        className="group flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 cursor-pointer"
        style={{ paddingLeft: depth * 14 + 8 }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <FaChevronDown className="w-2.5 h-2.5 text-gray-500 shrink-0" />
        ) : (
          <FaChevronRight className="w-2.5 h-2.5 text-gray-500 shrink-0" />
        )}
        {open ? (
          <FaFolderOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        ) : (
          <FaFolder className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        )}
        <span className="truncate flex-1">{node.name}</span>
        <div className="hidden group-hover:flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            title="New file"
            onClick={(e) => {
              e.stopPropagation();
              onCreateFile(node.path);
            }}
            className="text-gray-400 hover:text-white"
          >
            <FaPlus className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            title="Rename"
            onClick={(e) => {
              e.stopPropagation();
              onRename(node.path);
            }}
            className="text-gray-400 hover:text-white text-[10px] leading-none"
          >
            Aa
          </button>
          <button
            type="button"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.path);
            }}
            className="text-gray-400 hover:text-red-400"
          >
            <FaTrash className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
      {open && (
        <TreeLevel
          nodes={node.children}
          depth={depth + 1}
          activePath={activePath}
          onSelectFile={onSelectFile}
          onCreateFile={onCreateFile}
          onCreateDir={onCreateDir}
          onRename={onRename}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

function FileRow({
  path,
  name,
  depth,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  path: string;
  name: string;
  depth: number;
  active: boolean;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`group flex items-center gap-1 px-2 py-1 rounded cursor-pointer ${
        active
          ? "bg-primary-500/20 text-white"
          : "hover:bg-white/5 text-gray-300"
      }`}
      style={{ paddingLeft: depth * 14 + 8 + 14 }}
      onClick={onSelect}
    >
      <FaFile className="w-3 h-3 text-gray-500 shrink-0" />
      <span className="truncate flex-1">{name}</span>
      <div className="hidden group-hover:flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          title="Rename"
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          className="text-gray-400 hover:text-white text-[10px] leading-none"
        >
          Aa
        </button>
        <button
          type="button"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-400 hover:text-red-400"
        >
          <FaTrash className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}
