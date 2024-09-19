"use Client"

import React from "react";
import SideNav from "../../_component/SideNav";
import DocumentEditorSection from "../../_component/DocumentEditorSection";
import { Room } from "../../../../../app/Room";

function page({ params }) {
  return (
    <>
      <Room params={params}>
        <div>
          <SideNav params={params} />
        </div>

        <div className="md:ml-72">
          <DocumentEditorSection params={params} />
        </div>
      </Room>
    </>
  );
}

export default page;
