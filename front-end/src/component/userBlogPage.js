import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/userblogPage.css";

function UserBlogsPage() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: "", content: "", catagorie: "", author: "", image: null });
    const [imagePreview, setImagePreview] = useState(null);

    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        if (!userEmail) {
            navigate("/");
            return;
        }
        axios.get(`http://localhost:5000/user-blogs/${userEmail}`)
            .then(res => setBlogs(res.data.reverse())) // show latest first
            .catch(err => console.error("Error fetching user blogs:", err));
    }, [userEmail, navigate]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            axios.delete(`http://localhost:5000/blogs/${id}`)
                .then(() => {
                    setBlogs(prev => prev.filter(blog => blog.id !== id));
                    alert("Blog deleted successfully!");
                })
                .catch(err => console.error("Delete failed:", err));
        }
    };

    const handleEditClick = (blog) => {
        setEditingBlog(blog.id);
        setEditFormData(blog);
        setImagePreview(blog.image ? `http://localhost:5000/uploads/${blog.image}` : null); // Show current image as preview
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEditFormData(prev => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result); // Set the image preview
        };
        if (file) {
            reader.readAsDataURL(file); // Read the file as URL for preview
        }
    };

    const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editFormData.title);
    formData.append("content", editFormData.content);
    formData.append("catagorie", editFormData.catagorie);
    formData.append("author", editFormData.author);
    if (editFormData.image) {
        formData.append("image", editFormData.image);
    }

    axios.put(`http://localhost:5000/blog/${editingBlog}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    .then(() => {
        setBlogs(prev => prev.map(b => b.id === editingBlog ? { ...editFormData, id: editingBlog } : b));
        setEditingBlog(null);
        alert("Blog updated successfully!");
    })
    .catch((err) => {
        console.error("Edit failed:", err);
        alert("An error occurred while updating the blog.");
    });
};

    const cancelEdit = () => {
        setEditingBlog(null);
        setImagePreview(null);
    };

    return (
        <div className="user-blogs-page">
            <header>
                <h2>Your Blogs</h2>
                <button className="button" onClick={() => navigate("/userHome")}>← Back to Home</button>
            </header>

            <div className="blogs-container">
                {blogs.map(blog => (
                    <div key={blog.id} className="blog-card">
                        {editingBlog === blog.id ? (
                            <form onSubmit={handleEditSubmit} className="edit-form" encType="multipart/form-data">
                                <input type="text" name="title" value={editFormData.title} onChange={handleEditChange} required />
                                <textarea name="content" value={editFormData.content} onChange={handleEditChange} required />
                                <input type="text" name="catagorie" value={editFormData.catagorie} onChange={handleEditChange} required />
                                <input type="text" name="author" value={editFormData.author} onChange={handleEditChange} required />

                                {/* Image upload section */}
                                <div className="image-upload">
                                    {imagePreview && <img src={imagePreview} alt="Image Preview"  style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }} className="image-preview" />}
                                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                                </div>

                                <button className="button" type="submit">Save</button>
                                <button className="button" type="button" onClick={cancelEdit}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <h3>{blog.title}</h3>

                                {/* Image section */}
                                {blog.image && (
                                    <img
                                        src={`http://localhost:5000/uploads/${blog.image}`}
                                        alt={blog.title}
                                         style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                                        className="blog-image"
                                    />
                                )}

                                <p>{blog.content}</p>
                                <small><strong>Category:</strong> {blog.catagorie}</small><br />
                                <small><strong>Author:</strong> {blog.author}</small>
                                <div className="blog-actions">
                                    <button className="button" onClick={() => handleEditClick(blog)}>Edit</button>
                                    <button className="button" onClick={() => handleDelete(blog.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserBlogsPage;
