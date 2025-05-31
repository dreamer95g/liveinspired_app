import { gql } from "@apollo/client";

export const NOTES = gql`
  query getNotes($user_id: ID) {
    Notes(user_id: $user_id) {
      id
      date
      text
      tags {
        id
        name
      }
    }
  }
`;

export const NOTE_BY_ID = gql`
  query getNoteById($id: ID!) {
    Note(id: $id) {
      date
      text
      tags {
        id
        name
      }
    }
  }
`;

export const NOTE_BY_TAG = gql`
  query noteByTag($tags: Mixed, $user_id: ID) {
    NoteByTag(
      tags: { column: ID, operator: IN, value: $tags }
      user_id: $user_id
    ) {
      id
      date
      text
      tags {
        id
        name
      }
    }
  }
`;
