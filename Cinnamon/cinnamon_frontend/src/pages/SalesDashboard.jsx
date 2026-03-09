import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import "./css/SalesDashboard.css";

export default function SalesDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [orders, setOrders] = useState([]);
  const [prediction, setPrediction] = useState(0);
  const [loading, setLoading] = useState(false);

  const chartData = orders.map(o => ({
    date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    qty: o.quantity
  }));

  useEffect(() => {
    if (!user?._id) return;
    fetch(`http://localhost:5000/api/products/seller/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => setProducts([]));
  }, [user]);

  useEffect(() => {
    if (!selectedProduct) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/prediction/product/${selectedProduct}`)
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setPrediction(Number(data.prediction) || 0);
      })
      .catch(() => {
        setOrders([]);
        setPrediction(0);
      })
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header-premium">
        <div className="header-info">
          <span className="badge-gold">Seller Insights</span>
          <h2>Sales Analytics <span>Dashboard</span></h2>
          <p>Analyzing performance for <b>{user?.name || "Premium Seller"}</b></p>
        </div>
      </header>

      <div className="selection-card">
        <div className="selection-box">
          <label className="select-label">Select Premium Product</label>
          <select
            className="premium-select"
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
          >
            <option value="">-- Click to select a product --</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name} (LKR {p.price.toLocaleString()})</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <div className="cinnamon-spinner"></div>
          <p>AI is processing sales trends...</p>
        </div>
      ) : (
        selectedProduct && (
          <div className="dashboard-grid">
            
            <div className="stat-card-premium prediction-box">
              <div className="card-icon">🔮</div>
              <h3>AI Demand Forecast</h3>
              <div className="stat-value">{prediction} <small>Units</small></div>
              <p className="prediction-note">Estimated demand for next 30 days</p>
              <div className="growth-indicator">↑ Trending Product</div>
            </div>

            <div className="stat-card-premium chart-box">
              <div className="card-header">
                <h3>Sales Volume Trend</h3>
              </div>
              <div className="chart-container-inner">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCinnamon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b36b00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#b36b00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.1)'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="qty" 
                      stroke="#b36b00" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCinnamon)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="stat-card-premium table-box">
              <div className="card-header">
                <h3>Recent Order History</h3>
              </div>
              <div className="table-responsive">
                <table className="cinnamon-table">
                  <thead>
                    <tr>
                      <th>Order Date</th>
                      <th>Quantity Sold</th>
                      <th>Total Revenue</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map(o => (
                        <tr key={o._id}>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td><b>{o.quantity}</b> Units</td>
                          <td className="revenue-cell">LKR {o.totalPrice.toLocaleString()}</td>
                          <td><span className="status-badge">Completed</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="no-data">No recent orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}