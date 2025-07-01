import { Context } from "../pages/api/graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Decimal } from "@prisma/client/runtime/library";

function toNumber(
  val: Decimal | number | string | null | undefined
): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") {
    return isFinite(val) ? val : null;
  }
  if (
    typeof val === "object" &&
    val !== null &&
    "toNumber" in val &&
    typeof (val as any).toNumber === "function"
  ) {
    try {
      const num = (val as Decimal).toNumber();
      return isFinite(num) ? num : null;
    } catch {
      return null;
    }
  }
  if (typeof val === "string") {
    const num = Number(val);
    return isFinite(num) ? num : null;
  }
  return null;
}

// JSON Scalar for dynamic fields
const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "Arbitrary JSON value",
  parseValue: (value) => value,
  serialize: (value) => value,
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT: {
        const value = Object.create(null);
        ast.fields.forEach((field) => {
          value[field.name.value] = this.parseLiteral!(field.value);
        });
        return value;
      }
      case Kind.LIST:
        return ast.values.map((n) => this.parseLiteral!(n));
      default:
        return null;
    }
  },
});

const resolvers = {
  JSON: JSONScalar,
  Query: {
    getColleges: async (_parent: any, _args: any, context: Context) => {
      return await context.prisma.college.findMany();
    },
    getCollege: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.college.findUnique({
        where: { institute_code: args.institute_code },
        include: { courses: true },
      });
    },
    getCoursesByInstitute: async (
      _parent: any,
      args: any,
      context: Context
    ) => {
      return await context.prisma.course.findMany({
        where: { institute_code: args.institute_code },
      });
    },
    apCutoff2023s: async (
      _parent: any,
      args: { limit?: number; offset?: number },
      context: Context
    ) => {
      const limit = args.limit ?? 50;
      const offset = args.offset ?? 0;

      const [rows, totalCount] = await Promise.all([
        context.prisma.ap_cutoff_2023.findMany({
          skip: offset,
          take: limit,
          orderBy: { sno: "asc" }, // Or any other ordering you prefer
        }),
        context.prisma.ap_cutoff_2023.count(),
      ]);

      return { rows, totalCount };
    },
    apCutoff2023: async (
      _parent: any,
      args: { sno: number },
      context: Context
    ) => {
      return await context.prisma.ap_cutoff_2023.findUnique({
        where: { sno: args.sno },
      });
    },
    apCutoff2023sByInstCodes: async (
      _parent: any,
      args: { inst_codes: string[] },
      context: Context
    ) => {
      return await context.prisma.ap_cutoff_2023.findMany({
        where: {
          inst_code: { in: args.inst_codes },
        },
      });
    },
    apCutoff2023sByRank: async (
      __parent: any,
      args: { filter: any },
      context: Context
    ) => {
      const { minRank, maxRank, branchCodes, casteColumns, distCodes, coEdu } =
        args.filter;

        const whereClause: any = {
          branch_code: { in: branchCodes },
          dist_code: { in: distCodes },
          ...(coEdu && { co_education: "GIRLS" }),
        };

      // 1. Fetch all rows for selected districts
      const rows = await context.prisma.ap_cutoff_2023.findMany({
        where: whereClause,
        orderBy: {
          priority: "asc",
        },
      });

      // console.log("Rows from DB:", rows.length);
      // if (rows.length > 0) {
      //   console.log("Sample row:", rows[0]);
      //   console.log("Caste columns requested:", casteColumns);
      //   console.log("Min/Max rank:", minRank, maxRank);
      // }

      // 2. Filter rows: ALL selected caste columns must be within [minRank, maxRank]
      const filteredRows = rows.filter((row) =>
        casteColumns.every((col: any) => {
          const rawValue = row[col as keyof typeof row];
          if (rawValue === null || rawValue === undefined) return false;
          const value = toNumber(rawValue);
          return value! >= minRank && value! <= maxRank;
        })
      );
      // console.log('Filtered rows:', filteredRows.length);

      // ✅ 3. Create a branch code order map for fast lookup
      const branchOrderMap = new Map<string, number>(
        branchCodes.map((code: string, index: number) => [code, index])
      );

      const sortedRows = filteredRows.sort((a, b) => {
        // priority is Int? (number | null)
        const priorityA = a.priority ?? 0;
        const priorityB = b.priority ?? 0;
        const priorityDiff = priorityA - priorityB;
        if (priorityDiff !== 0) return priorityDiff;
        const branchAOrder =
          branchOrderMap.get(a.branch_code ?? "") ?? Number.MAX_SAFE_INTEGER;
        const branchBOrder =
          branchOrderMap.get(b.branch_code ?? "") ?? Number.MAX_SAFE_INTEGER;
        return branchAOrder - branchBOrder;
      });

      // 4. Map to result
      return sortedRows.map((row) => ({
        sno: row.sno,
        inst_code: row.inst_code,
        institute_name: row.institute_name,
        place: row.place,
        dist_code: row.dist_code,
        branch_code: row.branch_code,
        branch_name: row.branch_name,
        co_education: row.co_education,
        dynamicCastes: Object.fromEntries(
          casteColumns.map((col: any) => [col, row[col as keyof typeof row]])
        ),
      }));
    },
    apCutoff2024sByRank: async (
      __parent: any,
      args: { filter: any },
      context: Context
    ) => {
      const { minRank, maxRank, branchCodes, casteColumns, distCodes, coEdu } =
        args.filter;

        const whereClause: any = {
          branch_code: { in: branchCodes },
          dist_code: { in: distCodes },
          ...(coEdu && { co_education: "GIRLS" }),
        };

      // 1. Fetch all rows for selected districts
      const rows = await context.prisma.ap_cutoff_2024.findMany({
        where: whereClause,
        orderBy: {
          priority: "asc",
        },
      });

      // console.log("Rows from DB:", rows.length);
      // if (rows.length > 0) {
      //   console.log("Sample row:", rows[0]);
      //   console.log("Caste columns requested:", casteColumns);
      //   console.log("Min/Max rank:", minRank, maxRank);
      // }

      // 2. Filter rows: ALL selected caste columns must be within [minRank, maxRank]
      const filteredRows = rows.filter((row) =>
        casteColumns.every((col: any) => {
          const rawValue = row[col as keyof typeof row];
          if (rawValue === null || rawValue === undefined) return false;
          const value = toNumber(rawValue);
          return value! >= minRank && value! <= maxRank;
        })
      );
      // console.log('Filtered rows:', filteredRows.length);

      // ✅ 3. Create a branch code order map for fast lookup
      const branchOrderMap = new Map<string, number>(
        branchCodes.map((code: string, index: number) => [code, index])
      );

      const sortedRows = filteredRows.sort((a, b) => {
        // priority is Int? (number | null)
        const priorityA = a.priority ?? 0;
        const priorityB = b.priority ?? 0;
        const priorityDiff = priorityA - priorityB;
        if (priorityDiff !== 0) return priorityDiff;
        const branchAOrder =
          branchOrderMap.get(a.branch_code ?? "") ?? Number.MAX_SAFE_INTEGER;
        const branchBOrder =
          branchOrderMap.get(b.branch_code ?? "") ?? Number.MAX_SAFE_INTEGER;
        return branchAOrder - branchBOrder;
      });

      // 4. Map to result
      return sortedRows.map((row) => ({
        sno: row.sno,
        inst_code: row.inst_code,
        institute_name: row.institute_name,
        place: row.place,
        dist_code: row.dist_code,
        branch_code: row.branch_code,
        branch_name: row.branch_name,
        co_education: row.co_education,
        dynamicCastes: Object.fromEntries(
          casteColumns.map((col: any) => [col, row[col as keyof typeof row]])
        ),
      }));
    },
    apCutoff2023sByInstDist: async (
      __parent: any,
      args: { filter: any },
      context: Context
    ) => {
      const { instCodes, branchCodes, casteColumns, distCodes } = args.filter;

      const rows = await context.prisma.ap_cutoff_2023.findMany({
        where: {
          inst_code: { in: instCodes },
          dist_code: { in: distCodes },
          branch_code: { in: branchCodes },
        },
      });
      // console.log(rows);

      return rows.map((row) => ({
        sno: row.sno,
        inst_code: row.inst_code,
        institute_name: row.institute_name,
        place: row.place,
        dist_code: row.dist_code,
        branch_code: row.branch_code,
        branch_name: row.branch_name,
        co_education: row.co_education,
        dynamicCastes: Object.fromEntries(
          casteColumns.map((col: String) => [col, row[col as keyof typeof row]])
        ),
      }));
    },
  },
  Mutation: {
    createCollege: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.college.create({
        data: args,
      });
    },
    createCourse: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.course.create({
        data: args,
      });
    },
    createApCutoff2023: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.ap_cutoff_2023.create({
        data: args.data,
      });
    },
    updateApCutoff2023: async (
      _parent: any,
      args: { sno: number; data: any },
      context: Context
    ) => {
      return await context.prisma.ap_cutoff_2023.update({
        where: { sno: args.sno },
        data: args.data,
      });
    },
    deleteApCutoff2023: async (
      _parent: any,
      args: { sno: number },
      context: Context
    ) => {
      return context.prisma.ap_cutoff_2023.delete({
        where: { sno: args.sno },
      });
    },
  },
  College: {
    courses: async (parent: any, _args: any, context: Context) => {
      return await context.prisma.course.findMany({
        where: { institute_code: parent.institute_code },
      });
    },
  },
  Course: {
    colleges: async (parent: any, _args: any, context: Context) => {
      return await context.prisma.college.findMany({
        where: { institute_code: parent.institute_code },
      });
    },
  },
};
export default resolvers;
