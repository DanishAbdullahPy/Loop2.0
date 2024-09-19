"use client"; // Ensure this is at the very top

import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import Alert from "editorjs-alert";
import List from "@editorjs/list";    
import Checklist from "@editorjs/checklist";
import SimpleImage from "simple-image-editorjs";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseconfig";
import { useUser } from "@clerk/nextjs";
import Paragraph from "@editorjs/paragraph";
import GenerateAITemplate from './GenerateAITemplate'; // Ensure correct path and export

function RichDocumentEditor({ params }) {

  const ref = useRef(null); // Initialize ref with null
  const { user } = useUser();
  const [documentOutput, setDocumentOutput] = useState([]);
  const [isFetched, setIsFetched] = useState(false); // Use state for isFetched

  useEffect(() => {
    if (user) {
      InitEditor();
    }
    // Cleanup function to destroy editor on unmount
    return () => {
      if (ref.current) {
        ref.current.destroy();
        ref.current = null;
      }
    };
  }, [user]);

  /**
   * Used to save Document
   */
  const SaveDocument = async () => {
    try {
      console.log("UPDATE");
      const outputData = await ref.current.save();
      const docRef = doc(db, 'documentOutput', params?.documentid);
     
      await updateDoc(docRef, {
        output: JSON.stringify(outputData),
        editedBy: user?.primaryEmailAddress?.emailAddress
      });
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const GetDocumentOutput = () => {
    const docRef = doc(db, 'documentOutput', params?.documentid);
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data) {
        if (data.editedBy !== user?.primaryEmailAddress?.emailAddress || !isFetched) {
          if (data.output) {
            ref.current.render(JSON.parse(data.output));
          }
          setIsFetched(true);
        }
      }
    }, (error) => {
      console.error("Error fetching document:", error);
    });

    // Return unsubscribe to clean up the listener on unmount
    return unsubscribe;
  };

  const InitEditor = () => {
    if (!ref.current) {
      ref.current = new EditorJS({
        holder: 'editorjs',
        onChange: () => {
          SaveDocument();
        },
        onReady: () => {
          GetDocumentOutput();
        },
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph: Paragraph,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
              alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
              defaultType: 'primary',
              messagePlaceholder: 'Enter something',
            }
          },
          table: Table,
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
            config: {
              defaultStyle: 'unordered'
            },
          },
          checklist: {
            class: Checklist,
            shortcut: 'CMD+SHIFT+C',
            inlineToolbar: true,
          },
          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+P'
          },
          // Add other tools as needed
        },
      });
    }
  };

  return (
    <div className=''>
      <div id='editorjs' className='w-[70%]'></div>
      <div className='fixed bottom-10 md:ml-80 left-0 z-10'>
        <GenerateAITemplate setGenerateAIOutput={(output) => {
          if (ref.current) {
            ref.current.render(output);
          }
        }} />
      </div>
    </div>
  );
}

export default RichDocumentEditor;
