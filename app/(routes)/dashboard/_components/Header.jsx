'use client'

import Logo from '@/app/_components/Logo'
import React from 'react'
import { OrganizationSwitcher, UserButton, useOrganization } from '@clerk/nextjs'

export const Header = () => {
  const { organization } = useOrganization(); // Fetch organization data
  const orgId = organization?.id; // Access the org ID if available
  console.log(orgId); // This might log 'undefined' if the organization data is not available yet

  return (
      <div className='flex justify-between items-center p-3 shadow-md'>
        <Logo />
        <OrganizationSwitcher
        afterLeaveOrganizationUrl={'/dashboard'}
        afterCreateOrganizationUrl={'/dashboard'} />        
        <UserButton/>
      </div>
  )
}
