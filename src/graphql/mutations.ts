import { gql } from "@apollo/client";

export const CREATE_COLLEGE = gql`
  mutation CreateCollege(
    $institute_code: String!
    $institute_name: String!
    $place: String!
    $district_name: String!
    $region: String!
    $college_type: String!
    $minority: Boolean!
    $co_educ: Boolean!
    $affiliated_to: String!
  ) {
    createCollege(
      institute_code: $institute_code
      institute_name: $institute_name
      place: $place
      district_name: $district_name
      region: $region
      college_type: $college_type
      minority: $minority
      co_educ: $co_educ
      affiliated_to: $affiliated_to
    ) {
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

export const CREATE_COURSE = gql`
  mutation CreateCourse(
    $institute_code: String!
    $minority: Boolean!
    $branch_code: String!
    $fee: Float!
    $convener_seats: Int!
  ) {
    createCourse(
      institute_code: $institute_code
      minority: $minority
      branch_code: $branch_code
      fee: $fee
      convener_seats: $convener_seats
    ) {
      sno
      institute_code
      minority
      branch_code
      fee
      convener_seats
    }
  }
`;

export const CREATE_AP_CUTOFF_2024 = gql`
  mutation CreateApCutoff2024($data: ApCutoff2024Input!) {
    createApCutoff2024(data: $data) {
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

export const UPDATE_AP_CUTOFF_2024 = gql`
  mutation UpdateApCutoff2024($sno: Float!, $data: ApCutoff2024Input!) {
    updateApCutoff2024(sno: $sno, data: $data) {
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

export const DELETE_AP_CUTOFF_2024 = gql`
  mutation DeleteApCutoff2024($sno: Float!) {
    deleteApCutoff2024(sno: $sno) {
      sno
    }
  }
`;
