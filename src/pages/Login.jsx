import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice';

export default function Login() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const disp = useDispatch();
  const nav = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const submit = async (e) => {
    e.preventDefault();
    
    const res = await disp(loginUser({ username: u, password: p }));
    if (res.payload) { nav('/products'); }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={u} onChange={(e) => setU(e.target.value)} placeholder="Enter your username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Enter your password" required />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
        </form>
        <p className="redirect-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
