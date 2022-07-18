import { gql } from "@apollo/client";

export const UPDATE_TAG = gql`
  mutation updateTag($id: ID!, $name: String!) {
    updateTag(id: $id, name: $name) {
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
  mutation createTag($name: String!) {
    createTag(name: $name) {
      id
    }
  }
`;
