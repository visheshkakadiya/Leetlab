import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { LoginPopup } from "./LoginPopup";
import { useNavigate } from "react-router-dom";

function AuthLayout({ children, authentication }) {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        if (authentication && !authStatus) {
            return; 
        }
        
        if (!authentication && authStatus) {
            navigate('/'); 
            return;
        }
    }, [authStatus, authentication, navigate]);

    if (authentication && !authStatus) {
        return <LoginPopup />;
    }

    if (!authentication && authStatus) {
        return children;
    }

    return children;
}

export default AuthLayout;