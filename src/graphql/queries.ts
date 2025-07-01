import { gql } from "@apollo/client";

export const GET_COLLEGE = gql`
  query GetCollege($institute_code: String!) {
    getCollege(institute_code: $institute_code) {
      sno
      institute_code
      institute_name
      place
      district_name
      region
      college_type
      minority
      co_educ
      affiliated_to
      courses {
        sno
        institute_code
        minority
        branch_code
        fee
        convener_seats
      }
    }
  }
`;

export const GET_COURSES_BY_INSTITUTE = gql`
  query GetCoursesByInstitute($institute_code: String!) {
    getCoursesByInstitute(institute_code: $institute_code) {
      sno
      institute_code
      branch_code
      convener_seats
      fee
      minority
    }
  }
`;
export const GET_ALL_COLLEGES = gql`
  query GetAllColleges {
    getColleges {
      sno
      institute_code
      institute_name
      place
      district_name
      region
      college_type
      minority
      co_educ
      affiliated_to
    }
  }
`;

export const GET_PAGINATED_AP_CUTOFF_2023S = gql`
  query GetPaginatedApCutoff2023s($limit: Int, $offset: Int) {
    apCutoff2023s(limit: $limit, offset: $offset) {
      rows {
        sno
        inst_code
        institute_name
        place
        dist_code
        college_type
        branch_code
        branch_name
        oc_boys
        oc_girls
        bc_a_boys
        bc_a_girls
        bc_b_boys
        bc_b_girls
        bc_c_boys
        bc_c_girls
        bc_d_boys
        bc_d_girls
        bc_e_boys
        bc_e_girls
        sc_boys
        sc_girls
        st_boys
        st_girls
        ews_gen_ou
        ews_girls_ou
        tuition_fee
        affiliated_to
      }
      totalCount
    }
  }
`;

export const GET_AP_CUTOFF_2023 = gql`
  query GetApCutoff2023($sno: Float!) {
    apCutoff2023(sno: $sno) {
      sno
      inst_code
      institute_name
      place
      dist_code
      co_education
      college_type
      year_of_estab
      branch_code
      branch_name
      oc_boys
      oc_girls
      bc_a_boys
      bc_a_girls
      bc_b_boys
      bc_b_girls
      bc_c_boys
      bc_c_girls
      bc_d_boys
      bc_d_girls
      bc_e_boys
      bc_e_girls
      sc_boys
      sc_girls
      st_boys
      st_girls
      ews_gen_ou
      ews_girls_ou
      tuition_fee
      affiliated_to
    }
  }
`;

export const GET_AP_CUTOFF_2023S_BY_INST_CODES = gql`
  query GetApCutoff2023sByInstCodes($inst_codes: [String!]!) {
    apCutoff2023sByInstCodes(inst_codes: $inst_codes) {
      sno
      inst_code
      institute_name
      place
      dist_code
      college_type
      branch_code
      branch_name
      oc_boys
      oc_girls
      bc_a_boys
      bc_a_girls
      bc_b_boys
      bc_b_girls
      bc_c_boys
      bc_c_girls
      bc_d_boys
      bc_d_girls
      bc_e_boys
      bc_e_girls
      sc_boys
      sc_girls
      st_boys
      st_girls
      ews_gen_ou
      ews_girls_ou
      tuition_fee
      affiliated_to
    }
  }
`;

export const GET_AP_CUTOFFS_2023_BY_RANK = gql`
  query ApCutoff2023sByRank($filter: RankFilterInput!) {
    apCutoff2023sByRank(filter: $filter) {
      sno
      inst_code
      institute_name
      branch_code
      branch_name
      dist_code
      place
      dynamicCastes
      co_education
    }
  }
`;
export const GET_AP_CUTOFFS_2024_BY_RANK = gql`
  query ApCutoff2023sByRank($filter: RankFilterInput!) {
    apCutoff2023sByRank(filter: $filter) {
      sno
      inst_code
      institute_name
      branch_code
      branch_name
      dist_code
      place
      dynamicCastes
      co_education
    }
  }
`;
export const GET_AP_CUTOFFS_2023_BY_RANK_DIST = gql`
  query ApCutoff2023sByInstDist($filter: InstDistFilterInput!) {
    apCutoff2023sByInstDist(filter: $filter) {
      sno
      inst_code
      institute_name
      branch_code
      branch_name
      dist_code
      place
      dynamicCastes
    }
  }
`;
