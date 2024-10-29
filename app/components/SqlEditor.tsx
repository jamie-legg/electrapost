import React, { useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { format } from 'sql-formatter';
import * as monaco from 'monaco-editor';
import axios from 'axios';
import { useSession } from '@/hooks/use-session';

export const SqlEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { executeQuery, setQueryText } = useSession();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    // Auto-format on save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleFormat();
    });

    // Execute query on cmd + enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      console.log('execute query');
      executeQuery();
    });


  };

  const handleFormat = () => {
    if (editorRef.current) {
      const unformatted = editorRef.current.getValue();
      const formatted = format(unformatted);
      editorRef.current.setValue(formatted);
    }
  };

  const handleEditorChange = (value: string) => {
    //debounce
    console.log('handleEditorChange', value);
    
      setQueryText(value);
  };

  const handleAIPrediction = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      try {
        const response = await axios.post('http://localhost:3050/api/ai-predictions', { code });
        const prediction = response.data.prediction;
        editorRef.current.setValue(prediction);
      } catch (error) {
        console.error('Error fetching AI prediction:', error);
      }
    }
  };

  return (
    <div className="relative h-full">
      <Editor
        defaultLanguage="sql"
        defaultValue="-- Write your SQL query here"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          suggestOnTriggerCharacters: true,
        }}
      />
    </div>
  );
};
