import {types} from "../types/types";

export const LogInAction = (token, name, email,  photo) => {
    return (dispatch) => {
        dispatch(login(token, name, email, photo));
    };
};

export const login = (token, name, email,  photo) => ({
    type: types.login,
    payload: {
        token,
        name,
        email,
        photo
    },
});

export const LogoutAction = () => {
    return (dispatch) => {
        dispatch(logout());
        localStorage.removeItem('_token');
    };
};

export const logout = () => ({
    type: types.logout,
});
