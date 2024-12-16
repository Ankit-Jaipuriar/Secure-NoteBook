import React, { useState } from 'react';
import { Link } from "react-router-dom";

const CreateHisaab = () => {
  // State to manage form inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    //handle the form data submission here
    // send a POST request to the server
    console.log({ title, content });
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
          <input
            type="submit"
            className="block mt-5 px-5 py-3 bg-blue-500 text-white rounded-md"
            value="Create Hisaab"
          />
        </form>
      </div>
    </main>
  );
};

export default CreateHisaab;
