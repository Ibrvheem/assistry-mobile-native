"use client";
import { StudentData, UserDataSchema } from "@/app/(auth)/types";
import constate from "constate";
import { useEffect, useState } from "react";

function useGlobalStore() {
  const [loading, setLoading] = useState(true);
  //Used to store student data before they finish registration on the app
  const [studentData, setStudentData] = useState<StudentData>();

  //Used to store user Data after successful login
  const [userData, setUserData] = useState<UserDataSchema>();

  useEffect(() => {}, []);

  return {
    studentData,
    setStudentData,
    userData,
    setUserData,
  };
}

export const [GlobalStoreProvider, useGobalStoreContext] =
  constate(useGlobalStore);
