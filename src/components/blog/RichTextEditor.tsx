"use client";

import React, { useRef, useState } from "react";
import { FaListOl, FaListUl } from "react-icons/fa";
import { FaBold, FaItalic, FaLink, FaList, FaUnderline } from "react-icons/fa6";
import Button from "../Button";

interface RichTextEditorProps {
  onSave: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onSave }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Apply formatting to the selected text
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };
  // Save content as HTML
  const handleSave = () => {
    if (editorRef.current) {
      onSave(editorRef.current.innerHTML);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Rich Text Editor</h1>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4">
        <button
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-900 rounded"
          onClick={() => applyFormat("fontWeight", "bold")}
        >
          <FaBold />
        </button>
        <button
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-900 rounded"
          onClick={() => applyFormat("fontStyle", "italic")}
        >
          <FaItalic />
        </button>
        <button
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-900 rounded"
          onClick={() => applyFormat("textDecoration", "underline")}
        >
          <FaUnderline />
        </button>
        {/* <button
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-900 rounded"
          onClick={() => applyFormat("insertOrderedList")}
        >
          <FaListOl />
        </button>
        <button
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-900 rounded"
          onClick={() => applyFormat("insertUnorderedList")}
        >
          <FaListUl />
        </button> */}
        {/* <button
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-900 rounded"
          onClick={() =>
            applyFormat("createLink", prompt("Enter URL:", "https://"))
          }
        >
          <FaLink />
        </button> */}
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        className="w-full min-h-[200px] 
          border border-neutral-500 p-4 rounded-lg 
          focus:outline-none focus:ring-0"
        contentEditable
        suppressContentEditableWarning
      />

      <div className="flex justify-end space-x-4">
        <Button
          variant="secondary"
          className="mt-4 rounded-lg px-6 py-2"
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button className="mt-4 rounded-lg px-6 py-2" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default RichTextEditor;
