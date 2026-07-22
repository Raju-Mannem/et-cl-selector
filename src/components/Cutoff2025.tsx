"use client";
import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_AP_CUTOFFS_2025_BY_RANK } from "../graphql/queries";
import { districtOptions } from "../data/districts";
import { casteOptions2025 } from "../data/caste";
import { branchOptions } from "../data/branch";
import { instituteOptions } from "../data/institute";
import { clgTypeOptions } from "../data/clgtype";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { toast } from "sonner";
import SearchableMultiSelect from "./SearchableMultiSelect";
import { useMemo } from "react";

// interface apCutoffData {
//   __typename: string;
//   sno: string;
//   inst_code: string;
// }

// interface apCutoff2025PdfData {
//   sno: number;
//   inst_code: string;
//   inst_name: string;
//   branch_code: string;
//   branch_name: string;
//   dist_code: string;
//   distName: string;
//   place: string;
// }

export interface CutoffRow {
  sno: number;
  inst_code: string;
  inst_name: string;
  branch_code: string;
  branch_name: string;
  dist_code: string;
  local_area: string;
  college_type: string;
  inst_reg: string;
  priority: number;
  dynamicCastes?: {
    [key: string]: number | null;
  };
}

type ColumnKey =
  | "sno"
  | "inst_code"
  | "inst_name"
  | "branch_code"
  | "branch_name"
  | "type"
  | "dist_code"
  | "local_area"
  | "inst_reg"
  | "priority"
  | string;

const Cutoff2025 = () => {
  const [minRank, setMinRank] = useState("");
  const [maxRank, setMaxRank] = useState("");
  const [selectedCastes, setSelectedCastes] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedInstitutes, setSelectedInstitutes] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>("priority");
  const [collegeType, setCollegeType] = useState<string[]>([]);
  // const [instCodes, setInstCodes] = useState<string[]>([]);
  const [studentInfo, setStudentInfo] = useState({
    student_name: "",
    student_rank: "",
    student_caste: "",
  });

  const [selectedStudentDetails, setSelectedStudentDetails] = useState([
    "student_name",
    "student_rank",
    "student_caste",
  ]);

  const [result, setResult] = useState<CutoffRow[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<ColumnKey[]>([
    "sno",
    "inst_code",
    "inst_name",
    "branch_code",
    "branch_name",
  ]);

  const [rangeDelete, setRangeDelete] = useState({
    min: "",
    max: "",
  });

  const studentFields = [
    {
      key: "student_name",
      label: "Student Name",
      type: "text",
      placeholder: "Student Name",
    },
    {
      key: "student_rank",
      label: "Student Rank",
      type: "number",
      placeholder: "Rank",
    },
    {
      key: "student_caste",
      label: "Student Caste",
      type: "text",
      placeholder: "Caste",
    },
  ];

  const pdfSelectableColumns = [
    { label: "S.NO", value: "sno" },
    { label: "College Code", value: "inst_code" },
    { label: "College Name", value: "inst_name" },
    { label: "Branch Code", value: "branch_code" },
    { label: "Branch Name", value: "branch_name" },
    { label: "District Code", value: "dist_code" },
    { label: "Local Area", value: "local_area" },
    { label: "Inst Reg", value: "inst_reg" },
    { label: "College Type", value: "college_type" },
    { label: "Priority", value: "priority" },

    ...selectedCastes.map((caste) => ({
      label: caste,
      value: caste,
    })),
  ];

  const [fetchCutoffs, { data, loading, error }] = useLazyQuery(
    GET_AP_CUTOFFS_2025_BY_RANK,
    { errorPolicy: "all" },
  );

  useEffect(() => {
    if (data?.apCutoff2025sByRank) {
      setResult(data.apCutoff2025sByRank);
    }
  }, [data]);

  const duplicateKeys = useMemo(() => {
    const counts = new Map<string, number>();

    result.forEach((row) => {
      const key = `${row.inst_code}-${row.branch_code}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return counts;
  }, [result]);

  useEffect(() => {
    if (
      selectedOrder !== "priority" &&
      !selectedCastes.includes(selectedOrder)
    ) {
      setSelectedOrder("priority");
    }
  }, [selectedCastes, selectedOrder]);

  const orderOptions = useMemo(
    () => [
      { label: "Priority", value: "priority" },
      ...selectedCastes.map((caste) => ({
        label: caste,
        value: caste,
      })),
    ],
    [selectedCastes],
  );

  const toggleStudentDetail = (key: string) => {
    setSelectedStudentDetails((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const handleStudentChange = (
    key: keyof typeof studentInfo,
    value: string,
  ) => {
    setStudentInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePDF = () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column");
      return;
    } else if (!studentInfo.student_name) {
      toast.error("invalid details");
    } else {
      const doc = new jsPDF();
      /** 
    const imgURL = "/EAMCET INSTRUCTIONS_page-0001.jpg";
    doc.addImage(imgURL, "PNG", 5, 10, 200, 250);  
    
    doc.addPage("p");
    **/

      // doc.text(
      //   `Name: ${stdName} | Rank: ${stdRank} | Caste: ${stdCaste}`,
      //   14,
      //   16
      // );

      const pdfColumns = pdfSelectableColumns.filter((c) =>
        selectedColumns.includes(c.value),
      );

      const tableData = result.map((row, index) => {
        const pdfRow: Record<string, any> = {};

        pdfColumns.forEach((column) => {
          if (column.value === "sno") {
            pdfRow.sno = index + 1;
          } else if (column.value in studentInfo) {
            pdfRow[column.value] =
              studentInfo[column.value as keyof typeof studentInfo];
          } else if (row.dynamicCastes?.hasOwnProperty(column.value)) {
            pdfRow[column.value] = row.dynamicCastes[column.value];
          } else {
            pdfRow[column.value] = (row as any)[column.value] ?? "-";
          }
        });

        return pdfRow;
      });

      const firstTableColumn = studentFields
        .filter((field) => selectedStudentDetails.includes(field.key))
        .map(
          (field) =>
            `${field.label}: ${
              studentInfo[field.key as keyof typeof studentInfo]
            }`,
        );

      const tableColumn = pdfColumns.map((col) => ({
        header: col.label,
        dataKey: col.value,
      }));

      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // navy blue
      doc.text("@Bestcareerguidance", pageWidth / 2, 14, {
        align: "center",
      });

      // 2nd line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(37, 150, 190); //
      doc.text("Mentorship: 8179406281", pageWidth / 2, 24, {
        align: "center",
      });

      autoTable(doc, {
        head: [firstTableColumn],
        startY: 34,
        margin: { top: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          font: "helvetica",
          // textColor: [40, 40, 40],
          // lineColor: [44, 62, 80],
          // lineWidth: 0.2,
          valign: "middle",
          halign: "center",
        },
        headStyles: {
          fillColor: [249, 250, 251], // #f9fafb
          textColor: [30, 41, 59], // slate-800 (premium dark gray)
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fillColor: [249, 250, 251],
        },
        columnStyles: {
          0: { halign: "center", fontStyle: "bold" }, // first column centered and bold
          1: { halign: "center" },
        },
        theme: "plain", // plain to avoid built-in styling interference
      });

      autoTable(doc, {
        head: [tableColumn.map((c) => c.header)],
        body: tableData.map((row) =>
          tableColumn.map((col) => row[col.dataKey]),
        ),
        startY: 54,
        theme: "grid",
        margin: { top: 10, bottom: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 2,
          minCellHeight: 14,
          valign: "middle",
        },

        headStyles: {
          fillColor: [37, 150, 190],
          textColor: [255, 255, 255], // white
          fontStyle: "bold",
          halign: "center",
        },
        didParseCell: function (data) {
          if (data.section === "body") {
            const raw = data.row.raw;
            if (
              typeof raw === "object" &&
              raw !== null &&
              "co_education" in raw &&
              (raw as any).co_education === "GIRLS"
            ) {
              data.cell.styles.textColor = [233, 30, 99]; // Pink
            }
          }
        },
        didDrawPage: (data) => {
          const pageSize = doc.internal.pageSize;
          const pageWidth = pageSize.width || doc.internal.pageSize.getWidth();
          const pageHeight =
            pageSize.height || doc.internal.pageSize.getHeight();

          const footerText = "@Bestcareerguidance | Mentorship: 8179406281";

          const footerY = pageHeight - 6;

          // line above footer
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.2);
          doc.line(10, footerY - 6, pageWidth - 10, footerY - 4);

          // footer text
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          doc.text(footerText, pageWidth / 2, footerY, {
            align: "center",
          });
        },
      });

      doc.save(
        `${studentInfo.student_name}-${studentInfo.student_rank}-${studentInfo.student_caste}.pdf`,
      );
      toast.success(`pdf downloaded successfully`);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      Number(minRank) >= Number(maxRank) ||
      Number(minRank) < 0 ||
      selectedCastes.length < 1 ||
      selectedBranches.length < 1 ||
      selectedDistricts.length < 1
    ) {
      toast.error(`Invalid details, Please check details`);
    } else {
      const variables = {
        filter: {
          minRank: Number(minRank),
          maxRank: Number(maxRank),
          instituteNames: selectedInstitutes,
          casteColumns: selectedCastes,
          branchCodes: selectedBranches,
          distCodes: selectedDistricts,
          collegeType: collegeType,
          orderBy: selectedOrder,
        },
      };

      // console.log("Submitting filter:", variables);
      fetchCutoffs({ variables });
    }
  };

  const handleDelete = (sno: number) => {
    setResult((prevItems) => prevItems.filter((item) => item.sno !== sno));
  };

  const handleMoveRow = (index: number, direction: "up" | "down") => {
    setResult((prev) => {
      const newRows = [...prev];

      if (direction === "up" && index > 0) {
        [newRows[index - 1], newRows[index]] = [
          newRows[index],
          newRows[index - 1],
        ];
      }

      if (direction === "down" && index < newRows.length - 1) {
        [newRows[index], newRows[index + 1]] = [
          newRows[index + 1],
          newRows[index],
        ];
      }

      return newRows;
    });
  };

  const handleRangeDelete = (min: number, max: number) => {
    if (isNaN(min) || isNaN(max) || min < 1 || max < 1 || min > max) {
      toast.error("Invalid range");
      return;
    }

    setResult((prev) =>
      prev.filter((_, index) => {
        const rowNumber = index + 1;
        return rowNumber < min || rowNumber > max;
      }),
    );

    toast.success(`Deleted rows ${min} to ${max}`);

    setRangeDelete({
      min: "",
      max: "",
    });
  };

  return (
    <section className="bg-gray-50 flex justify-center items-center flex-col overflow-x-auto py-2 sm:py-4 sm:px-8 text-[6px] sm:text-[12px] font-sans">
      <article className="w-full h-full">
        <h1 className="text-xl text-center text-gray-500 bg-indigo-100 border-2 border-white mb-8 py-2 rounded-lg">
          2025 AP Cutoff
        </h1>
        <form
          className="flex justify-start flex-wrap items-start gap-2"
          onSubmit={handleSubmit}
        >
          <div className="basis-3/12 flex gap-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Minimum Rank
              </label>
              <input
                type="number"
                className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="minimum rank"
                value={minRank}
                onChange={(e) => setMinRank(e.target.value)}
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Maximum Rank
              </label>
              <input
                type="number"
                className="px-1 sm:px-3 py-1 sm:py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="maximum rank"
                value={maxRank}
                onChange={(e) => setMaxRank(e.target.value)}
                required
                min={0}
              />
            </div>
          </div>
          <SearchableMultiSelect
            title="Institute"
            options={instituteOptions}
            selectedValues={selectedInstitutes}
            setSelectedValues={setSelectedInstitutes}
          />
          <SearchableMultiSelect
            title="Branches"
            options={branchOptions}
            selectedValues={selectedBranches}
            setSelectedValues={setSelectedBranches}
          />
          <SearchableMultiSelect
            title="College Type"
            options={clgTypeOptions}
            selectedValues={collegeType}
            setSelectedValues={setCollegeType}
          />
          <SearchableMultiSelect
            title="Caste"
            options={casteOptions2025}
            selectedValues={selectedCastes}
            setSelectedValues={setSelectedCastes}
          />
          <SearchableMultiSelect
            title="District"
            options={districtOptions}
            selectedValues={selectedDistricts}
            setSelectedValues={setSelectedDistricts}
          />
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Order By
            </label>

            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="px-3 py-2 border border-indigo-100 bg-indigo-50 rounded"
            >
              {orderOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="justify-self-end basis-1/12 sm:ml-4 mt-2 sm:mt-6 bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            search
          </button>
        </form>
      </article>
      <article className="w-full h-full mt-20">
        <div className="mt-8 flex flex-wrap gap-6 items-end">
          {studentFields.map((field) => (
            <div key={field.key} className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>

              <div className="flex items-center gap-2">
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="px-3 py-2 border border-indigo-100 bg-indigo-50 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={studentInfo[field.key as keyof typeof studentInfo]}
                  onChange={(e) =>
                    handleStudentChange(
                      field.key as keyof typeof studentInfo,
                      e.target.value,
                    )
                  }
                />

                <input
                  type="checkbox"
                  checked={selectedStudentDetails.includes(field.key)}
                  onChange={() => toggleStudentDetail(field.key)}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handlePDF}
            className="bg-emerald-700 text-white px-4 py-2 rounded"
          >
            Print
          </button>
        </div>
        <div className="mt-4 bg-indigo-100 border-1 border-indigo-200 p-4 rounded-lg">
          <p className="font-semibold mb-2">Select Columns for PDF</p>

          <div className="flex flex-wrap gap-3">
            {pdfSelectableColumns.map((col, index) => (
              <label key={index + 1} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    setSelectedColumns((prev) =>
                      checked
                        ? [...prev, col.value]
                        : prev.filter((c) => c !== col.value),
                    );
                  }}
                />
                {col.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-8">
          {loading && (
            <div className="flex justify-center align-center gap-2 text-indigo-500 text-center">
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
              <span>
                <strong className="text-2xl font-sans">
                  {" "}
                  Loading............
                </strong>
              </span>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center">
              Error:{" "}
              {error.graphQLErrors.map(({ message }, i) => (
                <span key={i}>{message}</span>
              ))}
              {JSON.stringify(error)}
            </div>
          )}
          {/* {rowsLoading && (
            <div className="text-indigo-500 flex justify-center items-center">Loading Rows...</div>
          )} */}
          {/* {rowsError && (
            <div className="text-red-500 text-center">
              Error: {rowsError.message}
            </div>
          )} */}
          {data?.apCutoff2025sByRank?.length === 0 && (
            <div className="text-red-500 text-center py-12 border-t text-sm">
              No rows found for the selected institute codes.
            </div>
          )}
          {result?.length > 0 ? (
            <div className="overflow-x-auto mt-6">
              <div className="flex justify-left items-center gap-2 bg-indigo-50 my-4 w-max p-4 rounded-lg">
                <strong className="text-emerald-800">Range Delete: </strong>
                <input
                  type="number"
                  placeholder="min"
                  value={rangeDelete.min}
                  onChange={(e) =>
                    setRangeDelete((prev) => ({
                      ...prev,
                      min: e.target.value,
                    }))
                  }
                  className="w-[80px] px-2 py-2 border border-indigo-200 rounded focus:outline-none"
                  min={1}
                />

                <input
                  type="number"
                  placeholder="max"
                  value={rangeDelete.max}
                  onChange={(e) =>
                    setRangeDelete((prev) => ({
                      ...prev,
                      max: e.target.value,
                    }))
                  }
                  className="w-[80px] px-2 py-2 border border-indigo-200 rounded focus:outline-none"
                  min={1}
                />

                <button
                  type="button"
                  onClick={() =>
                    handleRangeDelete(
                      Number(rangeDelete.min),
                      Number(rangeDelete.max),
                    )
                  }
                  className="px-4 py-2 text-white font-semibold rounded bg-emerald-700 transition hover:bg-emerald-700/60"
                >
                  Delete
                </button>
              </div>
              <table className="min-w-full table-auto bg-white border border-collapse text-[4px] sm:text-[10px] font-sans">
                <thead className="bg-emerald-700 text-neutral-100 font-extrabold">
                  <tr className="">
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Move
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Sno
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      College Code
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-lg text-left">
                      College Name
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      Branch Code
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-lg text-left">
                      Branch Name
                    </th>
                    <th className="border border-gray-300 text-center py-2 w-xs">
                      District Code
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-xs  text-left py-2 break-all">
                      Local Area
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-xs  text-left py-2 break-all">
                      Inst Reg
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-xs  text-left py-2 break-all">
                      College Type
                    </th>
                    <th className="border border-gray-300 pl-2 py-2 w-xs  text-left py-2 break-all">
                      Priority
                    </th>
                    {selectedCastes.map((col) => (
                      <th
                        key={col}
                        className="border border-gray-300 text-center py-2 w-xs"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-neutral-900">
                  {result.map((row: CutoffRow, index: number) => {
                    const key = `${row.inst_code}-${row.branch_code}`;
                    const isDuplicate = (duplicateKeys.get(key) || 0) > 1;

                    return (
                      <tr
                        key={row.sno}
                        className={`hover:bg-stone-50 hover:text-blue-500 h-4  ${
                          isDuplicate
                            ? "bg-rose-600 text-white"
                            : index % 2 !== 0
                              ? "bg-gray-100"
                              : ""
                        }
      `}
                      >
                        <td className="border border-gray-300 py-2 text-center max-w-min">
                          <div className="flex flex-col items-center justify-center gap-1 p-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveRow(index, "up")}
                              className="px-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              disabled={index === result.length - 1}
                              onClick={() => handleMoveRow(index, "down")}
                              className="px-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
                            >
                              ↓
                            </button>
                          </div>
                        </td>
                        <td className="border border-gray-300 py-2 text-center max-w-min">
                          <button
                            className="flex justify-center items-center gap-1 w-full h-full"
                            onClick={() => handleDelete(row.sno)}
                          >
                            {index + 1}
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
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="border border-gray-300 py-2 text-center max-w-min">
                          {row.inst_code}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2">
                          {row.inst_name}
                        </td>
                        <td className="border border-gray-300 py-2 text-center max-w-min">
                          {row.branch_code}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2">
                          {row.branch_name}
                        </td>
                        <td className="border border-gray-300 py-2 text-center max-w-min">
                          {row.dist_code}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2 break-all">
                          {row.local_area}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2 break-all">
                          {row.inst_reg}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2 break-all">
                          {row.college_type}
                        </td>
                        <td className="border border-gray-300 pl-2 py-2 break-all">
                          {row.priority}
                        </td>
                        {selectedCastes.map((col) => (
                          <td
                            key={col}
                            className="border border-gray-300 py-2 text-center max-w-min"
                          >
                            {row.dynamicCastes?.[col] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-32 border-t-2 border-indigo-200-200 text-gray-500 text-center text-[24px]">
              Enter details
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default Cutoff2025;
