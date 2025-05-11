import { takeLatest, put, call } from "redux-saga/effects";
import {
  setAuthenticated,
  setUser,
  setLoading,
  setError,
} from "../slices/authSlice";

// Example of an auth action type
export const LOGIN_REQUEST = "auth/loginRequest";

function* handleLogin(action) {
  try {
    yield put(setLoading(true));
    // Here you would typically make an API call
    // const response = yield call(api.login, action.payload);
    // yield put(setUser(response.user));
    yield put(setAuthenticated(true));
    yield put(setLoading(false));
  } catch (error) {
    yield put(setError(error.message));
    yield put(setLoading(false));
  }
}

export function* watchAuth() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
}
