import { gql } from "@apollo/client";

export const PHRASES = gql`
  query getPhrases {
    Phrases {
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
  query noteByTag($tags: Mixed) {
    PhraseByTag(tags: { column: ID, operator: IN, value: $tags }) {
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
