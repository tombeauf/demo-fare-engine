import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo = () => (
    <div className="brand-logo">
        <Link className="no-dec" to="/">
            <img alt="logo" src="../icons/logo.svg" />
            <span>Fare Engine</span>
        </Link>
    </div>
);

export default BrandLogo;
