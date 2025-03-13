"use client";
import { GET_ALL_COLLEGES } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable';

interface CollegeProps {
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
  getColleges?: CollegeProps[];
}

const College = () => {
  const { data, loading, error } = useQuery<GetAllCollegesData>(
    GET_ALL_COLLEGES,
    {
      errorPolicy: "all",
    }
  );
  const clType = ["PVT", "Private University", "SF", "UNIV"];

  const clTypeColor = [
    "bg-green-200",
    "bg-amber-500",
    "bg-red-400",
    "bg-neutral-50",
  ];
  const [currentCollege, setCurrentCollege] = useState<CollegeProps[]>([]);

   const handlePDF = () => {
    const doc = new jsPDF();
    const imgURL = "/EAMCET INSTRUCTIONS_page-0001.jpg";
    doc.addImage(imgURL, "PNG", 5, 10, 200, 250);  
    
    doc.addPage("p");
    
    const tableData = currentCollege.map((clg, index) => [
      index+1,
      clg.institute_code,
      clg.institute_name,
      clg.place,
      clg.district_name,
      clg.region,
      clg.co_educ,
      clg.college_type,
      clg.affiliated_to,
    ]);
    const tableColumn = [
      "S.NO", "Institute Code", "Institute Name", "Place", "District", "Region",
      "Co-Educ", "College Type", "Affiliated To"
    ];
    autoTable(doc,{
      head: [tableColumn],
      body: tableData,
      margin: { top: 10 },
      styles: { fontSize: 4 },
      columnStyles: {
        2: { cellWidth: 'auto', halign: 'left' },
        0: { halign: 'center' },
        1: { halign: 'center' },
        3: { halign: 'left' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center' },
        8: { halign: 'center' }, 
        
      },
      theme: 'grid',
    });
  
    doc.save("eamcet-master-ap-colleges.pdf");
  };

  const handleCollege = (selectedCollege: CollegeProps) => {
    const collegeExists = currentCollege.some(
      (college) => college.institute_code === selectedCollege.institute_code
    );
    if (collegeExists) {
      alert("college already existed");
    }
    else{
    setCurrentCollege((prevColleges) => [
      ...prevColleges,
      selectedCollege as CollegeProps,
    ]);
  }
  };

  const handlePosition = (currentKey:number,action:string) => {
    if(currentKey<currentCollege.length-1){
      if(action=='up' && currentKey>0){
        const updatedColleges = [...currentCollege];
        const temp = updatedColleges[currentKey - 1];
        updatedColleges[currentKey - 1] = updatedColleges[currentKey];
        updatedColleges[currentKey] = temp;
        setCurrentCollege(updatedColleges);
      }
      else{
        const updatedColleges = [...currentCollege];
        const temp = updatedColleges[currentKey + 1];
        updatedColleges[currentKey + 1] = updatedColleges[currentKey];
        updatedColleges[currentKey] = temp;
        setCurrentCollege(updatedColleges);
      }
    }
    else{
      alert("out of position can't update");
    }
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
              <th className="border border-gray-300 pl-2 py-2 w-xs  text-left py-2 break-all">
                Place
              </th>
              <th className="border border-gray-300 text-center w-sm">
                District
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Region
              </th>
              <th className="border border-gray-300 text-center py-2 w-sm">
                Co-Educ
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                College Type
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Affiliated To
              </th>
            </tr>
          </thead>
          <tbody className="text-neutral-900">
            {currentCollege.length > 0 && Array.isArray(currentCollege) ? (
              currentCollege.map((clg, index) => (
                <tr
                  key={index+1}
                  className={`hover:bg-stone-50 hover:text-blue-500 h-4 ${index % 2 != 0 ? 'bg-gray-100' : ''}`}
                >
                  <td className="border border-gray-300 py-2 text-center flex justify-center items-center gap-1">
                    {index+1}
                    <span className="flex items-center justify-center flex-col gap-1">
                      <button 
                        className="hover:bg-emerald-700 rounded-full hover:text-stone-50"
                        onClick={()=>handlePosition(index,'up')}
                        >
                          ↑
                        </button>
                        <button 
                          className="hover:bg-emerald-700 rounded-full hover:text-stone-50"
                          onClick={()=>handlePosition(index,'down')}
                        >
                          ↓
                      </button>
                    </span>
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
                    {clg.co_educ}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.college_type}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.affiliated_to}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan={10} className="text-center p-2"><strong>No Colleges selected</strong></td>
              </tr>
            )}
            <tr className="text-center">
            <td colSpan={10} className="text-center p-2 border-t">
                    <button 
                      onClick={()=>handlePDF()}
                      className="bg-emerald-700 px-4 py-2 rounded"
                    >
                      <strong className="text-stone-50">print </strong>
                      
                    </button>
                  </td>
            </tr>
          </tbody>
        </table>
      </article>
      <article className="w-full h-full my-4">
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
                District
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Region
              </th>
              <th className="border border-gray-300 text-center py-2 w-sm">
                Co-Educ
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                Minority
              </th>
              <th className="border border-gray-300 text-center py-2 w-xs">
                College Type
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
                      onClick={() => handleCollege(clg)}
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
                  <td className="border border-gray-300 py-2 text-center ">
                    {clg.district_name}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.region}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.co_educ}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.minority}
                  </td>
                  <td className="border border-gray-300 py-2 text-center">
                    {clg.college_type}
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
    </section>
  );
};

export default College;
