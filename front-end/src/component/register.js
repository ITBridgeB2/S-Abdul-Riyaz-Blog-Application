import "../css/register.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterPageComponent() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        Cpassword: ""

    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Valid email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password !== formData.Cpassword)
            newErrors.Cpassword = "Passwords do not match";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                const data = await response.json();
            
                if (response.ok) {
                    alert("Registered Successfully!");
                    navigate("/userHome");
                } else {
                    alert(data.error || "Registration failed");
                }
            })
            .catch((error) => {
                console.error("Registration error:", error);
                alert("Registration failed. Try again.");
            });
            
        }
    }






    const handleNavigation = () => {
        navigate("/")
    }
    return (<div>

        <main className="main">
            <form onSubmit={handleSubmit}>
                <h1> Register</h1>
                <div>
                    <label for="name">Enter User Name:</label>
                    <input className="reisterInput" name="name" id="name" type="text" onChange={handleChange} placeholder="Enter your name" />
                    {errors.name && <span className="error" >{errors.name}</span>}
                </div>
                <div>
                    <label for="email">Email :</label>
                    <input className="reisterInput" name="email" id="email" type="email" onChange={handleChange} placeholder="Enter your name" />
                    {errors.email && <span className="error" >{errors.email}</span>}
                </div>
                <div>
                    <label for="password">Password : </label>
                    <input className="reisterInput" name="password" id="password" type="password" onChange={handleChange} placeholder="Enter your name" />
                    {errors.password && <span className="error" >{errors.password}</span>}
                </div>
                <div>
                    <label for="Cpassword">Confirm Password</label>
                    <input className="reisterInput" name="Cpassword" id="Cpassword" type="password" onChange={handleChange} placeholder="Enter your name" />
                    {errors.Cpassword && <span className="error" >{errors.Cpassword}</span>}
                </div>
                <div className="btns">
                    <button className="button">Register</button>
                    <button className="button" onClick={handleNavigation}>Back</button>
                </div>
            </form>
        </main>
    </div>);

}

export default RegisterPageComponent;