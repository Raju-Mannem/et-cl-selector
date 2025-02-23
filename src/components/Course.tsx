import { GET_COURSES_BY_INSTITUTE } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

interface InstituteCodeProps {
  InstituteCode: string;
  setCurrentCourse: React.Dispatch<React.SetStateAction<CurrentCourseProps[]>>;
  currentCourse: CurrentCourseProps[];
}

interface CurrentCourseProps {
  instistute_code: string;
  branch_code: string;
  convener_seats: string;
  fee: string;
  District: string;
  minority: string;
}

const Course = ({ InstituteCode, setCurrentCourse }: InstituteCodeProps) => {
  const { data, loading, error } = useQuery(GET_COURSES_BY_INSTITUTE, {
    variables: { institute_code: InstituteCode },
  });

  function handleSelectedCourse(currentCourse: CurrentCourseProps) {
    setCurrentCourse((prevSelectedCourses) => [...prevSelectedCourses, currentCourse]);
    alert("Course was added");
  }

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
        <strong className="text-2xl font-sans">Loading............</strong>
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
      <strong className="mb-4 text-red-500">Institute code: {InstituteCode}</strong>
      <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
        <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
          <tr>
            <th className="border border-gray-300 text-center p-2">Select</th>
            <th className="border border-gray-300 text-center p-2">S.NO</th>
            <th className="border border-gray-300 text-center p-2">Branch Code</th>
            <th className="border border-gray-300 text-center p-2">Convener Seats</th>
            <th className="border border-gray-300 text-center p-2">Fee</th>
            <th className="border border-gray-300 text-center p-2">District Minority</th>
          </tr>
        </thead>
        <tbody className="text-neutral-900">
          {data && data.getCoursesByInstitute && Array.isArray(data.getCoursesByInstitute) ? (
            data.getCoursesByInstitute.map((crs: CurrentCourseProps) => (
              <tr key={crs.branch_code} className="hover:bg-stone-50 hover:text-blue-500 h-4">
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
                <td className="border border-gray-300 py-2 text-center">{crs.branch_code}</td>
                <td className="border border-gray-300 p-2 text-center">{crs.branch_code}</td>
                <td className="border border-gray-300 p-2 text-center">{crs.convener_seats}</td>
                <td className="border border-gray-300 p-2 text-center">{crs.fee}</td>
                <td className="border border-gray-300 p-2 text-center">{crs.minority}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No courses found</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default Course;
