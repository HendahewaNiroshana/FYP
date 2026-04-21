import "./css/Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* About Section */}
        <div className="footer-about">
          <h2>Cinnamon Bridge</h2>
          <p>
            Building solutions for a brighter future. Stay connected with us
            through our social platforms.
          </p>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/addreport">Report Account</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: zynnamongrandze@gmail.com</p>
          <p>Phone: +123 456 7890</p>
          <div className="social-icons">
            <a href="www.facebook.com"><FaFacebookF /></a>
            <a href="www.twiter.com"><FaTwitter /></a>
            <a href="www.instergram.com"><FaInstagram /></a>
            <a href="www.linkedin.com"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CinnamonBridge | All Rights Reserved</p>
      </div>
    </footer>
  );
}
