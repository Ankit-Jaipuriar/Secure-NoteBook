import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";  // Import useNavigate

const CreateHisaab = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  
  const [encryption, setEncryption] = useState(false);
  const [shareable, setShareable] = useState(false);
  const [editable, setEditable] = useState(false);
  const [passcode, setPasscode] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Ensure cookies are sent with requests
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !content) {
      setMessage("Title and Content are required.");
      return;
    }

    // Collecting the form data including the new options
    const fileData = {
      fileName: title,
      content,
      encryption,
      shareable,
      editable,
      passcode: encryption ? passcode : "", // Include passcode only if encryption is checked
    };

    try {
      const response = await axios.post("/api/upload", fileData);

      // Assuming a success message is returned from the server
      setMessage(response.data.message || "Uploaded Successfully");
      
      // Redirect to Home page after successful upload
      navigate("/Home");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("An error occurred while uploading the file.");
    }
  };

  return (
    <main className="w-full h-screen bg-zinc-100 font-['Helvetica']">
      <nav className="flex px-10 justify-between py-5">
        <h3 className="text-2xl tracking-tight">Secure-NoteBook</h3>
        <div className="navlinks flex gap-5">
          <Link className="tracking-tight" to="/Home">Home</Link>
          <Link className="tracking-tight" to="/create">Create New Hisaab</Link>
        </div>
      </nav>
      <div className="px-10 hisaabs">
        <h3 className="capitalize text-2xl font-medium mb-5 mt-10 tracking-tight">Create New Hisaab</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            className="text-md px-3 py-2 w-1/2 mb-5 rounded-md bg-zinc-200"
            type="text"
            placeholder="Shopping ka hisaab, ghar ka kharch..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            name="content"
            className="block w-1/2 px-3 py-2 resize-none bg-zinc-200 rounded-md min-h-96"
            placeholder="Write your hisaab."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          {/* Encryption Option */}
          <div className="flex items-center my-4">
            <input
              type="checkbox"
              checked={encryption}
              onChange={() => setEncryption(!encryption)}
              className="mr-2"
            />
            <label>Encryption</label>
          </div>

          {/* Passcode Input - Only visible if encryption is checked */}
          {encryption && (
            <input
              type="password"
              className="text-md px-3 py-2 w-1/2 mb-5 rounded-md bg-zinc-200"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
          )}

          {/* Shareable Option */}
          <div className="flex items-center my-4">
            <input
              type="checkbox"
              checked={shareable}
              onChange={() => setShareable(!shareable)}
              className="mr-2"
            />
            <label>Shareable</label>
          </div>

          {/* Editable Option */}
          <div className="flex items-center my-4">
            <input
              type="checkbox"
              checked={editable}
              onChange={() => setEditable(!editable)}
              disabled={!encryption || !shareable} // Disable if encryption or shareable are unchecked
              className="mr-2"
            />
            <label>Editable</label>
          </div>

          {/* Submit Button */}
          <input
            type="submit"
            className="block mt-5 px-5 py-3 bg-blue-500 text-white rounded-md"
            value="Create Hisaab"
          />
        </form>

        {/* Display messages */}
        {message && <p className="text-red-500 mt-3">{message}</p>}
      </div>
    </main>
  );
};

export default CreateHisaab;
