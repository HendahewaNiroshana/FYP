import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./css/ManageProducts.css";

export default function ManageProducts() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
    price: "",
    stock: ""
  });

  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/products/seller/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setProducts(data.products);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("sellerId", user._id);
    if (form.image) formData.append("image", form.image);

    const url = editId
      ? `http://localhost:5000/api/products/${editId}`
      : "http://localhost:5000/api/products";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if (data.success) {
      if (editId) {
        setProducts(products.map((p) => (p._id === editId ? data.product : p)));
      } else {
        setProducts([...products, data.product]);
      }
      resetForm();
    } else {
      alert(data.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ name: "", description: "", image: null, price: "", stock: "" });
  };

  return (
    <div className="manage-page-container">
      <div className="form-section fade-in">
        <h1 className="main-title">Manage My Products</h1>
        <div className="modern-form-container">
          <h2 className="form-subtitle">{editId ? "Update Product Details" : "Add a New Product"}</h2>
          <form onSubmit={handleSubmit} className="modern-manage-form">
            <div className="input-row">
              <div className="input-group">
                <label>Product Name</label>
                <input type="text" name="name" placeholder="Item name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Price (Rs.)</label>
                <input type="number" name="price" placeholder="0.00" value={form.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea name="description" placeholder="Briefly describe the product..." value={form.description} onChange={handleChange} required />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Stock Quantity</label>
                <input type="number" name="stock" placeholder="Qty" value={form.stock} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Product Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="file-input-field" />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-manage-btn">
                {editId ? "Update Product" : "Publish Product"}
              </button>
              {editId && <button type="button" className="cancel-manage-btn" onClick={resetForm}>Cancel Edit</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="table-section fade-in">
        <h2 className="sub-title">Available Products Inventory</h2>
        <div className="table-wrapper">
          <table className="modern-products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Info</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={`http://localhost:5000${p.image}`} alt={p.name} className="table-thumb" />
                  </td>
                  <td>
                    <div className="td-info">
                      <span className="td-name">{p.name}</span>
                      <span className="td-desc">{p.description.substring(0, 40)}...</span>
                    </div>
                  </td>
                  <td className="td-price">Rs. {p.price}</td>
                  <td>
                    <span className={`stock-tag ${p.stock <= 0 ? "out" : "in"}`}>
                      {p.stock <= 0 ? "Out" : p.stock}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => handleEdit(p)} className="table-edit-btn">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="table-delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}