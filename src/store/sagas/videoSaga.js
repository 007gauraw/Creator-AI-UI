import { takeLatest, put, call, select } from "redux-saga/effects";
import axios from "axios";
import {
  generateStoryRequest,
  generateStorySuccess,
  generateStoryFailure,
  generateImagesRequest,
  generateImagesSuccess,
  generateImagesFailure,
} from "../slices/videoSlice";
import { API_ROUTES } from "../constants/apiRoutes";

// Selector to get access token from auth state
const getAuthToken = (state) => {
  const { token_type, access_token } = state.auth.user;
  return access_token ? `${token_type} ${access_token}` : null;
};

function* handleGenerateStory(action) {
  try {
    const authToken = yield select(getAuthToken);
    const response = yield call(
      axios.post,
      `${import.meta.env.VITE_BACKEND_URL}${API_ROUTES.TEXT_TO_STORY}`,
      { prompt: action.payload },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    yield put(generateStorySuccess(response.data.jsonString));
  } catch (error) {
    yield put(generateStoryFailure(error.message));
  }
}

function* handleGenerateImages(action) {
  try {
    const authToken = yield select(getAuthToken);
    const response = yield call(
      axios.post,
      `${import.meta.env.VITE_BACKEND_URL}${API_ROUTES.TEXT_TO_IMAGES}`,
      { jsonString: action.payload },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    yield put(generateImagesSuccess(response.data));
  } catch (error) {
    yield put(generateImagesFailure(error.message));
  }
}

export function* watchVideo() {
  yield takeLatest(generateStoryRequest.type, handleGenerateStory);
  yield takeLatest(generateImagesRequest.type, handleGenerateImages);
}
