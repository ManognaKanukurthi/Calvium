"use client";

import { useEffect, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface BlockNoteEditorProps {
  initialContent?: any;
  onChange?: (content: any) => void;
  editable?: boolean;
}

export default function BlockNoteEditor({
  initialContent,
  onChange,
  editable = true,
}: BlockNoteEditorProps) {
  const [mounted, setMounted] = useState(false);

  const editor = useCreateBlockNote({
    // editable,
    initialContent,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[500px] w-full border rounded-md bg-muted/20"></div>;
  }

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      className="min-h-[500px] border rounded-md"
      onChange={() => {
        const content = editor.document;
        onChange?.(content);
      }}
    />
  );
}
