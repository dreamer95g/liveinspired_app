import { gql } from "@apollo/client";

export const CREATE_NOTE = gql`
  mutation ($date: Date, $text: String!, $tags: [ID], $user: ID) {
    createNote(
      input: {
        date: $date
        text: $text
        tags: { connect: $tags }
        user: { connect: $user }
      }
    ) {
      id
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation deleteNote($id: ID!) {
    deleteNote(id: $id) {
      id
    }
  }
`;

export const DELETE_NOTES = gql`
  mutation deleteNotes($ids: [Int]) {
    deleteNotes(ids: $ids) {
      id
    }
  }
`;

export const DISCONNECT_FOREIGN_KEYS = gql`
  mutation disconnectForeignKeys($id: ID!, $tags: [ID]) {
    updateNote(input: { id: $id, tags: { disconnect: $tags } }) {
      id
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation updateNote($id: ID!, $date: Date, $text: String, $tags: [ID]) {
    updateNote(
      input: { id: $id, date: $date, text: $text, tags: { connect: $tags } }
    ) {
      id
    }
  }
`;
