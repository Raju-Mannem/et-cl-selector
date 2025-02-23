"use client";
import { GET_ALL_COLLEGES } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import Course from "./Course";

interface CurrentCourseProps {
  instistute_code: string;
  branch_code: string;
  convener_seats: string;
  fee: string;
  District: string;
  minority: string;
}

const Colleges = () => {
  const { data, loading, error } = useQuery(GET_ALL_COLLEGES, {
    errorPolicy: "all",
  });
  const clType = ["PVT", "Private University", "SF", "UNIV"];
  const [currentInstituteCode, setCurrentInstituteCode] = useState<string | undefined>(undefined);
  const clTypeColor = [
    "bg-green-200",
    "bg-amber-500",
    "bg-red-400",
    "bg-neutral-50",
  ];
  const [currentCourse, setCurrentCourse] = useState<CurrentCourseProps[]>([]);

  const handleCourse = (currentInstituteCode: string) => {
    setCurrentInstituteCode(currentInstituteCode);
  };

  const closeModal = () => {
    setCurrentInstituteCode(undefined);
  };

  if (loading)
    return (
      <section className="h-screen w-full bg-gray-100 flex justify-center items-center text-blue-500">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 w-16 h-16 animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </span>
        <strong className="text-2xl font-sans"> Loading............</strong>
      </section>
    );
  
  if (error)
    return (
      <section className="w-full h-full text-red-200 flex justify-center items-center text-red-500">
        <pre>
          Try again later:{" "}
          {error &&
            error.graphQLErrors.map(({ message }, i) => (
              <span key={i}>{message}</span>
            ))}
        </pre>
      </section>
    );

  return (
    <section className="flex justify-center items-center flex-col overflow-x-auto py-8 sm:py-12 sm:px-8">
      <article className="w-full h-full mb-4 p-2">
      </article>
      {currentInstituteCode && (
        <article className="fixed w-full h-full bg-stone-200">
          <aside className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 w-11/12 sm:w-8/12 lg:w-6/12 rounded-md">
              <button
                onClick={closeModal}
                className="text-2xl text-red-500 bg-stone-50 rounded-full px-4 py-2"
              >
                &times;
              </button>
              <Course
                InstituteCode={currentInstituteCode}
                setCurrentCourse={setCurrentCourse}
                currentCourse={currentCourse}
              />
            </div>
          </aside>
        </article>
      )}
    </section>
  );
};

export default Colleges;
