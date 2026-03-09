import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./css/ViewAd.css";
import ReportModal from "../components/ReportAdvertisment";

export default function ViewAdvertisement() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [ad, setAd] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);

  useEffect(() => {
    fetchAdsData();
  }, [id, user]);

  const fetchAdsData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/ads-rating/${id}`);
      const data = await res.json();
      if (data.success) {
        setAd(data.ad);
        setInteractions(data.interactions);

        const likes = data.interactions.filter((i) => i.like === true).length;
        const dislikes = data.interactions.filter((i) => i.like === false).length;
        setLikesCount(likes);
        setDislikesCount(dislikes);

        const userRating = data.interactions.find(i => i.userId?._id === user?._id && i.rating);
        if (userRating) setRating(userRating.rating);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleInteraction = async (type, value) => {
    if (!user) return alert("Please login first to interact.");

    try {
      const res = await fetch(`http://localhost:5000/api/ads-rating/${id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          comment: type === "comment" ? comment : undefined,
          rating: type === "rating" ? value : undefined,
          like: type === "like" ? true : type === "dislike" ? false : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchAdsData(); 
        if (type === "comment") setComment("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Interaction Error:", err);
    }
  };

  const handleReportSubmit = async (description) => {
    if (!user) return alert("Please login first");
    
    try {
      const res = await fetch(`http://localhost:5000/api/adsreport/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId: id,
          userId: user._id,
          description: description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Reported successfully!");
        setIsModalOpen(false);
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error("Report Error:", err);
    }
  };

  if (!ad) return <div className="loading-screen">Loading Cinnamon Bridge Advertisement...</div>;

  return (
    <div className="view-ad-page">
      <div className="ad-main-card">
        <div className="ad-image-section">
          <img src={`http://localhost:5000${ad.imageUrl}`} alt={ad.title} />
          <button onClick={() => setIsModalOpen(true)} className="report-badge">
            🚩 Report Ad
          </button>
        </div>

        <div className="ad-info-section">
          <span className="ad-category-tag">Featured Advertisement</span>
          <h1>{ad.title}</h1>
          <p className="ad-description">{ad.description}</p>

          <div className="interaction-bar">
            <div className="vote-container">
              <button onClick={() => handleInteraction("like")} className="pd-vote-btn">
                👍 {likesCount}
              </button>
              <button onClick={() => handleInteraction("dislike")} className="pd-vote-btn">
                👎 {dislikesCount}
              </button>
            </div>
          </div>

          <div className="ad-rating-input">
            <h3>Rate this Experience</h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={(hoverRating || rating) >= star ? "star filled" : "star"}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => {
                    setRating(star);
                    handleInteraction("rating", star);
                  }}
                >★</span>
              ))}
            </div>
            <p className="rating-hint">Click a star to submit your rating</p>
          </div>
        </div>
      </div>

      <div className="ad-feedback-section">
        <h2>Community Comments</h2>
        <div className="add-comment-area">
          <textarea
            placeholder="Share your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button 
            className="post-btn" 
            onClick={() => handleInteraction("comment")}
            disabled={!comment.trim()}
          >
            Post Comment
          </button>
        </div>

        <div className="comments-display">
          {interactions.filter(i => i.comment).length > 0 ? (
            interactions.filter(i => i.comment).reverse().map((i) => (
              <div key={i._id} className="comment-bubble">
                <div className="comment-user-info">
                  <div className="user-avatar">{i.userId?.name ? i.userId.name.charAt(0) : "U"}</div>
                  <strong>{i.userId?.name || "Anonymous User"}</strong>
                  {i.rating && <span className="user-given-rating">⭐ {i.rating}/5</span>}
                </div>
                <p>{i.comment}</p>
                <small>{new Date(i.createdAt).toLocaleDateString()}</small>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Start the conversation!</p>
          )}
        </div>
      </div>

      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleReportSubmit} 
      />
    </div>
  );
}