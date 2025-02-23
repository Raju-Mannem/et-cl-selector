import { gql } from '@apollo/client';

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