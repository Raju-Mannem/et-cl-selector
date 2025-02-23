const typeDefs= `#graphql
type College {
    sno: ID!
    institute_code: String!
    institute_name: String!
    place: String!
    district_name: String!
    region: String!
    college_type: String!
    minority: String!
    co_educ: String!
    affiliated_to: String!
    courses: [Course!]!
  }

  type Course {
    sno: ID!
    institute_code: String!
    minority: String!
    branch_code: String!
    fee: Float!
    convener_seats: Int!
    colleges: [College!]! 
  }

  type Query {
    getCollege(institute_code: String!): College
    getColleges: [College!]!
    getCoursesByInstitute(institute_code: String!): [Course!]!
  }

  type Mutation {
    createCollege(
      institute_code: String!
      institute_name: String!
      place: String!
      district_name: String!
      region: String!
      college_type: String!
      minority: String!
      co_educ: String!
      affiliated_to: String!
    ): College

    createCourse(
      institute_code: String!
      minority: Boolean!
      branch_code: String!
      fee: Float!
      convener_seats: Int!
    ): Course
  }
`
export default typeDefs;