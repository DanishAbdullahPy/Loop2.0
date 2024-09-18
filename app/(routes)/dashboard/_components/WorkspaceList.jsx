"use client"; 

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { AlignLeft, LayoutGrid } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image'; 
import Link from 'next/link';  

function WorkspaceList() {
  const [workspaceList, setWorkspaceList] = useState([]); 

  const { user, isLoaded } = useUser(); // Get the user and loading state

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className='my-10 p-10 md:px-24 lg:px-36 xl:px-52'>
      <div className='flex justify-between'>
        <h2 className='font-bold text-2xl'> Hi, {user?.fullName || user?.firstName}</h2> 
      
        <Link href='/createworkspace' passHref>
          <Button>+</Button>
        </Link>
      </div>

      <div>
        <div className='mt-10 flex justify-between'>
          <h2 className='font-medium text-primary'>Workspaces</h2>
        </div>
      </div>
      
      <div className='flex justify-end items-center gap-1'>
        <LayoutGrid />
        <AlignLeft />
      </div>

      {workspaceList.length === 0 ? (
        <div className='flex flex-col justify-center items-center my-10'> 
          <Image src='/workspace.png' width={200} height={200} alt='workspace'/>
          <h2>Create new workspace</h2>

          <Link href='/createworkspace' passHref>
            <Button  className='my-3'>+ New Workspace</Button>
          </Link>
        </div>
      ) : (
        <div className='mt-10'>
          Workspace List
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;
