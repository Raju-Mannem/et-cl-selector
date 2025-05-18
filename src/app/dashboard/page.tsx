"use client";
import { useState } from "react";
import Colleges from "@/components/Colleges";
import College from "@/components/College";
import Cutoff2023 from "@/components/Cutoff2023";

const Dashboard = () => {
  const [selectType, setSelectType] = useState<string>("");
  const handleSelect = (option: string) => {
    setSelectType(option);
  };
  return (
    <main className="h-full w-full px-2">
      <section className="flex justify-end gap-4 items-center px-12 py-4 my-4 text-[8px] sm:text-sm font-sans bg-indigo-200">
        <article className="px-2 bg-stone-50 rounded-sm">
          <button
            onClick={() => handleSelect("colleges")}
            className="focus:outline-0"
          >
            Colleges
          </button>
        </article>
        <article className="px-2 bg-stone-50 rounded-sm">
          <button
            onClick={() => handleSelect("courses")}
            className="focus:outline-0"
          >
            Courses
          </button>
        </article>
        <article className="px-2 bg-stone-50 rounded-sm">
          <button
            onClick={() => handleSelect("cutoff2023")}
            className="focus:outline-0"
          >
            Cutoff 2023
          </button>
        </article>
      </section>
      {selectType === "courses" ? (
        <Colleges />
      ) : selectType === "colleges" ? (
        <College />
      ) : (
        <Cutoff2023 />
      )}
    </main>
  );
};

export default Dashboard;
