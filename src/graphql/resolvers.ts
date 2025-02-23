import {Context} from "../pages/api/graphql";

interface getCoursesByInstituteProps{
  institute_code : string
}

const resolvers = {
  Query: {
    getColleges: async (context: Context) => {
      return await context.prisma.college.findMany();
    },
    getCollege: async (args:getCoursesByInstituteProps, context: Context) => {
      return await context.prisma.college.findUnique({
        where: { institute_code: args.institute_code },
        include: { courses: true },
      });
    },
    getCoursesByInstitute: async (args: getCoursesByInstituteProps, context: Context) => {
    return await context.prisma.course.findMany({
      where: { institute_code: args.institute_code },
    });
  },
},
  College: {
    courses: async (parent: getCoursesByInstituteProps, context: Context) => {
      return await context.prisma.course.findMany({
        where: { institute_code: parent.institute_code },
      });
  },
  },
  Course: {
    colleges: async (parent: getCoursesByInstituteProps, context: Context) => {
      return await context.prisma.college.findMany({
        where: { institute_code: parent.institute_code },
      });
    }
  }
};
export default resolvers;