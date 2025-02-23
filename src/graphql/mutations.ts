import { gql } from '@apollo/client';

export const CREATE_COLLEGE = gql`
  mutation CreateCollege(
    $institute_code: string!
    $institute_name: string!
    $place: string!
    $district_name: string!
    $region: string!
    $college_type: string!
    $minority: string!
    $co_educ: string!
    $affiliated_to: string!
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
    $institute_code: string!
    $minority: Boolean!
    $branch_code: string!
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