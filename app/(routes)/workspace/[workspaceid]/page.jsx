import React from 'react'
import SideNav from '../_component/SideNav'
import { Room } from '../../../Room'

function Workspace({params}) {
  return (
    <div>
    
      <Room params={params}>

      <SideNav params={params} />

      </Room>
    </div>
  )
}

export default Workspace