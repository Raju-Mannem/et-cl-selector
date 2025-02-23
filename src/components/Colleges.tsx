"use client";
import { GET_ALL_COLLEGES } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import Course from "./Course";

export interface CurrentCourseProps {
  institute_code: string | String;
  branch_code: string;
  convener_seats: string;
  fee: string;
  District: string;
  minority: string;
}

interface College {
  sno: number;
  institute_code: string;
  institute_name: string;
  place: string;
  district_name: string;
  region: string;
  college_type: string;
  minority: string;
  co_educ: string;
  affiliated_to: string;
}

interface GetAllCollegesData {
  getColleges?: College[];
}

const Colleges = () => {
  const { data, loading, error } = useQuery<GetAllCollegesData>(
    GET_ALL_COLLEGES,
    {
      errorPolicy: "all",
    }
  );
  const clType = ["PVT", "Private University", "SF", "UNIV"];
  const [currentInstituteCode, setCurrentInstituteCode] = useState<
    string | undefined
  >(undefined);
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
        <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
          <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
            <tr>
              <th className="border border-gray-300  text-center p-2">S.NO</th>
              <th className="border border-gray-300  text-center p-2">
                Institute Code
              </th>
              <th className="border border-gray-300  text-center p-2">
                Course Course
              </th>
              <th className="border border-gray-300  text-center p-2">Seats</th>
              <th className="border border-gray-300  text-center p-2">
                Convener Fee
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-900">
            {currentCourse.length > 0 ? (
              currentCourse.map((selectedCrs, crCnt = 0) => (
                <tr
                  key={crCnt}
                  className="hover:bg-stone-50 hover:text-blue-500 h-4"
                >
                  <td className="border border-gray-300 p-2 text-center">
                    {crCnt + 1}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {selectedCrs.institute_code}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {selectedCrs.branch_code}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {selectedCrs.convener_seats}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {selectedCrs.fee}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-2"><strong>No courses selected</strong></td>
              </tr>
            )}
          </tbody>
        </table>
      </article>
      <article className="w-full h-full">
        <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
          <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
            <tr>
              <th className="border border-gray-300 text-center py-2 w-xs">
                S.NO
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Institute Code
              </th>
              <th className="border border-gray-300 pl-2 py-2 w-lg text-left">
                Institute Name
              </th>
              <th className="border border-gray-300 pl-2 py-2 w-xs text-left break-all">
                Place
              </th>
              <th className="border border-gray-300 text-center py-2 w-sm">
                District Name
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Region
              </th>
              <th className="border border-gray-300 text-center py-2 w-sm">
                College Type
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Minority
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Co-Educ
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Affiliated To
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-900">
            {data?.getColleges && Array.isArray(data.getColleges) ? (
              data.getColleges.map((clg) => (
                <tr
                  key={clg.sno}
                  className={`hover:bg-stone-50 hover:text-blue-500 ${
                    clTypeColor[
                      clType.findIndex((type) => type === clg.college_type)
                    ]
                  } h-4`}
                >
                  <td className="border border-gray-300 py-2 text-center">
                    <button
                      onClick={() => handleCourse(clg.institute_code)}
                      className="flex justify-center items-center gap-1 w-full h-full"
                    >
                      {clg.sno}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-1 sm:size-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="border border-gray-300 py-2 text-center max-w-min">
                    {clg.institute_code}
                  </td>
                  <td className="border border-gray-300 pl-2 py-2 ">
                    {clg.institute_name}
                  </td>
                  <td className="border border-gray-300 pl-2 py-2 break-all">
                    {clg.place}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.district_name}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.region}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.college_type}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.minority}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.co_educ}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.affiliated_to}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>No colleges found</td>
              </tr>
            )}
          </tbody>
        </table>
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
              />
            </div>
          </aside>
        </article>
      )}
    </section>
  );
};

export default Colleges;
