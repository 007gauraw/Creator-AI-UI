import { takeLatest, put, call, select } from "redux-saga/effects";
import axios from "axios";
import {
  generateStoryRequest,
  generateStorySuccess,
  generateStoryFailure,
  generateImagesRequest,
  generateImagesSuccess,
  generateImagesFailure,
  processVideoRequest,
  processVideoSuccess,
  processVideoFailure,
  downloadVideoRequest,
  downloadVideoSuccess,
  downloadVideoFailure,
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

function* handleProcessVideo(action) {
  try {
    const authToken = yield select(getAuthToken);
    const response = yield call(
      axios.post,
      `${import.meta.env.VITE_BACKEND_URL}${API_ROUTES.CREATE_VIDEO}`,
      { imageUrls: action.payload },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    yield put(processVideoSuccess(response.data));
  } catch (error) {
    yield put(processVideoFailure(error.message));
  }
}

function* handleDownloadVideo(action) {
  try {
    const authToken = yield select(getAuthToken);
    const response = yield call(
      axios.get,
      `${import.meta.env.VITE_BACKEND_URL}${API_ROUTES.DOWNLOAD_VIDEO}/${
        action.payload
      }`,
      {
        headers: {
          Authorization: authToken,
        },
        responseType: "blob",
      }
    );

    // Create blob from response
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Get filename from content-disposition header or use default
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/["']/g, "")
      : "video.mp4";

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    yield put(downloadVideoSuccess(null));
  } catch (error) {
    yield put(downloadVideoFailure(error.message));
  }
}

export function* watchVideo() {
  yield takeLatest(generateStoryRequest.type, handleGenerateStory);
  yield takeLatest(generateImagesRequest.type, handleGenerateImages);
  yield takeLatest(processVideoRequest.type, handleProcessVideo);
  yield takeLatest(downloadVideoRequest.type, handleDownloadVideo);
}
