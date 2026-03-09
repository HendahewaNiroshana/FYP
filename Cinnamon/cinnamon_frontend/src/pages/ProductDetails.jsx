import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./css/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 
  const [product, setProduct] = useState(null);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  const loadProduct = useCallback(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProduct(data.product);
      });
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleVote = async (type) => {
    if (!user) return alert("Please login to vote!");
    const res = await fetch(`http://localhost:5000/api/products/${id}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id }),
    });
    if (res.ok) loadProduct();
  };

  const handleComment = async () => {
    if (!user) return alert("Please login to comment!");
    if (!comment.trim()) return;
    const res = await fetch(`http://localhost:5000/api/products/${id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, text: comment }),
    });
    const data = await res.json();
    if (data.success) {
      setProduct({ ...product, comments: data.comments });
      setComment("");
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  const isLiked = product.likedBy?.includes(user?._id);
  const isDisliked = product.dislikedBy?.includes(user?._id);

  return (
    <div className="pd-container fade-in">
      <div className="pd-grid">
        <div className="pd-image-section">
          <div className="pd-img-card">
            <img src={`http://localhost:5000${product.image}`} alt={product.name} />
            {product.stock <= 0 && <span className="pd-badge out">Out of Stock</span>}
          </div>
        </div>

        <div className="pd-info-section">
          <span className="pd-category">Seller: {product.seller?.name}</span>
          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-desc">{product.description}</p>
          
          <div className="pd-price-row">
            <h2 className="pd-price">Rs. {product.price.toLocaleString()}</h2>
            <span className={`pd-stock ${product.stock > 0 ? "in" : "none"}`}>
              {product.stock > 0 ? `${product.stock} Units Left` : "Unavailable"}
            </span>
          </div>

          <div className="pd-quantity-selector">
            <label>Quantity</label>
            <div className="q-controls">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <div className="pd-main-actions">
            <button className="pd-buy-btn" onClick={() => navigate(`/placeorder/${id}?qty=${quantity}`)} disabled={product.stock <= 0}>
              Buy Now
            </button>
            <div className="pd-vote-group">
              <button className={`pd-vote-btn ${isLiked ? "active-like" : ""}`} onClick={() => handleVote("like")}>
                👍 {product.likedBy?.length || 0}
              </button>
              <button className={`pd-vote-btn ${isDisliked ? "active-dislike" : ""}`} onClick={() => handleVote("dislike")}>
                👎 {product.dislikedBy?.length || 0}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-comments-section">
        <h3>User Discussions ({product.comments?.length || 0})</h3>
        <div className="pd-comment-input">
          <textarea 
            placeholder="Share your thoughts about this product..." 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleComment}>Post Comment</button>
        </div>

        <div className="pd-comments-list">
          {product.comments.map((c, i) => (
            <div key={i} className="pd-comment-card">
              <div className="pd-avatar">{c.user?.name[0]}</div>
              <div className="pd-comment-body">
                <div className="pd-comment-header">
                  <strong>{c.user?.name}</strong>
                  <small>{new Date(c.createdAt).toLocaleDateString()}</small>
                </div>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}