import React from 'react'
import SideNav from '../../_component/SideNav'
import DocumentEditorSection from '../../_component/DocumentEditorSection'

function page({params}) {
  return (
   <>
   
   <div>
      <SideNav params={params}/>
    </div>
   
    <div className='md:ml-72'>
        <DocumentEditorSection params={params}/>
      </div>
   
   
   </>
  )
}

export default page
