import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "../components/Footer";
import "./css/Home.css";

const ScrollSection = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" }
        }
      }}
      className="snap-section"
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => data.success && setProducts(data.products.filter(p => p.stock > 0)));

    fetch("http://localhost:5000/api/ads")
      .then(res => res.json())
      .then(data => setAds(data));
  }, []);

  return (
    <div className="home-container">

      {/* HERO */}
      <section className="hero-modern snap-section">
        <div className="hero-content">

          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="hero-badge">Premium Sri Lankan Spices</span>
            <h1>Crafting the Future of <span>Cinnamon</span> Business</h1>
            <p>Empowering growers and buyers with AI-driven insights and a seamless marketplace.</p>

            <div className="hero-btns">
              <button className="cta-primary" onClick={scrollToProducts}>Explore Products</button>
              <button className="cta-secondary" onClick={() => navigate('/about')}>Our Story</button>
            </div>
          </motion.div>

          <motion.img
            className="hero-img"
            src="https://media.post.rvohealth.io/wp-content/uploads/2020/09/health-benefits-cinnamon-fb-1200x628.jpg"
            alt="Cinnamon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </section>

      {/* PRODUCTS */}
      <ScrollSection>
        <section id="products" className="section-padding content-center">
          <div className="section-header">
            <h2>Featured Collection</h2>
            <div className="underline"></div>
          </div>

          <div className="product-grid-modern">
            {products.slice(0, 4).map(product => (
              <div className="modern-product-card" key={product._id}>
                <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                <div className="card-body">
                  <h3>{product.name}</h3>
                  <p className="price">Rs. {product.price.toLocaleString()}</p>
                  <button onClick={() => navigate(`/productsdetails/${product._id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollSection>

      {/* ADS */}
      <ScrollSection>
        <section className="section-padding content-center">
          <div className="section-header">
            <h2>Market Insights & Ads</h2>
            <div className="underline"></div>
          </div>

          <div className="ads-container">
            {ads.map(ad => (
              <div className="modern-ad-card" key={ad._id}>
                <img src={`http://localhost:5000${ad.imageUrl}`} alt={ad.title} />
                <div className="ad-content">
                  <h3>{ad.title}</h3>
                  <p>{ad.description.substring(0, 80)}...</p>
                  <Link to={`/advertisement/${ad._id}`}>Read More →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollSection>

      {/* SERVICES */}
      <ScrollSection>
        <section className="section-padding content-center">
          <div className="section-header">
            <h2>Why Choose Us?</h2>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="icon">🚀</div>
              <h3>Innovation</h3>
              <p>AI-powered sales predictions.</p>
            </div>

            <div className="service-card">
              <div className="icon">✨</div>
              <h3>Quality</h3>
              <p>Hand-picked premium cinnamon.</p>
            </div>

            <div className="service-card">
              <div className="icon">🌍</div>
              <h3>Global</h3>
              <p>Connecting Sri Lanka to the world.</p>
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* FOOTER (NO SNAP) */}
      <div className="footer-section">
        <Footer />
      </div>

    </div>
  );
}
