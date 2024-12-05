import React, { useEffect, useState } from 'react';
import '../styles/InfoCard.css';
import { Link } from 'react-router-dom';

const InfoCard: React.FC = () => {
  const [totalBlogs, setTotalBlogs] = useState<number>(0); // State to store the total blogs count
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    const fetchTotalBlogs = async () => {
      try {
        const response = await fetch("https://api.gamingpandastudios.com/api/fetch_blogs.php"); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setTotalBlogs(data.length); // Update state with total blogs
      } catch (err) {
        // Properly handle 'unknown' error type
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchTotalBlogs();
  }, []);

  return (
    <div className="container">
      <div className="row mt-4">
        {/* Card 1 */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body card1">
              <h5 className="card-title">{error ? "Error" : totalBlogs}</h5>
              <p className="card-text">
                {error ? error : "Total Blogs Added"}
              </p>
              <Link to="/add-big-blog">
                <button className="btn btn-primary">Add More</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
