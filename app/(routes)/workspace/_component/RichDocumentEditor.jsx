"use client";

import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import List from "@editorjs/list";
import Checklist from '@editorjs/checklist';
import SimpleImage from 'simple-image-editorjs';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';
import { useUser } from '@clerk/nextjs';
import Paragraph from '@editorjs/paragraph';

function RichDocumentEditor({ params }) {
  const editorRef = useRef(null); // Store EditorJS instance
  const isFetchedRef = useRef(false); // Store if document is fetched
  const { user } = useUser();

  useEffect(() => {
    const initializeEditor = async () => {
      if (user && !editorRef.current) {
        await InitEditor();
      }
    };

    initializeEditor();

    return () => {
      // Cleanup editor instance
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [user]);

  /**
   * Save the document to Firestore
   */
  const SaveDocument = () => {
    if (editorRef.current) {
      editorRef.current
        .save()
        .then(async (outputData) => {
          const docRef = doc(db, 'documentOutput', params?.documentid);
          await updateDoc(docRef, {
            output: JSON.stringify(outputData),
            editedBy: user?.primaryEmailAddress?.emailAddress,
          });
        })
        .catch((error) => {
          console.error('Error saving document:', error);
        });
    }
  };

  /**
   * Get document output from Firestore
   */
  const GetDocumentOutput = async () => {
    if (!params?.documentid) return;

    const docRef = doc(db, 'documentOutput', params?.documentid);

    // Check if the document exists; if not, initialize it
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      await setDoc(docRef, {
        output: '{}', // Initialize with an empty JSON object as a string
        editedBy: user?.primaryEmailAddress?.emailAddress,
      });
    }

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();
          if (
            docData?.editedBy !== user?.primaryEmailAddress?.emailAddress ||
            !isFetchedRef.current
          ) {
            if (docData?.output) {
              try {
                const parsedOutput = JSON.parse(docData.output);
                editorRef.current?.render(parsedOutput);
                isFetchedRef.current = true;
              } catch (error) {
                console.error('Error parsing document output:', error);
              }
            } else {
              console.warn('Document output is empty or undefined');
            }
          }
        }
      },
      (error) => {
        console.error('Error fetching document:', error);
      }
    );

    return () => unsubscribe(); // Cleanup Firestore listener when component unmounts
  };

  /**
   * Initialize EditorJS
   */
  const InitEditor = async () => {
    const editor = new EditorJS({
      holder: 'editorjs',
      onChange: SaveDocument,
      tools: {
        header: Header,
        delimiter: Delimiter,
        paragraph: Paragraph,
        alert: {
          class: Alert,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+A',
          config: {
            alertTypes: [
              'primary',
              'secondary',
              'info',
              'success',
              'warning',
              'danger',
              'light',
              'dark',
            ],
            defaultType: 'primary',
            messagePlaceholder: 'Enter something',
          },
        },
        table: Table,
        list: {
          class: List,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+L',
          config: {
            defaultStyle: 'unordered',
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
          shortcut: 'CMD+SHIFT+P',
        },
      },
      /**
       * Wait until the editor is ready before fetching the document
       */
      onReady: () => {
        editorRef.current = editor;
        GetDocumentOutput();
      },
    });
  };

  return (
    <div>
      <div id="editorjs" className="w-[70%]"></div>
      <div className="fixed bottom-10 md:ml-80 left-0 z-10"></div>
    </div>
  );
}

export default RichDocumentEditor;
