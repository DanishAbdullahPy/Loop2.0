import Logo from '@/app/_components/Logo'
import React from 'react'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'

export const Header = () => {
  return (
      <div className='flex justify-between items-center p-3 shadow-md'>
        <Logo />
        <OrganizationSwitcher/>
        <UserButton/>
      </div>
  )
}
