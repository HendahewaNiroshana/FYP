import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./css/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(result);
  }, [searchTerm, products]);

  return (
    <div className="products-container">
      <header className="products-header">
        <h1 className="products-title">Our Products</h1>
        {user?.accountType === "business" && (
          <button className="manage-btn" onClick={() => navigate("/manage-products")}>
            ⚙️ Manage My Products
          </button>
        )}
      </header>

      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const outOfStock = product.stock <= 0;
            return (
              <div
                key={product._id}
                className={`product-card ${outOfStock ? "out-of-stock-card" : ""}`}
              >
                <div className="img-box">
                  <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                  {outOfStock && <div className="out-of-stock-label">Sold Out</div>}
                </div>

                <div className="card-details">
                  <div className="text-content">
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-desc">{product.description.substring(0, 50)}...</p>
                  </div>
                  
                  <div className="action-area">
                    <div className="price-stock-row">
                      <p className="price">Rs. {product.price}</p>
                      <p className={`stock-status ${outOfStock ? "txt-red" : "txt-green"}`}>
                        {outOfStock ? "No Stock" : `Stock: ${product.stock}`}
                      </p>
                    </div>

                    <button
                      className="buy-btn"
                      onClick={() => navigate(`/productsdetails/${product._id}`)}
                      disabled={outOfStock}
                    >
                      {outOfStock ? "Out of Stock" : "View Details"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">No products found for your search.</div>
        )}
      </div>
    </div>
  );
}