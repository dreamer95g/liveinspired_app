import { types } from "../types/types";

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case types.login:
      return {
        id: action.payload.id,
        token: action.payload.token,
        name: action.payload.name,
        email: action.payload.email,
        photo: action.payload.photo,
      };

    case types.logout:
      return {};

    default:
      return state;
  }
};
