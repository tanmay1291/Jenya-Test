import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { fetchProducts } from '../store/slices/productsSlice';

export default function Products() {
  const disp = useDispatch();
  const nav = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { items, total, loading } = useSelector((state) => state.products);
  const [sk, setSk] = useState(0);
  const lim = 10;

  useEffect(() => {
    if (!token) { nav('/login'); return; }
    disp(fetchProducts({ skip: sk, limit: lim }));
  }, [sk, token, disp, nav]);

  const handleLogout = () => {
    disp(logout()); nav('/login');
  };

  const goNext = () => { if (sk + lim < total) setSk(sk + lim); };
  const goPrev = () => { if (sk > 0) setSk(sk - lim); };

  if (!token) return null;

  const pg = Math.floor(sk / lim) + 1;
  const tpg = Math.ceil(total / lim);

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        <div className="header-actions">
          <Link to="/crud" className="crud-link">Manage</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="products-info">
        <p>Total Products: <strong>{total}</strong></p>
      </div>
      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <>
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Brand</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {items.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.title}</td>
                    <td>${prod.price}</td>
                    <td>{prod.stock}</td>
                    <td>{prod.brand || 'N/A'}</td>
                    <td>{prod.category || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button onClick={goPrev} disabled={sk === 0}>Previous</button>
            <span>Page {pg} of {tpg}</span>
            <button onClick={goNext} disabled={sk + lim >= total}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
