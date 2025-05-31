import { gql } from "@apollo/client";

export const CREATE_PHRASE = gql`
  mutation ($text: String!, $author: String, $tags: [ID], $user: ID) {
    createPhrase(
      input: {
        text: $text
        author: $author
        tags: { connect: $tags }
        user: { connect: $user }
      }
    ) {
      id
    }
  }
`;

export const DELETE_PHRASE = gql`
  mutation deletePhrase($id: ID!) {
    deletePhrase(id: $id) {
      id
    }
  }
`;

export const DELETE_PHRASES = gql`
  mutation deletePhrases($ids: [Int]) {
    deletePhrases(ids: $ids) {
      id
    }
  }
`;

export const DISCONNECT_FOREIGN_KEYS = gql`
  mutation disconnectForeignKeys($id: ID!, $tags: [ID]) {
    updatePhrase(input: { id: $id, tags: { disconnect: $tags } }) {
      id
    }
  }
`;

export const UPDATE_PHRASE = gql`
  mutation updatePhrase($id: ID!, $text: String, $author: String, $tags: [ID]) {
    updatePhrase(
      input: { id: $id, text: $text, author: $author, tags: { connect: $tags } }
    ) {
      id
    }
  }
`;
