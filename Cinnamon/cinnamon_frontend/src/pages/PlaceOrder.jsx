import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/PlaceOrder.css";

export default function PlaceOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);

  const [orderData, setOrderData] = useState({
    name: "",
    address: "",
    phone: "",
    quantity: 1,
    paymentType: "Cash on Delivery",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProduct(data.product);
      })
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const validateCardDetails = () => {
    const { cardNumber, expiry, cvv } = orderData;
    if (cardNumber.length !== 16) return "Card number must be 16 digits!";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry must be MM/YY format!";
    if (cvv.length !== 3) return "CVV must be 3 digits!";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (orderData.quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock!`);
      return;
    }

    if (orderData.paymentType === "Card Payment") {
      const cardError = validateCardDetails();
      if (cardError) {
        alert(cardError);
        return;
      }
    }

    try {
      const orderPayload = {
        productId: id,
        userId: user._id,
        name: orderData.name,
        address: orderData.address,
        phone: orderData.phone,
        quantity: Number(orderData.quantity),
        totalPrice: product.price * orderData.quantity,
        paymentType: orderData.paymentType,
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Order placed successfully!");
        navigate("/");
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (err) {
      alert("⚠️ Server error while placing order.");
    }
  };

  if (!product) return <div className="loading">Loading product details...</div>;

  return (
    <div className="place-order fade-in">
      <h2>Complete Your Order</h2>

      <div className="order-summary">
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className="order-img"
        />
        <div className="order-details-text">
          <h3>{product.name}</h3>
          <p>Price: Rs. {product.price.toLocaleString()}</p>
          <small style={{ color: product.stock < 5 ? "red" : "green" }}>
            Stock Available: {product.stock}
          </small>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" placeholder="Your Name" value={orderData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Delivery Address</label>
          <input type="text" name="address" placeholder="Shipping Address" value={orderData.address} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" placeholder="07XXXXXXXX" value={orderData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" name="quantity" min="1" max={product.stock} value={orderData.quantity} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <div className="payment-options">
            <label className={orderData.paymentType === "Cash on Delivery" ? "active" : ""}>
              <input type="radio" name="paymentType" value="Cash on Delivery" checked={orderData.paymentType === "Cash on Delivery"} onChange={handleChange} />
              Cash on Delivery
            </label>
            <label className={orderData.paymentType === "Card Payment" ? "active" : ""}>
              <input type="radio" name="paymentType" value="Card Payment" checked={orderData.paymentType === "Card Payment"} onChange={handleChange} />
              Card Payment
            </label>
          </div>
        </div>

        {orderData.paymentType === "Card Payment" && (
          <div className="card-details-section slide-down">
            <h4>Debit / Credit Card Details</h4>
            <div className="form-group">
              <input type="text" name="cardNumber" placeholder="Card Number (16 Digits)" maxLength="16" onChange={handleChange} required />
            </div>
            <div className="card-row">
              <input type="text" name="expiry" placeholder="MM/YY" maxLength="5" onChange={handleChange} required />
              <input type="password" name="cvv" placeholder="CVV" maxLength="3" onChange={handleChange} required />
            </div>
          </div>
        )}

        <div className="order-total-box">
          <h4>Total Amount</h4>
          <span className="total-amount">Rs. {(product.price * orderData.quantity).toLocaleString()}</span>
        </div>

        <button type="submit" className="confirm-btn">
          Confirm & Pay
        </button>
      </form>
    </div>
  );
}