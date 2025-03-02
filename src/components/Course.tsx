import { GET_COURSES_BY_INSTITUTE } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { CurrentCourseProps } from "./Colleges";
import React from "react";

interface CourseProps {
  branch_code: string;
  convener_seats: string;
  fee: string;
  minority: string;
  institute_code: string;
  District: string;
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


interface GetCoursesByInstituteData {
  getCoursesByInstitute?: CourseProps[];
}

interface InstituteCodeProps {
  InstituteCode: string;
  setCurrentCourse: React.Dispatch<React.SetStateAction<CurrentCourseProps[]>>;
  currentInstitute : College;
}

const Course = ({ InstituteCode, setCurrentCourse, currentInstitute }: InstituteCodeProps) => {
  const { data, loading, error } = useQuery<GetCoursesByInstituteData>(
    GET_COURSES_BY_INSTITUTE,
    {
      variables: { institute_code: InstituteCode },
    }
  );

  const handleSelectedCourse = (course: CourseProps) => {
    setCurrentCourse((prevSelectedCourses) => [
      ...prevSelectedCourses,
      {
        institute_code: currentInstitute["institute_code"],
        branch_code: course.branch_code,
        institute_name: currentInstitute["institute_name"],
        district_name: currentInstitute["district_name"],
        place: currentInstitute["place"],
        region: currentInstitute["region"],
        co_educ: currentInstitute["co_educ"],
        college_type: currentInstitute["college_type"],
        affiliated_to: currentInstitute["affiliated_to"],
      },
    ]);
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
          course error
        </pre>
      </section>
    );
    
  return (
    <section className="flex justify-center items-center flex-col overflow-x-auto py-8 sm:py-12 sm:px-8">
      <strong className="mb-4 text-red-500">
        Institute code: {InstituteCode}
      </strong>
      <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
        <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
          <tr>
            <th className="border border-gray-300 text-center p-2">Select</th>
            <th className="border border-gray-300 text-center p-2">S.NO</th>
            <th className="border border-gray-300 text-center p-2">
              branch_code
            </th>
            <th className="border border-gray-300 text-center p-2">
              convener_seats
            </th>
            <th className="border border-gray-300 text-center p-2">fee</th>
            <th className="border border-gray-300 text-center p-2">
              District minority
            </th>
          </tr>
        </thead>
        <tbody className="text-neutral-900">
          {data?.getCoursesByInstitute &&
          Array.isArray(data.getCoursesByInstitute) ? (
            data.getCoursesByInstitute.map((crs, index) => (
              <tr
                key={index}
                className="hover:bg-stone-50 hover:text-blue-500 h-4"
              >
                <td className="border border-gray-300 text-red-500 flex justify-center items-center py-2">
                  <button
                    className="h-full w-full flex justify-center"
                    onClick={() => handleSelectedCourse(crs)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="size-1 sm:size-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {crs.branch_code}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {crs.convener_seats}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {crs.fee}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {crs.minority}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10}>No Courses found</td>
            </tr>
          )}
        </tbody>
      </table>
      <span></span>
    </section>
  );
};

export default Course;
