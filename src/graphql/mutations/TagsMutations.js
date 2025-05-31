import { gql } from "@apollo/client";

export const UPDATE_TAG = gql`
  mutation updateTag($id: ID!, $name: String!) {
    updateTag(input: { id: $id, name: $name }) {
      id
      name
    }
  }
`;

export const DELETE_TAG = gql`
  mutation deleteTag($id: ID!) {
    deleteTag(id: $id) {
      name
    }
  }
`;

export const DELETE_TAGS = gql`
  mutation deleteTags($ids: [Int]) {
    deleteTags(ids: $ids) {
      id
    }
  }
`;

export const CREATE_TAG = gql`
  mutation createTag($name: String!, $user: ID) {
    createTag(input: { name: $name, user: { connect: $user } }) {
      id
    }
  }
`;
