import { useTheme } from "../context/ThemeContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const HomePage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [files, setFiles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated by verifying the token with the backend
    axios
      .get("/api/verify-token", { withCredentials: true }) // API to check token validity
      .then((response) => {
        setIsAuthenticated(true); // Token is valid, user is authenticated
        // If authenticated, fetch files
        return axios.get("/api/files", { withCredentials: true });
      })
      .then((response) => {
        setFiles(response.data); // Load files if authenticated
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        setIsAuthenticated(false); // Token is invalid or not found
        navigate("/login"); // Redirect to login page if not authenticated
      });
  }, [navigate]);

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent any default behavior (if it's part of a form)

    try {
      const response = await axios.get("/api/logout", { 
        withCredentials: true, // Ensure cookies are included in the request
      });

      if (response.data === "Logged out") {
        setIsAuthenticated(false); // Set user as logged out
        navigate("/login"); // Redirect to login page after successful logout
      } else {
        console.log(response.data); // Display any error message from the backend
      }
    } catch (error) {
      console.error(error.response?.data || "Something went wrong"); // Handle any errors
    }
  };

  return (
    <main className={`w-full h-screen ${isDark ? "bg-zinc-900 text-white" : "bg-zinc-100 text-black"} font-['Helvetica']`}>
      {/* Navbar */}
      <nav className="flex px-10 justify-between py-5">
        <h3 className="text-2xl tracking-tight">Secure-NoteBook</h3>
        <div className="navlinks flex gap-5">
        <Link className="tracking-tight" to="/Home">Home</Link>
        <Link className="tracking-tight" to="/create">Create New Hisaab</Link>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={toggleTheme} className="text-xl">
            {isDark ? "🌙" : "☀️"}
          </button>
          {/* Show logout button only if authenticated */}
          {isAuthenticated && (
            <button onClick={handleLogout} className="text-xl" title="Logout">
              <i className="ri-logout-box-line"></i>
            </button>
          )}
        </div>
      </nav>

      {/* Hisaabs Section */}
      <div className="px-10 hisaabs">
        <h3 className="capitalize text-2xl font-medium mb-5 mt-10 tracking-tight">All hisaab kitaab</h3>
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file}
              className="hisaab w-fit items-center py-3 mb-3 px-5 gap-20 bg-blue-500 flex justify-between rounded-md"
            >
              <div className="flex gap-4 text-white items-center">
                <h3 className="text-2xl">{file.split(".")[0]}</h3>
                <a href={`/hisaab/${file}`}>
                  <i className="w-6 h-6 text-blue-500 flex items-center justify-center bg-white rounded-full ri-arrow-right-line"></i>
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <a href={`/edit/${file}`}>
                  <i className="text-white ri-pencil-line"></i>
                </a>
                <a href={`/delete/${file}`}>
                  <i className="w-6 h-6 text-red-500 flex items-center justify-center bg-white rounded-full ri-delete-bin-line"></i>
                </a>
              </div>
            </div>
          ))
        ) : (
          <h3 className="text-zinc-500">Currently nothing to show, create hisaabs to see something.</h3>
        )}
      </div>
    </main>
  );
};

export default HomePage;
