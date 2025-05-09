import "../css/register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPageComponent() {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleNavigation = () => {
        navigate("/");
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const login = (e) => {
        e.preventDefault();

        fetch(`http://localhost:5000/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        })
            .then(async (response) => {
                const data = await response.json();
                if (data.message === "Admin logged in successfully") {
                    localStorage.setItem("email", loginData.email);
                    navigate("/adminHome");
                } else if (data.message === "User logged in successfully") {
                    localStorage.setItem("email", loginData.email);

                    navigate("/userHome");
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("Login error:", error);
                alert("Login failed due to server error.");
            });
    };

    return (
        <div>
            <main className="main">
                <form onSubmit={login}>
                    <h1>Login</h1>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            className="reisterInput"
                            name="email"
                            id="email"
                            type="email"
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            className="reisterInput"
                            name="password"
                            id="password"
                            type="password"
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="btns">
                        <button className="button" type="submit">Login</button>
                        <button className="button" type="button" onClick={handleNavigation}>Back</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default LoginPageComponent;
