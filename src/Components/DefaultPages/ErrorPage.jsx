import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
    const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('email');
	}
    return (
        <div class="error-page">
            <div className="main-wrapper">
            <div class="error-box">
                <h1>404</h1>
                <h3><i class="fa fa-warning"></i> Oops! Page not found!</h3>
                <p>The page you requested was not found.</p>
                <Link onClick={handleLogout} to="/" class="btn btn-custom">Back to Home</Link>
            </div>
            </div>
        </div>
    )
}

export default ErrorPage