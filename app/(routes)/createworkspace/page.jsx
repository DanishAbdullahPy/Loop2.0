"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SmilePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Coverpicker from '@/app/_components/Coverpicker';
import EmojipickerComponent from '@/app/_components/EmojipickerComponent';

function Createworkspace() {
  const [coverImage, setCoverImage] = useState('/cover.png');
  const [workspaceName, setWorkspaceName] = useState(''); 
  const [emoji, setEmoji] = useState(''); // Initialize with empty string

  return (
    <div className='p-10 md:px-36 lg:px-64 xl:px-96 py-28'>
      {/* Cover Image Section */}
      <Coverpicker setNewCover={(v) => setCoverImage(v)}>
        <div className='relative group'>
          <div className='shadow-2xl rounded-xl'>
            <Image
              src={coverImage}
              width={400}
              height={400}
              className='w-full h-[180px] object-cover rounded-t-xl'
              alt='Cover Image'
            />
          </div>
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer'>
            <h2 className='text-white text-lg'>Change cover</h2>
          </div>
        </div>
      </Coverpicker>

      {/* Workspace Creation Section */}
      <div className='p-12 bg-white rounded-b-xl shadow-md'>
        <h2 className='font-medium text-xl'>Create a new workspace</h2>
        <p className='text-sm mt-2 text-gray-600'>
          This is a shared space where you can collaborate with anyone. You can always rename it later.
        </p>
        <div className='mt-8 flex gap-2 items-center'>

          <EmojipickerComponent setEmojiIcon={(v) => setEmoji(v)}>
            <Button variant="outline" className='flex items-center gap-2'>
              {emoji ? <span>{emoji}</span> : <SmilePlus size={20} />}
              Add Workspace
            </Button>
          </EmojipickerComponent>
         
          <Input
            placeholder="Workspace Name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            aria-label="Workspace Name"
          />
        </div>
        <div className='mt-7 flex justify-end gap-6'>
          <Button 
            disabled={!workspaceName.trim()} 
            aria-label="Create Workspace"
            onClick={() => {
              // Implement create workspace functionality here
              console.log('Creating workspace:', { workspaceName, emoji, coverImage });
            }}
          >
            Create
          </Button>
          <Button 
            variant="outline" 
            aria-label="Cancel"
            onClick={() => {
              // Implement cancel functionality here
              console.log('Cancel clicked');
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Createworkspace;
