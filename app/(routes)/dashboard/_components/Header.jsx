"use client";

import React from "react";
import Logo from "../../../../app/_components/Logo";
import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseconfig";

export const Header = () => {
  const { organization } = useOrganization(); // Fetch organization data
  const orgId = organization?.id; // Access the org ID if available
  const { user } = useUser(); // Fetch user data

  const saveUserData = async () => {
    try {
      const docId = Date.now().toString();
      await setDoc(doc(db, "Loopuser", docId), {
        name: user?.fullName, // Corrected from fullname to fullName
        avatar: user?.imageUrl, // Corrected from awatar and imageuUrl to avatar and imageUrl
        email: user?.primaryEmailAddress?.emailAddress,
      });
      console.log("User data saved successfully");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Optionally, you can call saveUserData here or trigger it based on an event
  React.useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [user]);

  return (
    <div className="flex items-center justify-between p-3 shadow-md">
      <Logo />
      <OrganizationSwitcher
        afterLeaveOrganizationUrl="/dashboard"
        afterCreateOrganizationUrl="/dashboard"
      />
      <UserButton />
    </div>
  );
};
