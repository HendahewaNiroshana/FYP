import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "./css/overallsale.css";

export default function AIPredictionPage() {
  const [stats, setStats] = useState({ 
    bestProduct: { name: "N/A", prediction: 0 }, 
    totalRevenue: 0 
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = fetch("http://localhost:5000/api/prediction/overall-stats").then(res => res.json());
    const fetchChart = fetch("http://localhost:5000/api/prediction/sales-chart-data").then(res => res.json());

    Promise.all([fetchStats, fetchChart])
      .then(([statsRes, chartRes]) => {
        if (statsRes.success) setStats(statsRes);
        if (chartRes.success) setChartData(chartRes.data);
      })
      .catch(err => console.error("Error fetching AI data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="ai-loader">
      <div className="pulse-ring"></div>
      <p>AI System is generating your business forecast...</p>
    </div>
  );

  return (
    <div className="ai-container">
      <header className="ai-header">
        <span className="ai-badge">Advanced AI Insights</span>
        <h1 className="ai-title">Business <span>Forecast</span> 🔮</h1>
        <p className="ai-subtitle">Predictive analysis powered by machine learning algorithms</p>
      </header>
      
      <div className="ai-grid">
        <div className="ai-card premium-card">
          <div className="card-accent"></div>
          <div className="icon">🏆</div>
          <h3>Best Selling Prediction</h3>
          <div className="value">{stats.bestProduct?.name}</div>
          <div className="prediction-tag">
            <span>Expected: {stats.bestProduct?.prediction} Units</span>
          </div>
        </div>

        <div className="ai-card premium-card dark-card">
          <div className="card-accent gold"></div>
          <div className="icon">💰</div>
          <h3 className="light-text">Expected Revenue</h3>
          <div className="value gold-text">Rs. {stats.totalRevenue?.toLocaleString()}</div>
          <p className="description light-text">Total estimated for next month</p>
        </div>
      </div>

      <div className="ai-recommendation-box">
        <div className="recom-icon">✨</div>
        <div className="recom-content">
          <h4>AI Smart Recommendation</h4>
          <p>
            Based on historical data, <b>{stats.bestProduct?.name}</b> is showing a strong upward trend. 
            We recommend prioritizing stock levels and running targeted promotions for this category.
          </p>
        </div>
      </div>

      <div className="chart-section-premium">
        <div className="chart-header">
          <h3>📈 Historical Sales Trend</h3>
          <p>Visual representation of your growth over time</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b36b00" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#b36b00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: '#fff'}} 
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#b36b00" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}