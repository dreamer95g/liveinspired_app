import { gql } from "@apollo/client";

export const ME = gql`
  query me {
    me {
      id
      name
      email
      images {
        id
        name
      }
    }
  }
`;
