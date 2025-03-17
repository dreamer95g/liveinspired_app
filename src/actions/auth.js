import { types } from "../types/types";

export const LogInAction = (id, token, name, email, photo) => {
  return (dispatch) => {
    dispatch(login(id, token, name, email, photo));
  };
};



export const login = (id, token, name, email, photo) => ({
  type: types.login,
  payload: {
    id,
    token,
    name,
    email,
    photo,
  },
});

export const LogoutAction = () => {
  return (dispatch) => {
    dispatch(logout());
    localStorage.removeItem("_token");
    // Redirigir o recargar la URL específica
    window.location.assign("http://liveinspired.home");

  };
};

export const logout = () => ({
  type: types.logout,
});


