import { useTheme } from "../context/ThemeContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiLockLine, RiCheckLine, RiMenuLine, RiCloseLine, RiDeleteBin6Line } from "react-icons/ri";

const HomePage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [files, setFiles] = useState([]);
  const [sortedFiles, setSortedFiles] = useState([]);
  const [filterByDate, setFilterByDate] = useState("newest");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileId, setFileId] = useState(null); // Add state for fileId
  const navigate = useNavigate();

  // Fetch files on page load
  useEffect(() => {
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

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/logout", { withCredentials: true });
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

  const handleVerifyPasscode = async () => {
    try {
      const response = await axios.post("/api/verifyPasscode", {
        fileId,
        passcode,
      });
      if (response.data.success) {
        setShowPopup(false);
        navigate(`/view/${fileId}`)
      } else {
        setErrorMessage("Wrong passcode. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error verifying passcode. Please try again.");
    }
  };

  return (
    <main
      className={`w-full min-h-screen ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"} font-['Helvetica'] p-4 sm:p-6 overflow-y-auto`}
    >
      <nav className="flex justify-between py-2 sm:py-4 items-center sm:px-6 px-4 relative">
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">Secure-NoteBook</h3>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-xl sm:text-2xl sm:hidden hover:scale-110 transition-transform duration-300"
        >
          {isMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
        <div
          className={`absolute top-0 left-0 w-3/4 h-screen bg-gray-800 sm:hidden transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50 ease-in-out`}
        >
          <div className="flex flex-col items-center justify-center space-y-4 mt-24">
            <Link to="/Home" className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/create" className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              Create
            </Link>
            <button onClick={handleLogout} className="text-white text-lg font-medium hover:text-red-400 transition-colors duration-300">
              Logout
            </button>
          </div>
        </div>
        <div className="hidden sm:flex gap-4 items-center">
          <Link className="text-sm sm:text-lg font-medium hover:text-blue-500 transition-colors duration-300" to="/Home">
            Home
          </Link>
          <Link className="text-sm sm:text-lg font-medium hover:text-blue-500 transition-colors duration-300" to="/create">
            Create
          </Link>
        </div>
        <div className="flex gap-3 sm:gap-4 items-center">
          <button onClick={toggleTheme} className="text-lg sm:text-2xl hover:rotate-180 transition-transform duration-500">
            {isDark ? "🌙" : "☀️"}
          </button>
          <button onClick={handleLogout} className="text-lg sm:text-2xl hover:text-red-400 transition-colors duration-300" title="Logout">
            <i className="ri-logout-box-line"></i>
          </button>
        </div>
      </nav>

      {/* File Filter Section */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-6 mt-4">
        <button
          className="bg-gray-200 text-black px-4 py-2 sm:px-5 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center sm:w-auto text-sm"
          onClick={() => setFilterByDate("newest")}
        >
          Filters <i className="ri-filter-line ml-2"></i>
        </button>
        <button
          className="bg-gray-200 text-black px-4 py-2 sm:px-5 sm:py-3 rounded-lg flex items-center sm:w-auto text-sm"
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
          className="bg-blue-500 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg hover:bg-blue-600 hover:scale-105 transition-all duration-300 flex items-center sm:w-auto text-sm"
          onClick={() => setFilterByDate("newest")}
        >
          Newest First <i className="ri-arrow-down-line ml-2"></i>
        </button>
      </div>

      {/* Files Display Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sortedFiles.length > 0 ? (
          sortedFiles.map((file) => (
            <div key={file._id} className="bg-gray-100 text-black p-4 sm:p-6 rounded-lg shadow-md hover:bg-gray-400 hover:shadow-lg hover:scale-105 transition-all duration-300 transform w-full relative">
              <button
                onClick={() => deleteFile(file._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:scale-110 transition-transform duration-300"
              >
                <RiDeleteBin6Line className="text-xl" />
              </button>

              <div className="flex justify-between items-center mb-2">
                <span className={`${file.encrypted ? "bg-blue-500" : "bg-green-500"} text-white px-2 py-1 rounded-lg flex items-center text-xs sm:text-sm`}>
                  {file.encrypted ? (
                    <>
                      <RiLockLine className="mr-1 text-sm sm:text-base" />
                      Encrypted
                    </>
                  ) : (
                    <>
                      <RiCheckLine className="mr-1 text-sm sm:text-base" />
                      Available
                    </>
                  )}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">{file.createdAt}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">{file.fileName}</h2>
              <button
                onClick={() => {
                    if (file.encrypted) {
                        setFileId(file._id); // Set the fileId here
                        setShowPopup(true);
                      } else {
                      navigate(`/view/${file._id}`);
                    }
            }}
              className="text-blue-500 hover:underline hover:scale-105 transition-transform duration-300 text-sm sm:text-lg"  
            >
                View
              </button>
            </div>
          ))
        ) : (
          <h3 className="text-gray-500 text-center text-sm sm:text-xl mt-8">
            Currently nothing to show, create hisaabs to see something.
          </h3>
        )}
      </div>
      
      {showPopup && (
      <div className={`fixed inset-0 ${isDark ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'} flex justify-center items-center z-50`}>
        <div className={`rounded-lg shadow-lg p-6 w-80 ${isDark ? 'bg-white text-black' : 'bg-white text-black'}`}>
          <h2 className="text-lg font-semibold mb-4">Enter Passcode</h2>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
          )}
          <div className="flex justify-between">
            <button
              onClick={handleVerifyPasscode} // Use the stored fileId
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Verify
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </main>
  );
};

export default HomePage;