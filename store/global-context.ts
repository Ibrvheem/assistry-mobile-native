"use client";
import { StudentData } from "@/app/(auth)/types";
import constate from "constate";
import { useEffect, useState } from "react";

function useGlobalStore() {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentData>();

  useEffect(() => {}, []);

  return {
    studentData,
    setStudentData,
  };
}

export const [GlobalStoreProvider, useGobalStoreContext] =
  constate(useGlobalStore);
