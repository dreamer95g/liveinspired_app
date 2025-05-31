import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation LogIn($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      access_token
      user {
        id
        name
        email
        images {
          id
          name
        }
      }
    }
  }
`;

export const REGISTER = gql`
  mutation LogIn(
    $name: String!
    $email: String!
    $password: String!
    $password_confirmation: String!
  ) {
    register(
      input: {
        name: $name
        email: $email
        password: $password
        password_confirmation: $password_confirmation
      }
    ) {
      status
    }
  }
`;

export const LOGOUT = gql`
  mutation logout {
    logout {
      status
      message
    }
  }
`;

export const CHANGE_PASS = gql`
  mutation changePassword(
    $old_password: String!
    $password: String!
    $password_confirmation: String!
  ) {
    updatePassword(
      input: {
        old_password: $old_password
        password: $password
        password_confirmation: $password_confirmation
      }
    ) {
      status
      message
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $name: String, $images: [ID!]) {
    updateUser(input: { id: $id, name: $name, images: { connect: $images } }) {
      name
      images {
        id
        name
      }
    }
  }
`;

export const UPDATE_IMAGE_USER = gql`
  mutation updateImageUser($id: ID!, $images: [ID!]) {
    updateUser(input: { id: $id, images: { connect: $images } }) {
      images {
        id
        name
      }
    }
  }
`;
