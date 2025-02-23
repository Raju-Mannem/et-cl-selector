import {Context} from "../pages/api/graphql";

const resolvers = {
  Query: {
    getColleges: async (_parent:any,_args:any, context: Context) => {
      return await context.prisma.college.findMany();
    },
    getCollege: async (_parent:any, args:any, context: Context) => {
      return await context.prisma.college.findUnique({
        where: { institute_code: args.institute_code },
        include: { courses: true },
      });
    },
    getCoursesByInstitute: async (_parent: any, args: any, context: Context) => {
    return await context.prisma.course.findMany({
      where: { institute_code: args.institute_code },
    });
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
    }
  }
};
export default resolvers;