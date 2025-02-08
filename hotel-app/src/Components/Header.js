import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import '../Styles/Header.css'; 

function Header() {
  const [activeLink, setActiveLink] = useState("menu");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>FoodX</h1>
      </div>

      <nav className="header-details">
        <div className="links">
          <a
            href="/"
            className={`nav-link ${activeLink === "menu" ? "active" : ""}`}
            onClick={() => handleLinkClick("menu")}
          >
            Menu
          </a>
          <a
            href="/orders"
            className={`nav-link ${activeLink === "orders" ? "active" : ""}`}
            onClick={() => handleLinkClick("orders")}
          >
            Orders
          </a>
          <a
            href="/staffs"
            className={`nav-link ${activeLink === "staffs" ? "active" : ""}`}
            onClick={() => handleLinkClick("staffs")}
          >
            Staffs
          </a>
          <div className="cart">
            <FontAwesomeIcon className="icon" icon={faShoppingBasket} />
            <div className="cart-number">0</div>
          </div>
        </div>

        <div className="cart-signup">
          <a href="/login" className="signup-btn">
            Login
          </a>
          <a href="/sign-up" className="signup-btn">
            Sign Up
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
