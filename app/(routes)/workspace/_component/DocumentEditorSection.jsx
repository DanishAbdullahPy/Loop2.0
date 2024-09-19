"use client";

import React, { useState } from "react"; // 2. Importing useState
import DocumentHeader from "./DocumentHeader";
import DocumentInfo from "./DocumentInfo";
import RichDocumentEditor from "./RichDocumentEditor";
import { Button } from "../../../../components/ui/button";
import { MessageCircle, X } from "lucide-react"; // 3. Importing X
import CommentBox from "./CommentBox";

function DocumentEditorSection({ params }) {
  const [openComment, setOpenComment] = useState(true);

  return (
    <div>
      <div>
        <DocumentHeader />
      </div>

      <div>
        <DocumentInfo params={params} />
      </div>

      <div>
        <RichDocumentEditor params={params} />
        <div className="fixed right-10 bottom-10 z-50">
          <Button onClick={() => setOpenComment(!openComment)}>
            {openComment ? <X /> : <MessageCircle />} {/* Using imported X */}
          </Button>
          {openComment && <CommentBox />}
        </div>
      </div>
    </div>
  );
}

export default DocumentEditorSection;
