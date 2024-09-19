"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { SmilePlus, Loader2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import CoverPicker from "../../../app/_components/Coverpicker";
import EmojiPickerComponent from "../../../app/_components/EmojipickerComponent";
import { db } from "../../../config/firebaseconfig";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

function CreateWorkspace() {
  const [coverImage, setCoverImage] = useState("/cover.png");
  const [workspaceName, setWorkspaceName] = useState("");
  const [emoji, setEmoji] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Used to create new workspace and save data in database
   */
  const OnCreateWorkspace = async () => {
    if (!user) {
      console.error("User not authenticated");
      // Optionally, redirect to login page or show a notification
      return;
    }

    setLoading(true);
    try {
      const workspaceId = Date.now();
      await setDoc(doc(db, "Workspace", workspaceId.toString()), {
        workspaceName: workspaceName,
        emoji: emoji,
        coverImage: coverImage,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        id: workspaceId,
        orgId:
          user?.publicMetadata?.orgId ||
          user?.primaryEmailAddress?.emailAddress,
      });

      const docId = uuidv4();
      await setDoc(doc(db, "workspaceDocuments", docId.toString()), {
        workspaceId: workspaceId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        coverImage: null,
        emoji: null,
        id: docId,
        documentName: "Untitled Document",
        documentOutput: [],
      });

      await setDoc(doc(db, "documentOutput", docId.toString()), {
        docId: docId,
        output: [],
      });

      router.replace(`/workspace/${workspaceId}/${docId}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      // Optionally, add user feedback here (e.g., toast notifications)
    }
    setLoading(false);
  };

  return (
    <div className="p-10 md:px-36 lg:px-64 xl:px-96 py-28">
      <div className="shadow-2xl rounded-xl">
        <CoverPicker setNewCover={(v) => setCoverImage(v)}>
          <div className="relative cursor-pointer group">
            <h2 className="absolute items-center justify-center hidden w-full h-full p-4 bg-black bg-opacity-50 group-hover:flex">
              Change Cover
            </h2>
            <div className="transition-opacity duration-300 group-hover:opacity-40">
              <Image
                src={coverImage}
                width={400}
                height={400}
                className="w-full h-[180px] object-cover rounded-t-xl"
                alt="Cover Image"
              />
            </div>
          </div>
        </CoverPicker>

        <div className="p-12 bg-white shadow-md rounded-b-xl">
          <h2 className="text-xl font-medium">Create a new workspace</h2>
          <p className="mt-2 text-sm text-gray-600">
            This is a shared space where you can collaborate with your team. You
            can always rename it later.
          </p>
          <div className="flex items-center gap-2 mt-8">
            <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
              <Button variant="outline" className="flex items-center gap-2">
                {emoji ? <span>{emoji}</span> : <SmilePlus />}
              </Button>
            </EmojiPickerComponent>
            <Input
              placeholder="Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              aria-label="Workspace Name"
              required
            />
          </div>
          <div className="flex justify-end gap-6 mt-7">
            <Button
              disabled={!workspaceName.trim() || loading}
              onClick={OnCreateWorkspace}
            >
              Create {loading && <Loader2 className="ml-2 animate-spin" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Implement cancel functionality here, e.g., reset form or navigate away
                setWorkspaceName("");
                setEmoji("");
                setCoverImage("/cover.png");
                router.back(); // Navigates back to the previous page
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspace;
