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
            <p className="hero-description">Experience the world's finest spices, sourced directly from local growers with AI-driven quality assurance.</p>
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
          <p>Scroll Side to see them slide</p>
        </div>
        <div ref={targetRef} className="horizontal-trigger">
  <div className="sticky-box">
    <motion.div style={{ x }} className="horizontal-items">
      {/* Array eken mul 4 pamanak gani */}
      {products.slice(0, 4).map((product) => (
        <div className="product-card-light" key={product._id}>
          <div className="img-holder">
            <img src={`http://localhost:5000${product.image}`} alt={product.name} />
          </div>
          <div className="info">
            <h4 className="home-product-name">{product.name}</h4>
            <p className="product-description"> {product.description}</p>
            <p className="home-product-price">Rs. {product.price.toLocaleString()}</p>
            <button 
              onClick={() => navigate(`/productsdetails/${product._id}`)} 
              className="viewproduct"
            >
              View Product
            </button>
          </div>
        </div>
      ))}

      {/* Product cards walata passe ena View All button eka */}
      <div className="view-all-card">
        <button 
          onClick={() => navigate('/products')} 
          className="view-all-btn"
        >
          View All →
        </button>
      </div>
    </motion.div>
  </div>
</div>
      </section>

      {/* 3. OUR MISSION */}
      <section className="snap-section mission-light">
  <div className="content-box">
    {/* Text Area: Bottom eke sita udaata (Fade-in & Out) */}
    <motion.div 
      className="text-area"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }} // Scroll karaddi ayeth wenawa
    >
      <span className="number">01</span>
      <h2>Our Mission</h2>
      <p className="home-vision">The mission of the CinnamonBridge platform is to digitally transform the cinnamon industry by providing an intelligent, transparent, and technology-driven marketplace that connects buyers, sellers, and business stakeholders through a unified web and mobile ecosystem. The platform aims to enhance accessibility, operational efficiency, and fair business opportunities by integrating modern technologies such as artificial intelligence, predictive analytics, and automated communication systems. Furthermore, CinnamonBridge seeks to support sustainable business growth, improve decision-making through data-driven insights, and create a secure, user-friendly environment that strengthens trust, market visibility, and long-term competitiveness within the cinnamon business sector.</p>
      <div className="line-gold"></div>
    </motion.div>

    {/* Image Area: Right eke sita wamata (Fade-in & Out) */}
    <motion.div 
      className="image-area mission-bg"
      initial={{ opacity: 0, x: 100 }} // Right side eke sita
      whileInView={{ opacity: 1, x: 0 }} // Position ekata ena widiya
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className="image-area mission-bg"></div>
    </motion.div>
  </div>
</section>

      {/* 4. OUR VISION */}
      <section className="snap-section vision-light">
  <div className="content-box reverse">
    {/* Text Area: Bottom eke sita udaata (Fade-in & Out) */}
    <motion.div 
      className="text-area"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <span className="number">02</span>
      <h2>Our Vision</h2>
      <p className="home-vision">The vision of CinnamonBridge is to become a leading intelligent digital ecosystem for the cinnamon industry by revolutionizing how cinnamon products are traded, managed, and analyzed through innovative technology. The platform aspires to create a transparent, data-driven, and globally connected marketplace that enhances business efficiency, promotes trust between stakeholders, and supports informed decision-making through artificial intelligence and predictive analytics. In the long term, CinnamonBridge aims to establish a sustainable digital environment that empowers cinnamon businesses, improves market accessibility, and strengthens the competitiveness and global recognition of the cinnamon industry.</p>
      <div className="line-gold"></div>
    </motion.div>

    {/* Image Area: Left eke sita (Fade-in & Out) */}
    <motion.div 
      className="image-area vision-bg"
      initial={{ opacity: 0, x: -100 }} // Wam paththe (Left) sita ena nisa -100 danna
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Inner div eka motion div ekata pitin thiyanna puluwan natham kelinma motion div eka image eka widiyata use karanna puluwan */}
      <div className="image-area vision-bg"></div>
    </motion.div>
  </div>
</section>

      {/* 5. FOOTER */}
      <section className="snap-section footer-snap">
        <Footer />
      </section>

    </div>
  );
}