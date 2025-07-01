const typeDefs = `#graphql
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

  type ApCutoff2023 {
    sno: ID!
    inst_code: String
    institute_name: String
    place: String
    dist_code: String
    co_education: String
    college_type: String
    year_of_estab: Float
    branch_code: String
    branch_name: String
    oc_boys: Int
    oc_girls: Int
    bc_a_boys: Int
    bc_a_girls: Int
    bc_b_boys: Int
    bc_b_girls: Int
    bc_c_boys: Int
    bc_c_girls: Int
    bc_d_boys: Int
    bc_d_girls: Int
    bc_e_boys: Int
    bc_e_girls: Int
    sc_boys: Int
    sc_girls: Int
    st_boys: Int
    st_girls: Int
    ews_girls_ou: Int
    tuition_fee: Int
    affiliated_to: String
    inst_reg: String
    a_reg: String
    priority: Int
  }

  type ApCutoff2024 {
    sno: ID!
    inst_code: String
    institute_name: String
    place: String
    dist_code: String
    co_education: String
    college_type: String
    year_of_estab: Float
    branch_code: String
    branch_name: String
    oc_boys: Int
    oc_girls: Int
    bc_a_boys: Int
    bc_a_girls: Int
    bc_b_boys: Int
    bc_b_girls: Int
    bc_c_boys: Int
    bc_c_girls: Int
    bc_d_boys: Int
    bc_d_girls: Int
    bc_e_boys: Int
    bc_e_girls: Int
    sc_boys: Int
    sc_girls: Int
    st_boys: Int
    st_girls: Int
    ews_girls_ou: Int
    tuition_fee: Int
    affiliated_to: String
    inst_reg: String
    a_reg: String
    priority: Int
  }

input ApCutoff2023Input {
sno: ID!
inst_code: String
institute_name: String
place: String
dist_code: String
co_education: String
college_type: String
year_of_estab: Float
branch_code: String
branch_name: String
oc_boys: Int
oc_girls: Int
bc_a_boys: Int
bc_a_girls: Int
bc_b_boys: Int
bc_b_girls: Int
bc_c_boys: Int
bc_c_girls: Int
bc_d_boys: Int
bc_d_girls: Int
bc_e_boys: Int
bc_e_girls: Int
sc_boys: Int
sc_girls: Int
st_boys: Int
st_girls: Int
ews_gen_ou: Int
ews_girls_ou: Int
tuition_fee: Int
affiliated_to: String
inst_reg: String
a_reg: String
priority: Int
}

  input RankFilterInput {
    minRank: Int!
    maxRank: Int!
    branchCodes: [String!]
    casteColumns: [String!]
    distCodes: [String!]
    coEdu: Boolean
  }

  input InstDistFilterInput{
    instCodes: [String!]!
    branchCodes: [String!]
    casteColumns: [String!]
    distCodes: [String!]
    coEdu: Boolean
  }

  type ApCutoff2023Dynamic {
    sno: ID!
    inst_code: String
    institute_name: String
    place: String
    dist_code: String
    branch_name: String
    branch_code: String
    co_education: String
    dynamicCastes: JSON
  }

  type ApCutoff2024Dynamic {
    sno: ID!
    inst_code: String
    institute_name: String
    place: String
    dist_code: String
    branch_name: String
    branch_code: String
    co_education: String
    dynamicCastes: JSON
  }

  scalar JSON


  type Query {
    getCollege(institute_code: String!): College
    getColleges: [College!]!
    getCoursesByInstitute(institute_code: String!): [Course!]!
    apCutoff2023s(limit: Int = 50, offset: Int = 0): [ApCutoff2023!]!
    apCutoff2023(sno: Float!): ApCutoff2023
    apCutoff2023sByInstCodes(inst_codes: [String!]!): [ApCutoff2023!]!
    apCutoff2023sByRank(filter: RankFilterInput!): [ApCutoff2023Dynamic!]!
    apCutoff2024sByRank(filter: RankFilterInput!): [ApCutoff2023Dynamic!]!
    apCutoff2023sByInstDist(filter: InstDistFilterInput!): [ApCutoff2023Dynamic!]!
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

    createApCutoff2023(data: ApCutoff2023Input!): ApCutoff2023!
    updateApCutoff2023(sno: Float!, data: ApCutoff2023Input!): ApCutoff2023!
    deleteApCutoff2023(sno: Float!): ApCutoff2023!
  }
`;
export default typeDefs;
