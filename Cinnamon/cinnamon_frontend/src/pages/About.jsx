import React from "react";
import "./css/About.css";

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero-section">
        <div className="about-hero-content">
          <div className="about-hero-text">
            <span className="welcome-tag">Premium Organic Spices</span>
            <h1>Bridging Nature & Quality</h1>
            <p>
              Cinnamon Bridge is more than just a brand; it's a legacy of purity. 
              We are passionate about bringing you the best organic cinnamon 
              products straight from the fertile soils of Sri Lanka to your doorstep.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <strong>100%</strong>
                <span>Organic</span>
              </div>
              <div className="stat-item">
                <strong>50+</strong>
                <span>Farms</span>
              </div>
            </div>
          </div>
          <div className="about-hero-image">
            <div className="image-overlay-box"></div>
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/007/872/022/small/cinnamon-with-mint-leaf-and-star-anise-photo.jpg"
              alt="Premium Cinnamon Sticks"
            />
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="section-header">
          <h2>The Pillars of Our Excellence</h2>
          <div className="gold-line"></div>
        </div>
        
        <div className="values-grid">
          <div className="value-card-modern">
            <div className="value-icon">🌿</div>
            <h3>Our Mission</h3>
            <p>
              To promote healthy living by providing world-class, 100% natural 
              and organic cinnamon products that enrich your life.
            </p>
          </div>

          <div className="value-card-modern">
            <div className="value-icon">✨</div>
            <h3>Our Vision</h3>
            <p>
              To become the global gold standard for organic spices while 
              uplifting the lives of our local farming communities.
            </p>
          </div>

          <div className="value-card-modern">
            <div className="value-icon">🤝</div>
            <h3>Our Promise</h3>
            <p>
              Transparency in every harvest. We guarantee fair trade and 
              sustainable eco-friendly practices in every product.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}