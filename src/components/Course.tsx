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

interface GetCoursesByInstituteData {
    getCoursesByInstitute?: CourseProps[];
}

interface InstituteCodeProps {
    InstituteCode: string;
    setCurrentCourse: React.Dispatch<React.SetStateAction<CurrentCourseProps[]>>;
}

const Course = ({ InstituteCode, setCurrentCourse }: InstituteCodeProps) => {
    const { data, loading, error } = useQuery<GetCoursesByInstituteData>(GET_COURSES_BY_INSTITUTE, {
        variables: { institute_code: InstituteCode },
    });

    const handleSelectedCourse = (course: CourseProps) => {
        setCurrentCourse((prevSelectedCourses) => [...prevSelectedCourses, course as CurrentCourseProps]);
        alert("Course was added");
    };

    if (loading) {
        return (
            <section className="h-screen w-full bg-gray-100 flex justify-center items-center text-blue-500">
                <strong className="text-2xl font-sans"> Loading............</strong>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full h-full text-red-200 flex justify-center items-center text-red-500">
                <pre>
                    Try again later: {error.graphQLErrors?.map(({ message }, i) => <span key={i}>{message}</span>)}
                    {JSON.stringify(error)} course error
                </pre>
            </section>
        );
    }

    return (
        <section className="flex justify-center items-center flex-col overflow-x-auto py-8 sm:py-12 sm:px-8">
            <strong className="mb-4 text-red-500">Institute code: {InstituteCode}</strong>
            <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
                <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
                    <tr>
                        <th className="border border-gray-300 text-center p-2">Select</th>
                        <th className="border border-gray-300 text-center p-2">S.NO</th>
                        <th className="border border-gray-300 text-center p-2">branch_code</th>
                        <th className="border border-gray-300 text-center p-2">convener_seats</th>
                        <th className="border border-gray-300 text-center p-2">fee</th>
                        <th className="border border-gray-300 text-center p-2">District minority</th>
                    </tr>
                </thead>
                <tbody className="text-neutral-900">
                    {data?.getCoursesByInstitute && Array.isArray(data.getCoursesByInstitute) ? (
                        data.getCoursesByInstitute.map((crs, index) => (
                            <tr key={index} className="hover:bg-stone-50 hover:text-blue-500 h-4">
                                <td className="border border-gray-300 text-red-500 flex justify-center items-center py-2">
                                    <button className="h-full w-full flex justify-center" onClick={() => handleSelectedCourse(crs)}>
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
                                <td className="border border-gray-300 py-2 text-center">{index + 1}</td>
                                <td className="border border-gray-300 p-2 text-center">{crs.branch_code}</td>
                                <td className="border border-gray-300 p-2 text-center">{crs.convener_seats}</td>
                                <td className="border border-gray-300 p-2 text-center">{crs.fee}</td>
                                <td className="border border-gray-300 p-2 text-center">{crs.minority}</td>
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
