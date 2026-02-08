import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../assets/css/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <div className="navbar-left">
          <Link to="/dashboard" className="brand" aria-label="Athixwear home">
            ATHIXWEAR
          </Link>
        </div>

        <div className="navbar-right">
          <Link to="/dashboard" className="nav-link-item">
            Shop
          </Link>

          {isAuthenticated && (
            <Link to="/cart" className="nav-link-item cart-link" aria-label="Cart">
              Cart
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          )}

          {isAuthenticated && !isAdmin && (
            <Link to="/profile" className="nav-link-item">
              Profile
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="nav-link-item">
              Admin
            </Link>
          )}

          {!isAuthenticated ? (
            <Link to="/login" className="btn btn-outline nav-auth-btn">
              Login
            </Link>
          ) : (
            <button className="btn btn-outline nav-auth-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
