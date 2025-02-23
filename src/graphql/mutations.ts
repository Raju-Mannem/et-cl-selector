import { gql } from '@apollo/client';

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