"use client";

import React, { useEffect, useState } from "react";
import CoverPicker from "@/app/_components/CoverPicker";
import EmojiPickerComponent from "@/app/_components/EmojiPickerComponent";
import { db } from "@/config/firebaseconfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { SmilePlus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

function DocumentInfo({ params }) {
  const [coverImage, setCoverImage] = useState("/cover.png");
  const [emoji, setEmoji] = useState();
  const [documentInfo, setDocumentInfo] = useState();

  useEffect(() => {
    if (params) {
      GetDocumentInfo();
    }
  }, [params]);

  /**
   * Fetches the document info from Firestore
   */
  const GetDocumentInfo = async () => {
    const docRef = doc(db, "workspaceDocuments", params?.documentid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setDocumentInfo(docSnap.data());
      setEmoji(docSnap.data()?.emoji);
      if (docSnap.data()?.coverImage) {
        setCoverImage(docSnap.data()?.coverImage);
      }
    } else {
      console.error("Document does not exist!");
      toast.error("Document not found!");
    }
  };

  /**
   * Updates the document info in Firestore
   */
  const updateDocumentInfo = async (key, value) => {
    const docRef = doc(db, "workspaceDocuments", params?.documentid);

    // Fetch the document to check if it exists before updating
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("No document found to update.");
      toast.error("Document not found.");
      return;
    }

    try {
      await updateDoc(docRef, {
        [key]: value,
      });
      toast.success("Document Updated!");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document.");
    }
  };

  return (
    <div>
      <CoverPicker
        setNewCover={(cover) => {
          setCoverImage(cover);
          updateDocumentInfo("coverImage", cover);
        }}
      >
        <div className="relative group cursor-pointer">
          <h2 className="hidden absolute p-4 w-full h-full items-center group-hover:flex justify-center">
            Change Cover
          </h2>
          <div className="group-hover:opacity-40">
            <Image
              src={coverImage}
              width={400}
              height={400}
              className="w-full h-[200px] object-cover"
              alt="Cover Image"
            />
          </div>
        </div>
      </CoverPicker>

      <div className="absolute ml-10 px-20 mt-[-40px] cursor-pointer">
        <EmojiPickerComponent
          setEmojiIcon={(emoji) => {
            setEmoji(emoji);
            updateDocumentInfo("emoji", emoji);
          }}
        >
          <div className="bg-[#ffffffb0] p-4 rounded-md">
            {emoji ? (
              <span className="text-5xl">{emoji}</span>
            ) : (
              <SmilePlus className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </EmojiPickerComponent>
      </div>

      <div className="mt-10 px-20 ml-10 p-10">
        <input
          type="text"
          placeholder="Untitled Document"
          defaultValue={documentInfo?.documentName}
          className="font-bold text-4xl outline-none"
          onBlur={(event) =>
            updateDocumentInfo("documentName", event.target.value)
          }
        />
      </div>
    </div>
  );
}

export default DocumentInfo;
