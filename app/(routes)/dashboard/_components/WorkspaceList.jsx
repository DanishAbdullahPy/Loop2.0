"use client";

import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@clerk/nextjs';
import { AlignLeft, LayoutGrid } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image'; 
import Link from 'next/link';  
import WorkspaceItemList from './WorkspaceItemList';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';

function WorkspaceList() {
  const { user, isLoaded, isSignedIn } = useUser(); // Get user and auth state
  const { orgId } = useAuth(); // Assuming useAuth provides orgId
  const [workspaceList, setWorkspaceList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getWorkspaceList();
    }
  }, [orgId, user, isLoaded, isSignedIn]);

  const getWorkspaceList = async () => {
    setLoading(true);
    setError(null);
    try {
      // Determine the organization identifier
      const organizationIdentifier = orgId || user?.primaryEmailAddress?.emailAddress;

      if (!organizationIdentifier) {
        throw new Error("Organization ID or User Email is required to fetch workspaces.");
      }

      // Create a query against the collection.
      const q = query(
        collection(db, 'Workspace'),
        where('orgId', '==', organizationIdentifier)
      );

      const querySnapshot = await getDocs(q);

      const workspaces = [];
      querySnapshot.forEach((doc) => {
        workspaces.push({ id: doc.id, ...doc.data() }); // Include document ID
      });

      setWorkspaceList(workspaces);
    } catch (err) {
      console.error("Error fetching workspaces:", err);
      setError("Failed to load workspaces. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Loading user information...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <h2 className='text-xl'>You need to sign in to view your workspaces.</h2>
        <Link href="/sign-in">
          <Button className="mt-4">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='my-10 p-10 md:px-24 lg:px-36 xl:px-52'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl'>Hi, {user?.fullName || user?.firstName}</h2> 
        <Link href='/createworkspace' passHref>
          <Button aria-label="Create Workspace">+</Button>
        </Link>
      </div>

      <div className='mt-10 flex justify-between items-center'>
        <h2 className='font-medium text-primary'>Workspaces</h2>
        <div className='flex gap-2'>
          <LayoutGrid aria-label="Grid View" />
          <AlignLeft aria-label="List View" />
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center my-10'>
          <p>Loading workspaces...</p>
        </div>
      ) : error ? (
        <div className='flex flex-col justify-center items-center my-10'>
          <p className='text-red-500'>{error}</p>
          <Button onClick={getWorkspaceList} className="mt-4">
            Retry
          </Button>
        </div>
      ) : workspaceList.length === 0 ? (
        <div className='flex flex-col justify-center items-center my-10'> 
          <Image src='/workspace.png' width={200} height={200} alt='workspace'/>
          <h2 className='mt-4 text-lg'>Create a new workspace</h2>

          <Link href='/createworkspace' passHref>
            <Button className='my-3'>+ New Workspace</Button>
          </Link>
        </div>
      ) : (
        <div className='mt-10'>
          <WorkspaceItemList workspaceList={workspaceList} />
        </div>
      )}
    </div>
  );
}

export default WorkspaceList;
