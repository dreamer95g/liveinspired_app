import { gql } from "@apollo/client";

export const PHRASES = gql`
  query getPhrases($user_id: ID) {
    Phrases(user_id: $user_id) {
      id
      text
      author
      tags {
        id
        name
      }
    }
  }
`;

export const PHRASE_BY_ID = gql`
  query getPhraseByID($id: ID!) {
    Phrase(id: $id) {
      id
      text
      author
      tags {
        id
        name
      }
    }
  }
`;

export const PHRASE_BY_TAG = gql`
  query noteByTag($tags: Mixed, $user_id: ID) {
    PhraseByTag(
      tags: { column: ID, operator: IN, value: $tags }
      user_id: $user_id
    ) {
      id
      text
      author
      tags {
        id
        name
      }
    }
  }
`;
