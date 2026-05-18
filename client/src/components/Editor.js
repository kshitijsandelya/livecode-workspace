import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);

    // Initialize CodeMirror
    useEffect(() => {
        if (editorRef.current) return;

        const init = async () => {
            const editor = CodeMirror.fromTextArea(
                document.getElementById("realtimeEditor"),
                {
                    mode: { name: "javascript", json: true },
                    theme: "dracula",
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            editorRef.current = editor;
            editor.setSize("100%", "100%");

            editor.on("change", (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();

                onCodeChange(code);

                if (origin !== "setValue" && socketRef.current) {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        };

        init();
    }, [onCodeChange, roomId, socketRef]);

    // Socket Changes
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null && editorRef.current) {
                    const currentCode = editorRef.current.getValue();
                    if (currentCode !== code) {
                        editorRef.current.setValue(code);
                    }
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, [socketRef.current]);

    return (
        <div style={{ height: "100%", width: "100%", flex: 1 }} className="editor-container">
            <textarea id="realtimeEditor"></textarea>
        </div>
    );
}

export default Editor;