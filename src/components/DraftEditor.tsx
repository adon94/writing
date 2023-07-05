import { useCallback, useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

export default function DraftEditor() {
  const [value, setValue] = useState(() => {
    // Load editor state from local storage or use a default state
    const savedEditorState = window.localStorage.getItem("content");
    return savedEditorState
      ? EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(savedEditorState).contentBlocks
          )
        )
      : EditorState.createEmpty();
  });

  const save = useCallback(() => {
    const content = draftToHtml(convertToRaw(value.getCurrentContent()));
    window.localStorage.setItem("content", content as string);
  }, [value]);

  function scrollToCurrentLine() {
    const selection = window.getSelection();
    if (selection && selection.anchorNode) {
      const lineNode = selection.anchorNode.parentNode;
      if (lineNode instanceof HTMLElement) {
        lineNode.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }

  useEffect(() => {
    save();
  }, [value, save]);

  function handleChange(editorState: any) {
    setValue(editorState);
    scrollToCurrentLine();
  }

  return (
    <div className="h-full overflow-y-auto">
      <Editor
        editorState={value}
        wrapperClassName="h-full p-20"
        placeholder="Begin by writing..."
        onEditorStateChange={handleChange}
        editorClassName="bg-transparent text-black font-mono w-[500px]"
        toolbarHidden
      />
      <div className="min-h-screen"></div>
    </div>
  );
}
