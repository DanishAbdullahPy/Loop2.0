import React from 'react'
import { Header } from './_components/Header'
import { UserButton } from '@clerk/nextjs'

const page = () => {
  return (
    <div>
<Header/>
<UserButton/>
    </div>
  )
}

export default page