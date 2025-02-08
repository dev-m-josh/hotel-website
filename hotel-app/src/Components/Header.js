import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>FoodX</h1>
      </div>

      <nav className="header-details">
        <div className="links">
          <a href="/" className="nav-link active">
            Menu
          </a>
          <a href="/orders" className="nav-link">
            orders
          </a>
          <a href="/staffs" className="nav-link">
            Staffs
          </a>
          <div className="cart">
            <FontAwesomeIcon className="icon" icon={faShoppingBasket} />
            <div className="cart-number">0</div>
          </div>
        </div>

        <div className="cart-signup">
          <a href="login" className="signup-btn">
            Login
          </a>
          <a href="sign-up" className="signup-btn">
            Sign Up
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
