import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthenticated,
  setUser,
  setLoading,
  setError,
} from "./store/slices/authSlice";
import Dashboard from "./Dashboard";
import "./App.css";

// App.js

function App() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setLoading(auth.isLoading));
    dispatch(setAuthenticated(auth.isAuthenticated));
    dispatch(setUser(auth.user));
    if (auth.error) {
      dispatch(setError(auth.error.message));
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, auth.error, dispatch]);

  const signOutRedirect = () => {
    window.location.href = `${
      import.meta.env.VITE_COGNITO_DOMAIN
    }/logout?client_id=${
      import.meta.env.VITE_COGNITO_CLIENT_ID
    }&logout_uri=${encodeURIComponent(
      import.meta.env.VITE_COGNITO_LOGOUT_URI
    )}`;
  };

  if (auth.isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (auth.error) {
    return (
      <div className="error-state">
        Encountering error... {auth.error.message}
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="auth-buttons">
                  <button onClick={() => auth.signinRedirect()}>Sign in</button>
                  <button onClick={() => signOutRedirect()}>Sign out</button>
                </div>
              )
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
