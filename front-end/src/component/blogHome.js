import "../css/blogHome.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function BlogHomePageComponent() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");

    useEffect(() => {
        fetchAllBlogs();
    }, []);

    const fetchAllBlogs = () => {
        fetch("http://localhost:5000/blogs")
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Error fetching blogs:", err));
    };

    const handleSearchChange = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleSearch = () => {
        const title = searchTitle.trim();

        if (title.length > 0) {
            fetch(`http://localhost:5000/blogs/${encodeURIComponent(title)}`)
                .then(res => res.json())
                .then(data => setBlogs(data))
                .catch(err => console.error("Error searching blogs:", err));
        } else {
            fetchAllBlogs();
        }
    };

    const handleCategoryClick = (category) => {
        fetch(`http://localhost:5000/blogs/catagorie/${category}`)
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Error fetching by category:", err));
    };

    const handleNavigateToRegister = () => navigate("/register");
    const handleNavigateToLogin = () => navigate("/login");

    return (
        <div>
            <header>
                <nav className="navbar">
                    <h3>Bloggers</h3>
                    <div className="buttonHome">
                        <button className="regbtn" onClick={handleNavigateToRegister}>Register</button>
                        <button className="lgnbtn" onClick={handleNavigateToLogin}>Login</button>
                    </div>
                </nav>
            </header>

            <main>
                <div className="catagories">
                    <h3>Categories:</h3>
                    {["Sports", "Fitness", "Programing", "Nature", "Travelling", "Study", "Politics"].map((cat) => (
                        <button key={cat} onClick={() => handleCategoryClick(cat)}>{cat}</button>
                    ))}
                    <button onClick={fetchAllBlogs}>Show All</button>
                </div>

                <div className="blogsContainer">
                    <div className="serchBar">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Search blog by title"
                            value={searchTitle}
                            onChange={handleSearchChange}
                        />
                        <button onClick={handleSearch}>Search</button>
                    </div>

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

export default BlogHomePageComponent;
