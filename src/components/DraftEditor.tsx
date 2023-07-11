import { useCallback, useEffect, useState, useRef } from "react";
import { Editor, EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export default function DraftEditor() {
  const editorRef = useRef<any>(null);
  const [editorState, setEditorState] = useState(() => {
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
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    window.localStorage.setItem("content", content);
  }, [editorState]);

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

  const isInitialFocus = useRef(true);

  useEffect(() => {
    if (editorRef.current && isInitialFocus.current) {
      editorRef.current.focus();
      const newEditorState = EditorState.moveFocusToEnd(editorState);
      isInitialFocus.current = false;
      setEditorState(newEditorState);
      const editorElement = editorRef.current?.editorContainer;
      if (editorElement) {
        console.log(editorElement.scrollHeight);
        editorElement.scrollTop = editorElement.scrollHeight;
      }
    }
  }, [editorState]);

  useEffect(() => {
    save();
  }, [editorState, save]);

  function handleChange(newEditorState: any) {
    setEditorState(newEditorState);
    scrollToCurrentLine();
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="h-full w-full">
        <div className="bg-transparent text-black font-mono w-[500px] mx-auto py-20">
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={handleChange}
            placeholder="Begin by writing..."
          />
        </div>
      </div>
      <div className="min-h-[50vh]"></div>
    </div>
  );
}
