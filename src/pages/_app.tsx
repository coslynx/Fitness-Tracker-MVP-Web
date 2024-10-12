'use client'

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Provider } from "zustand";
import { useStore } from "@/store";
import { useState } from "react";
import {  UserProfile, UserProfileResponse } from "@/features/profile/types";
import { getUserProfile } from "@/features/profile/services";
import { ERROR_CODES } from "@/common/constants";
import { Loader } from "@/components/common";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Modal } from "@/components/common";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useStore();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (session?.user.id) {
          const response: UserProfileResponse = await getUserProfile(
            session.user.id
          );
          if (response.success) {
            store.setUserProfile(response.data);
          } else {
            setErrorMessage(response.message || "Error fetching profile");
            setShowModal(true);
          }
        }
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message ||
            "An error occurred while fetching your profile."
        );
        setShowModal(true);
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [session, store.setUserProfile]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class">
          <SessionProvider session={session}>
            <Provider store={store}>
              {children}
            </Provider>
          </SessionProvider>
        </ThemeProvider>
        <Modal show={showModal} onClose={() => setShowModal(false)} title="Error">
          <p>{errorMessage}</p>
        </Modal>
      </body>
    </html>
  );
}