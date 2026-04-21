import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import Footer from "../components/Footer";
import "./css/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  // Horizontal Scroll Reference
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // තිරස් අතට scroll වන වේගය සහ දුර පාලනය
  const x = useTransform(scrollYProgress, [0.3, 0.6], ["0%", "-60%"]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        if(res.data.success) setProducts(res.data.products.filter(p => p.stock > 0));
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="snap-container">
      
      {/* 1. HERO SECTION */}
      <section className="snap-section hero-light">
        <div className="hero-split">
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="badge-light">Premium Quality</span>
            <h1>Pure Sri Lankan <span>Cinnamon</span> Excellence</h1>
            <p>Experience the world's finest spices, sourced directly from local growers with AI-driven quality assurance.</p>
            <button className="btn-primary-light" onClick={() => document.getElementById('products').scrollIntoView({behavior:'smooth'})}>
              Shop Collection
            </button>
          </motion.div>
          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="hero-circle-bg">
              <img src="https://media.post.rvohealth.io/wp-content/uploads/2020/09/health-benefits-cinnamon-fb-1200x628.jpg" alt="Cinnamon" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. HORIZONTAL PRODUCTS SECTION (Integrated into Snap) */}
      <section id="products" className="snap-section horizontal-outer">
        <div className="horizontal-header-light">
          <h2>Our Featured <span>Products</span></h2>
          <p>Scroll down to see them slide</p>
        </div>
        <div ref={targetRef} className="horizontal-trigger">
          <div className="sticky-box">
            <motion.div style={{ x }} className="horizontal-items">
              {products.map((product) => (
                <div className="product-card-light" key={product._id}>
                  <div className="img-holder">
                    <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                  </div>
                  <div className="info">
                    <h4>{product.name}</h4>
                    <p>Rs. {product.price.toLocaleString()}</p>
                    <button onClick={() => navigate(`/productsdetails/${product._id}`)}>View Product</button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION */}
      <section className="snap-section mission-light">
        <div className="content-box">
          <motion.div 
            className="text-area"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="number">01</span>
            <h2>Our Mission</h2>
            <p>To empower local cinnamon farmers by providing a direct-to-market platform, ensuring fair pricing and sustainable farming practices through modern technology.</p>
            <div className="line-gold"></div>
          </motion.div>
          <div className="image-area mission-bg"></div>
        </div>
      </section>

      {/* 4. OUR VISION */}
      <section className="snap-section vision-light">
        <div className="content-box reverse">
          <motion.div 
            className="text-area"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <span className="number">02</span>
            <h2>Our Vision</h2>
            <p>To redefine the global spice trade by making Sri Lankan cinnamon the gold standard of quality, supported by AI-powered sales insights and ethical sourcing.</p>
            <div className="line-gold"></div>
          </motion.div>
          <div className="image-area vision-bg"></div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <section className="snap-section footer-snap">
        <Footer />
      </section>

    </div>
  );
}