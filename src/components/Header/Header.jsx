import React from "react";
import "./Header.scss";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="app-header">
            <div className="header-content">
                Continuum
            </div>
            <div className="btn-group">
                <Link to="/">Home</Link>
                <Link to="/">Search</Link>
                <Link to="/">Login</Link>
            </div>
        </div>
    );
};

export default Header;
