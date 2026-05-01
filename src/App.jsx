

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import CRUD from './pages/CRUD';

function App() {
  const { token } = useSelector((state) => state.auth);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={token ? <Products /> : <Navigate to="/login" />} />
        <Route path="/crud" element={token ? <CRUD /> : <Navigate to="/login" />} />
        <Route path="/" element={token ? <Navigate to="/products" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
export default App;
