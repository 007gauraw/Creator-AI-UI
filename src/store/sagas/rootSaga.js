import { all } from "redux-saga/effects";
import { watchAuth } from "./authSaga";
import { watchVideo } from "./videoSaga";

export default function* rootSaga() {
  yield all([watchAuth(), watchVideo()]);
}
