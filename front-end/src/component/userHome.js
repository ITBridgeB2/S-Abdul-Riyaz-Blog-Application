import "../css/userHome.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function UserHomePageComponent() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [blogs, setblogs] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        catagorie: "",
        author: "",
        email: ""  // Adding the email field
    });

    const [serchtitle, setserchtitle] = useState({
        title: ""
    });

    // Fetch all blogs
    const fetchAllBlogs = () => {
        fetch(`http://localhost:5000/blogs`)
            .then(res => res.json())
            .then(data => setblogs(data))
            .catch(err => console.error("Error fetching blogs:", err));
    };

    useEffect(() => {
        fetchAllBlogs();
    }, []);

    // Filter blogs by category
    const filterByCategory = (category) => {
        fetch(`http://localhost:5000/blogs/catagorie/${category}`)
            .then(res => res.json())
            .then(data => setblogs(data))
            .catch(err => console.error("Error fetching category blogs:", err));
    };

    // Search by title
    const serchtopic = () => {
        const title = serchtitle.title.trim();
        if (title.length > 0) {
            fetch(`http://localhost:5000/blogs/${title}`)
                .then(res => res.json())
                .then(data => setblogs(data))
                .catch(err => console.error("Error fetching title blogs:", err));
        } else {
            fetchAllBlogs();
        }
    };

    const handleserch = (e) => {
        const { name, value } = e.target;
        setserchtitle({ [name]: value });
    };

    // Set user email from localStorage
    useEffect(() => {
        const email = localStorage.getItem("email");
        if (!email) {
            navigate("/");
            return;
        }
        setUserEmail(email);
        setFormData((prevData) => ({ ...prevData, email }));  // Set email in form data
    }, [navigate]);

    const resetForm = () => {
        setFormData({
            title: "", content: "", catagorie: "", author: "", email: ""  // Reset email as well
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/blog", formData)
            .then((res) => {
                setblogs((prev) => [...prev, { ...formData, id: res.data.id }]);
                alert("Blog Uploaded successfully");
                togglePopup();
                resetForm();
            })
            .catch((err) => console.error("Add error:", err));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                <div className="catagories">
                    <h3>Categories :</h3>
                    {["Sports", "Fitness", "Programing", "Nature", "Travelling", "Study", "Politics"].map((cat) => (
                        <button key={cat} onClick={() => filterByCategory(cat)}>{cat}</button>
                    ))}
                    <button onClick={fetchAllBlogs}>Show All</button>
                </div>

                <div className="blogsContainer">
                    <div className="serchBar">
                        <input type="text" name="title" onChange={handleserch} placeholder="Search your topic by entering title" />
                        <button onClick={serchtopic}>Search</button>
                    </div>

                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h2>Add Blog</h2>
                                <form onSubmit={handleSubmit}>
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
