import { gql } from "@apollo/client";

export const TAGS = gql`
  query Tags {
    tags {
      id
      name
    }
  }
`;
