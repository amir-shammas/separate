import React, { useContext } from "react";
import AuthContext from "./../../context/authContext";
import { useNavigate } from "react-router-dom";


export default function AdminPanelPrivate({ children }) {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <>
        {authContext.userInfos.role === "ADMIN" ? (
            <>{children}</>
        ) : (
            <>
                <h1>شما اجازه دسترسی به این مسیر را ندارید!!</h1>
                <button onClick={() => 
                    {
                        authContext.logout();
                        navigate("/");
                    }}
                    >خروج از سایت
                </button>
            </>
        )}
        </>
    );

}
