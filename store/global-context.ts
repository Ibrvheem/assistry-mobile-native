// "use client";
// import { StudentData, UserDataSchema } from "@/app/(auth)/types";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import constate from "constate";
// import { useEffect, useState } from "react";

// function useGlobalStore() {
//   const [loading, setLoading] = useState(true);
//   //Used to store student data before they finish registration on the app
//   const [studentData, setStudentData] = useState<StudentData>();

//   //Used to store user Data after successful login
//   const [userData, setUserData] = useState<UserDataSchema>();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const userDataString = await AsyncStorage.getItem("userData");
//       if (userDataString) {
//         setUserData(JSON.parse(userDataString));
//       }
//     };

//     fetchUserData();
//   }, []);
//   return {
//     studentData,
//     setStudentData,
//     userData,
//     setUserData,
//   };
// }

// export const [GlobalStoreProvider, useGobalStoreContext] =
//   constate(useGlobalStore);

"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import constate from "constate";
import { useEffect, useState, useCallback } from "react";
import type { StudentData, UserDataSchema } from "@/app/(auth)/types";

/**
 * Global store for managing user and student state
 * - Persists userData in AsyncStorage
 * - Provides refreshUser() for reloading persisted user data
 */
function useGlobalStore() {
  const [loading, setLoading] = useState<boolean>(true);
  const [studentData, setStudentData] = useState<StudentData | undefined>();
  const [userData, setUserData] = useState<UserDataSchema | undefined>();

  /** Load persisted user data on mount */
  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  /**
   * Refresh userData from AsyncStorage (for use after login or edit profile)
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const parsed = JSON.parse(userDataString);
        setUserData(parsed);
      } else {
        setUserData(undefined);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  }, []);

  /**
   * Persist user data manually (optional helper)
   */
  const saveUserData = useCallback(async (data: UserDataSchema): Promise<void> => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(data));
      setUserData(data);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }, []);

  return {
    loading,
    studentData,
    setStudentData,
    userData,
    setUserData,
    refreshUser, // ✅ now defined
    saveUserData, // ✅ helper to persist user manually
  };
}

export const [GlobalStoreProvider, useGobalStoreContext] =
  constate(useGlobalStore);
