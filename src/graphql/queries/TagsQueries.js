import { gql } from "@apollo/client";

export const TAGS = gql`
  query Tags($user_id: ID) {
    Tags(user_id: $user_id) {
      id
      name
    }
  }
`;
