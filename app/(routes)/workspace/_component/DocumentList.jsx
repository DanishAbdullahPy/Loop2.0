"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DocumentOptions from "./DocumentOptions";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '@/config/firebaseconfig';
import { toast } from 'sonner';

function DocumentList({ documentList, params }) {
  const router = useRouter();

  const deleteDocument = async (docId) => {
    try {
      await deleteDoc(doc(db, "workspaceDocuments", docId));
      toast.success("Document Deleted!");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document. Please try again.");
    }
  };

  return (
    <div>
      {documentList.map((docItem) => (
        <div
          key={docItem.id}
          onClick={() =>
            router.push(`/workspace/${params?.workspaceid}/${docItem?.id}`)
          }
          className={`mt-3 p-2 px-3 hover:bg-gray-200 
            rounded-lg cursor-pointer flex justify-between items-center
            ${docItem?.id === params?.documentid ? "bg-white" : ""}
          `}
        >
          <div className="flex gap-2 items-center">
            {!docItem.emoji && (
              <Image
                src="/loopdocument.svg"
                width={20}
                height={20}
                alt="Document Icon"
              />
            )}
            <h2 className="flex gap-2">
              {docItem?.emoji} {docItem.documentName}
            </h2>
          </div>
          <DocumentOptions
            doc={docItem}
            deleteDocument={deleteDocument}
          />
        </div>
      ))}
    </div>
  );
}

export default DocumentList;
