import "./css/Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {

  const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Ekakata passe ekak ena delay eka
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  },
};

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* About Section */}
        <motion.div 
  className="footer-about"
  initial={{ opacity: 0, x: -50 }} // Wam paththe sita (Left)
  whileInView={{ opacity: 1, x: 0 }} // Position ekata ena widiya
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: false, amount: 0.2 }} // Scroll karaddi nitharama wada kirimata
>
  <h2>Cinnamon Bridge</h2>
  <p>
    Building solutions for a brighter future. Stay connected with us
    through our social platforms.
  </p>
</motion.div>

        {/* Links Section */}
        <div className="footer-links">
      <h3>Quick Links</h3>
      {/* <ul> ekata variant ekai, initial/whileInView states danna */}
      <motion.ul
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.li variants={itemVariants}><a href="/">Home</a></motion.li>
        <motion.li variants={itemVariants}><a href="/about">About</a></motion.li>
        <motion.li variants={itemVariants}><a href="/services">Services</a></motion.li>
        <motion.li variants={itemVariants}><a href="/products">Products</a></motion.li>
        <motion.li variants={itemVariants}><a href="/contact">Contact</a></motion.li>
        <motion.li variants={itemVariants}><a href="/addreport">Report Account</a></motion.li>
      </motion.ul>
    </div>

        {/* Contact Section */}
        <motion.div 
  className="footer-contact"
  initial={{ opacity: 0, x: 50 }} // Dakunu paththe sita (Right)
  whileInView={{ opacity: 1, x: 0 }} // Position ekata ena widiya
  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
  viewport={{ once: false, amount: 0.2 }}
>
  <h3>Contact</h3>
  <p>Email: zynnamongrandze@gmail.com</p>
  <p>Phone: +94 77 986 1099</p>
  <div className="social-icons">
    <a href="https://www.facebook.com"><FaFacebookF /></a>
    <a href="https://www.twitter.com"><FaTwitter /></a>
    <a href="https://www.instagram.com"><FaInstagram /></a>
    <a href="https://www.linkedin.com"><FaLinkedinIn /></a>
  </div>
</motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CinnamonBridge | All Rights Reserved</p>
      </div>
    </footer>
  );
}
