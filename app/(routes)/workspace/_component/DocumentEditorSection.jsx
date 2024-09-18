import React from "react";
import DocumentHeader from "./DocumentHeader";
import DocumentInfo from "./DocumentInfo";
import RichDocumentEditor from "./RichDocumentEditor";

function DocumentEditorSection({params}) {
  return (
    <div>
      <div>
        <DocumentHeader />
      </div>

      <div>
        <DocumentInfo params={params}/>
      </div>

      <div>
        <RichDocumentEditor params={params}/>
      </div>
    </div>
  );
}

export default DocumentEditorSection;
