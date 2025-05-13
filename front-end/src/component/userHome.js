import "../css/userHome.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function UserHomePageComponent() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [showPopup, setShowPopup] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        catagorie: "",
        author: "",
        email: "",
        image: null
    });

    const [searchTitle, setSearchTitle] = useState({ title: "" });

    const fetchAllBlogs = () => {
        fetch(`http://localhost:5000/blogs`)
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Error fetching blogs:", err));
    };

    useEffect(() => {
        fetchAllBlogs();
    }, []);

    const filterByCategory = (category) => {
        fetch(`http://localhost:5000/blogs/catagorie/${category}`)
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Error fetching category blogs:", err));
    };

    const searchTopic = () => {
        const title = searchTitle.title.trim();
        if (title.length > 0) {
            fetch(`http://localhost:5000/blogs/${title}`)
                .then(res => res.json())
                .then(data => setBlogs(data))
                .catch(err => console.error("Error fetching title blogs:", err));
        } else {
            fetchAllBlogs();
        }
    };

    const handleSearch = (e) => {
        const { name, value } = e.target;
        setSearchTitle({ [name]: value });
    };

    useEffect(() => {
        const email = localStorage.getItem("email");
        if (!email) {
            navigate("/");
            return;
        }
        setUserEmail(email);
        setFormData((prevData) => ({ ...prevData, email }));
    }, [navigate]);

    const resetForm = () => {
        setFormData({
            title: "",
            content: "",
            catagorie: "",
            author: "",
            email: userEmail,
            image: null
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('catagorie', formData.catagorie);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('image', formData.image);  // Attach the image

        // Log the formData to see if all fields are being set
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }

        try {
            const response = await axios.post('http://localhost:5000/blog', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            alert("Blog uploaded Successfully")
            resetForm(); // Reset the form after submission
            setShowPopup(false); // Close the popup
        } catch (error) {
            console.error('Add error:', error);
            setMessage(error.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const logout = () => {
        localStorage.removeItem("email");
        navigate("/");
    };

    const userBlog = () => {
        navigate("/userBlog");
    };

    return (
        <div>
            <header>
                <nav className="navbar">
                    <h3>Bloggers</h3>
                    <div className="buttonHome">
                        <p>{userEmail}</p>
                        <button className="userbtn" onClick={togglePopup}>Add Post +</button>
                        <button className="userbtn" onClick={userBlog}>Your Blogs</button>
                        <button className="button" onClick={logout}>Logout</button>
                    </div>
                </nav>
            </header>

            <main>
                <div className="categories">
                    <h3>Categories :</h3>
                    {["Sports", "Fitness", "Programing", "Nature", "Travelling", "Study", "Politics"].map((cat) => (
                        <button key={cat} onClick={() => filterByCategory(cat)}>{cat}</button>
                    ))}
                    <button onClick={fetchAllBlogs}>Show All</button>
                </div>

                <div className="blogsContainer">
                    <div className="serchBar">
                        <input type="text" name="title" onChange={handleSearch} placeholder="Search your topic by entering title" />
                        <button onClick={searchTopic}>Search</button>
                    </div>

                    {message && <p>{message}</p>}

                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h2>Add Blog</h2>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <label>Title:</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />

                                    <label>Content:</label>
                                    <textarea name="content" value={formData.content} onChange={handleChange} required />

                                    <label>Category:</label>
                                    <input type="text" name="catagorie" value={formData.catagorie} onChange={handleChange} required />

                                    <label>Author:</label>
                                    <input type="text" name="author" value={formData.author} onChange={handleChange} required />

                                    {/* Hidden email field */}
                                    <input type="hidden" name="email" value={formData.email} />

                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleChange}
                                        style={{ display: "none" }}
                                    />

                                    {/* Button to trigger file input */}
                                    <button type="button" onClick={() => fileInputRef.current.click()}>
                                        Upload Image
                                    </button>

                                    <div className="popup-buttons">
                                        <button type="submit" className="button">Submit</button>
                                        <button type="button" className="button cancel" onClick={togglePopup}>Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="blogs">
                        {blogs.length > 0 ? blogs.map((blog, index) => (
                            <div className="blog" key={index}>
                                <h3>{blog.title}</h3>

                                {/* ✅ Show image if it exists */}
                                {blog.image && (
                                    <img
                                        src={`http://localhost:5000/uploads/${blog.image}`}
                                        alt={blog.title}
                                        style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                                    />
                                )}

                                <p>{blog.content}</p>
                                <h5>Author: {blog.author}</h5>
                            </div>
                        )) : (
                            <p>No blogs found.</p>
                        )}
                    </div>

                </div>
            </main>

            <footer>
                <div className="footer">
                    <p>All Rights Reserved || Bloggers.com</p>
                </div>
            </footer>
        </div>
    );
}

export default UserHomePageComponent;
