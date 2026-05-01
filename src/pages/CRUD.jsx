import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../store/slices/productsSlice';

export default function CRUD() {
  const disp = useDispatch();
  const nav = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { items, total, loading, crudLoading, crudError } = useSelector((state) => state.products);
  
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', stock: '', brand: '', category: '', description: '' });

  useEffect(() => {
    if (!token) { nav('/login'); return; }
    if (items.length === 0) { disp(fetchProducts({ skip: 0, limit: 100 })); }
  }, [token, disp, nav, items.length]);

  const handleLogout = () => { disp(logout()); nav('/login'); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setForm({ title: '', price: '', stock: '', brand: '', category: '', description: '' });
    setEditId(null);
    setShow(true);
  };

  const handleEditClick = (prod) => {
    setForm({
      title: prod.title, price: prod.price, stock: prod.stock,
      brand: prod.brand || '', category: prod.category || '', description: prod.description || '',
    });
    setEditId(prod.id);
    setShow(true);
  };

  const handleCancelForm = () => { setShow(false); setEditId(null); };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (editId) { await disp(updateProduct({ id: editId, data: form })); } else { await disp(createProduct(form)); }
    handleCancelForm();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) { await disp(deleteProduct(id)); }
  };

  if (!token) return null;

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Product Management</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      {crudError && <div className="error-message">{crudError}</div>}
      {show && (
        <div className="form-section">
          <h2>{editId ? 'Edit Product' : 'Create New Product'}</h2>
          <form onSubmit={handleSubmitForm} className="crud-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input id="title" type="text" name="title" value={form.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input id="price" type="number" name="price" value={form.price} onChange={handleInputChange} step="0.01" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stock">Stock *</label>
                <input id="stock" type="number" name="stock" value={form.stock} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input id="brand" type="text" name="brand" value={form.brand} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input id="category" type="text" name="category" value={form.category} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={form.description} onChange={handleInputChange} rows="4" />
            </div>
            <div className="form-buttons">
              <button type="submit" disabled={crudLoading} className="submit-btn">{crudLoading ? 'Processing...' : editId ? 'Update' : 'Create'}</button>
              <button type="button" onClick={handleCancelForm} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="records-section">
          <div className="records-grid">
            {items.map((prod) => (
              <div key={prod.id} className="record-card">
                <div className="record-header">
                  <h3>{prod.title}</h3>
                  <span className="record-id">#{prod.id}</span>
                </div>
                <div className="record-details">
                  <p><strong>Price:</strong> ${prod.price}</p>
                  <p><strong>Stock:</strong> {prod.stock}</p>
                  <p><strong>Brand:</strong> {prod.brand || 'N/A'}</p>
                  <p><strong>Category:</strong> {prod.category || 'N/A'}</p>
                  {prod.description && ( <p><strong>Description:</strong> {prod.description}</p> )}
                </div>
                <div className="record-actions">
                  <button onClick={() => handleEditClick(prod)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(prod.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
