import { useTheme } from "../context/ThemeContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles for the date picker
import { RiLockLine, RiEyeOffLine, RiCheckLine, RiMenuLine, RiCloseLine, RiDeleteBin6Line } from "react-icons/ri"; // Remix icons

const HomePage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [files, setFiles] = useState([]);
  const [sortedFiles, setSortedFiles] = useState([]);
  const [filterByDate, setFilterByDate] = useState("newest");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track hamburger menu state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch files directly; backend handles authentication via cookies/session
    axios
      .get("/api/files", { withCredentials: true })
      .then((response) => {
        setFiles(response.data);
        setSortedFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    const sorted = [...files];
    if (filterByDate === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterByDate === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filterByDate === "byDate" && selectedDate) {
      sorted.filter(file =>
        new Date(file.createdAt).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
      );
    }
    setSortedFiles(sorted);
  }, [filterByDate, files, selectedDate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/logout", {
        withCredentials: true,
      });

      if (response.data === "Logged out") {
        navigate("/login");
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error.response?.data || "Logout failed");
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`/api/files/${fileId}`, { withCredentials: true });
      setFiles(files.filter(file => file._id !== fileId));
      setSortedFiles(sortedFiles.filter(file => file._id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <main
      className={`w-full h-auto ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"} font-['Helvetica'] p-4 sm:p-6 overflow-y-auto`}
    >
      {/* Navbar */}
      <nav className="flex justify-between py-2 sm:py-4 items-center sm:px-6 px-4 relative">
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">Secure-NoteBook</h3>

        {/* Hamburger Menu Button for Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-xl sm:text-2xl sm:hidden"
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>

        {/* Menu for Mobile */}
        <div
          className={`absolute top-0 left-0 w-3/4 h-screen bg-gray-800 sm:hidden transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50 ease-in-out`}
        >
          <div className="flex flex-col items-center justify-center space-y-4 mt-24">
            <Link
              to="/Home"
              className="text-white text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-white text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Create New Hisaab
            </Link>
            <button
              onClick={handleLogout}
              className="text-white text-lg font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-4 items-center">
          <Link className="text-sm sm:text-lg font-medium" to="/Home">
            Home
          </Link>
          <Link className="text-sm sm:text-lg font-medium" to="/create">
            Create New Hisaab
          </Link>
        </div>

        <div className="flex gap-3 sm:gap-4 items-center">
          <button onClick={toggleTheme} className="text-lg sm:text-2xl">
            {isDark ? "🌙" : "☀️"}
          </button>
          <button
            onClick={handleLogout}
            className="text-lg sm:text-2xl"
            title="Logout"
          >
            <i className="ri-logout-box-line"></i>
          </button>
        </div>
      </nav>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-6 mt-4">
        <button
          className="bg-gray-200 text-black px-4 py-2 sm:px-5 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center sm:w-auto text-sm"
          onClick={() => setFilterByDate("newest")}
        >
          Filters <i className="ri-filter-line ml-2"></i>
        </button>
        <button
          className="bg-gray-200 text-black px-4 py-2 sm:px-5 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center sm:w-auto text-sm"
          onClick={() => setFilterByDate("byDate")}
        >
          By Date
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            className="ml-2 px-2 py-1 rounded-lg text-black text-sm"
            placeholderText="Select Date"
          />
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center sm:w-auto text-sm"
          onClick={() => setFilterByDate("newest")}
        >
          Newest First <i className="ri-arrow-down-line ml-2"></i>
        </button>
      </div>

      {/* Files Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sortedFiles.length > 0 ? (
          sortedFiles.map((file) => (
            <div
              key={file._id}
              className="bg-gray-100 text-black p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full relative"
            >
              {/* Delete Button */}
              <button
                onClick={() => deleteFile(file._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <RiDeleteBin6Line className="text-xl" />
              </button>
              
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`${
                    file.encrypted ? "bg-blue-500" : "bg-green-500"
                  } text-white px-2 py-1 rounded-lg flex items-center text-xs sm:text-sm`}
                >
                  {file.encrypted ? (
                    <>
                      <RiLockLine className="mr-1 text-sm sm:text-base" />
                      Encrypted
                      <RiEyeOffLine className="ml-1 text-sm sm:text-base" />
                    </>
                  ) : (
                    <>
                      <RiCheckLine className="mr-1 text-sm sm:text-base" />
                      Available
                    </>
                  )}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {new Date(file.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">{file.fileName}</h2>
              <Link
                to={`/hisaab/${file._id}`}
                className="text-blue-500 hover:underline text-sm sm:text-lg"
              >
                View Hisaab
              </Link>
            </div>
          ))
        ) : (
          <h3 className="text-gray-500 text-center text-sm sm:text-xl mt-8">
            Currently nothing to show, create hisaabs to see something.
          </h3>
        )}
      </div>
    </main>
  );
};

export default HomePage;
