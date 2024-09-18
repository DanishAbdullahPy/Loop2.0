"use client"; // This makes sure the component runs on the client side

// Importing all the things we need from different places
import Logo from '@/app/_components/Logo'; // Our Logo component
import { Button } from '@/components/ui/button'; // A fancy button component
import { db } from '@/config/firebaseconfig'; // Our database configuration
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'; // Firebase functions to interact with the database
import { Bell, Loader2Icon } from 'lucide-react'; // Icons for notifications and loading
import React, { useEffect, useState } from 'react'; // React library and some of its hooks
import DocumentList from './DocumentList'; // Our DocumentList component
import { v4 as uuidv4 } from 'uuid'; // Function to create unique IDs
import { useUser } from '@clerk/nextjs'; // Hook to get user information
import { useRouter } from 'next/navigation'; // Hook to navigate between pages
import { toast } from 'sonner'; // Library to show little popup messages
import { Progress } from '@/components/ui/progress';

// Getting the maximum number of files allowed from environment variables
const MAX_FILE = process.env.NEXT_PUBLIC_MAX_FILE_COUNT;

function SideNav({ params }) {
  // Setting up some pieces of information that can change
  const [documentList, setDocumentList] = useState([]); // List of documents
  const { user } = useUser(); // Information about the current user
  const [loading, setLoading] = useState(false); // Are we currently loading something?
  const router = useRouter(); // Allows us to move to different pages

  // When the component loads or when 'params' changes, get the list of documents
  useEffect(() => {
    if (params) {
      GetDocumentList();
    }
  }, [params]);

  /**
   * This function gets the list of documents from the database
   */
  const GetDocumentList = () => {
    // Create a query to get documents that belong to the current workspace
    const q = query(
      collection(db, 'workspaceDocuments'),
      where('workspaceId', '==', Number(params?.workspaceid))
    );

    // Listen for changes in the database and update the documentList
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setDocumentList([]); // Clear the current list

      // Go through each document and add it to the list
      querySnapshot.forEach((doc) => {
        setDocumentList((documentList) => [...documentList, doc.data()]);
      });
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  };

  /**
   * This function creates a new document
   */
  const CreateNewDocument = async () => {
    // Check if we've reached the maximum number of files
    if (documentList?.length >= MAX_FILE) {
      toast("Upgrade to add new file", {
        description: "You reached the max file limit. Please upgrade for unlimited file creation.",
        action: {
          label: "Upgrade",
          onClick: () => console.log("Upgrade clicked"),
        },
      });
      return; // Stop the function here
    }

    setLoading(true); // Show the loading spinner
    const docId = uuidv4(); // Create a unique ID for the new document

    // Create a new document in 'workspaceDocuments' collection
    await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
      workspaceId: Number(params?.workspaceid),
      createdBy: user?.primaryEmailAddress?.emailAddress,
      coverImage: null,
      emoji: null,
      id: docId,
      documentName: 'Untitled Document',
      documentOutput: [],
    });

    // Create a new document in 'documentOutput' collection
    await setDoc(doc(db, 'documentOutput', docId.toString()), {
      docId: docId,
      output: [],
    });

    setLoading(false); // Hide the loading spinner
    router.replace(`/workspace/${params?.workspaceid}/${docId}`); // Go to the new document's page
  };

  return (
    <div className='h-screen md:w-72 hidden md:block fixed bg-blue-50 p-5 shadow-md'>
      {/* Top section with Logo and Notification Bell */}
      <div className='flex justify-between items-center'>
        <Logo />
          <Bell className='h-5 w-5 text-gray-500' />
      </div>

      <hr className='my-5'></hr> {/* A horizontal line */}

      <div>
        {/* Section with Workspace Name and Add Button */}
        <div className='flex justify-between items-center'>
          <h2 className='font-medium'>Workspace Name</h2>
          <Button size="sm" className="text-lg" onClick={CreateNewDocument}>
            {loading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : '+'}
          </Button>
        </div>
      </div>

      {/* Document List */}
      <DocumentList documentList={documentList} params={params} />

      {/* Progress Bar at the Bottom */}
      <div className='absolute bottom-10 w-[85%]'>
        <Progress value={(documentList?.length/MAX_FILE)*100} />
        <h2 className='text-sm font-light my-2'>
          <strong>{documentList?.length}</strong> Out of <strong>{MAX_FILE}</strong> files used
        </h2>
        <h2 className='text-sm font-light'>Upgrade your plan for unlimited access</h2>
      </div>
    </div>
  );
}

export default SideNav;
