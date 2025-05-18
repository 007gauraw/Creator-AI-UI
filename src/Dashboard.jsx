import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  generateStoryRequest,
  generateImagesRequest,
  processVideoRequest,
  downloadVideoRequest,
  resetVideo,
} from "./store/slices/videoSlice";
import "./Dashboard.css";

function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, images, story, video, videoUrl } = useSelector(
    (state) => state.video
  );
  const [editedStory, setEditedStory] = useState(null);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetVideo());
    };
  }, [dispatch]);

  useEffect(() => {
    if (story) {
      setEditedStory(story);
    }
  }, [story]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("videoText");
    if (text.trim()) {
      dispatch(generateStoryRequest(text));
      e.target.reset();
    }
  };

  const handleStoryEdit = (index, field, value) => {
    const updatedStory = [...editedStory];
    updatedStory[index] = { ...updatedStory[index], [field]: value };
    setEditedStory(updatedStory);
  };

  const handleGenerateImages = () => {
    if (editedStory) {
      dispatch(generateImagesRequest(editedStory));
    }
  };

  const handleGenerateVideo = () => {
    if (images && images.length) {
      const imageUrls = images.map((img) => img.presignedUrl);
      dispatch(processVideoRequest(imageUrls));
    }
  };

  const handleDownloadVideo = () => {
    if (video && video.exportId) {
      dispatch(downloadVideoRequest(video.exportId));
    }
  };

  // Helper function to find image for a story segment using the story's existing ID
  const findImageForSegment = (segment) => {
    if (!images || !images.length) return null;
    return images.find((img) => img.imageId === segment.id);
  };
  // Video download is now handled directly in the saga

  return (
    <div className="dashboard">
      <h1>Welcome to the Dashboard</h1>
      <p>You are successfully authenticated!</p>

      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-textarea-container">
          <textarea
            name="videoText"
            placeholder="Enter text to generate story..."
            className="form-textarea"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generating Story..." : "Generate Story"}
        </button>
      </form>

      {error && <p className="error-message">Error: {error}</p>}

      {editedStory && (
        <div className="story-editor">
          <h2>Edit Your Story</h2>
          {editedStory.map((segment, index) => {
            const generatedImage = findImageForSegment(segment);
            return (
              <div key={segment.id || index} className="story-segment">
                <textarea
                  value={segment.text}
                  onChange={(e) =>
                    handleStoryEdit(index, "text", e.target.value)
                  }
                  className="story-text-input"
                />
                <textarea
                  value={segment.imageDescription}
                  onChange={(e) =>
                    handleStoryEdit(index, "imageDescription", e.target.value)
                  }
                  className="story-image-input"
                  placeholder="Image description..."
                />
                {generatedImage && (
                  <div className="generated-image">
                    <img
                      src={generatedImage.presignedUrl}
                      alt={`Generated image for segment ${index + 1}`}
                      className="segment-image"
                    />
                  </div>
                )}
              </div>
            );
          })}
          <button
            onClick={handleGenerateImages}
            disabled={loading}
            className="generate-video-button"
          >
            Generate Images
          </button>
          {images && images.length > 0 && (
            <button
              onClick={handleGenerateVideo}
              disabled={loading}
              className="generate-video-button"
              style={{ marginLeft: "1rem" }}
            >
              Generate Video
            </button>
          )}
          {video && video.exportId && (
            <button
              onClick={handleDownloadVideo}
              disabled={loading}
              className="generate-video-button"
              style={{ marginLeft: "1rem" }}
            >
              Download Video
            </button>
          )}
          {video && video.status === "pending" && (
            <p className="status-message">Video Status: {video.message}</p>
          )}
        </div>
      )}

      <button onClick={() => auth.removeUser()} className="sign-out-button">
        Sign out
      </button>
    </div>
  );
}

export default Dashboard;
