import { types } from "../types/types";

export const setErrorAction = (err) => ({
  type: types.uiSetError,
  payload: err,
});

export const sideVarChangeStateAction = (state) => ({
  type: types.sideBarState,
  payload: state,
});

export const removeErrorAction = () => ({
  type: types.uiRemoveError,
});

export const startLoadingAction = () => ({
  type: types.uiStartLoading,
});

export const finishLoadingAction = () => ({
  type: types.uiFinishLoading,
});
