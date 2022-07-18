import { gql } from "@apollo/client";

export const DELETE_IMAGE = gql`
  mutation deleteImage($id: Int!) {
    deleteImage(id: $id) {
      name
    }
  }
`;

export const STORE_IMAGE_B64 = gql`
  mutation uploadImgB64($name: String!) {
    storeImage(name: $name) {
      id
    }
  }
`;
