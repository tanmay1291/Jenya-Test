import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../store/slices/authSlice';

export default function Register() {
  const [fn, setFn] = useState('');
  const [ln, setLn] = useState('');
  const [u, setU] = useState('');
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [cp, setCp] = useState('');
  const disp = useDispatch();
  const nav = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [vErr, setVErr] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setVErr('');
    if (p !== cp) { setVErr('Passwords do not match'); return; }
    const res = await disp(registerUser({
      firstName: fn, lastName: ln, username: u, email: e, password: p,
    }));
    if (res.payload) { nav('/products'); }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}
        {vErr && <div className="error-message">{vErr}</div>}
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" type="text" value={fn} onChange={(e) => setFn(e.target.value)} placeholder="First name" required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" type="text" value={ln} onChange={(e) => setLn(e.target.value)} placeholder="Last name" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={u} onChange={(e) => setU(e.target.value)} placeholder="Choose a username" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={e} onChange={(e) => setE(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Enter password" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Confirm password" required />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="redirect-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
