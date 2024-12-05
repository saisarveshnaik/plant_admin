import React, { useEffect, useState } from 'react';
import '../styles/ViewBlogs.css';
import { Button } from 'react-bootstrap';

interface Blog {
  blog_id: number;
  blog_title: string;
  blog_image: string;
}

const ViewBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://api.gamingpandastudios.com/api/fetch_blogs.php');
        const data = await response.json();

        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          console.error(data.message || "Error fetching blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle delete blog
  const handleDeleteBlog = async (blogId: number) => {
    try {
      const response = await fetch('https://api.gamingpandastudios.com/api/delete_blog.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blog_id: blogId }),
      });

      const data = await response.json();
      if (data.message === "Blog deleted successfully") {
        alert("Blog deleted successfully");
        // Remove the deleted blog from the state
        setBlogs(blogs.filter(blog => blog.blog_id !== blogId));
      } else {
        alert(data.message || "Error deleting blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog");
    }
  };

  return (
    <div className="container mt-4" id='ViewBlogs'>
      <h1>View Blogs</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Blog ID</th>
                <th>Blog Image</th>
                <th>Blog Title</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.blog_id}>
                  <td>{blog.blog_id}</td>
                  <td>
                    <img src={`https://api.gamingpandastudios.com/api/${blog.blog_image}`} alt={blog.blog_title} width={100} />
                  </td>
                  <td>{blog.blog_title}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteBlog(blog.blog_id)}>
                      Delete Blog
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewBlogs;
