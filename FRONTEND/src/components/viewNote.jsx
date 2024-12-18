// Rename the file to ViewNote.js
import React from 'react';
import { Link } from 'react-router-dom'; 

const ViewNote = () => {
  return (
    <main className="w-full h-screen bg-zinc-100 font-['Helvetica']">
      {/* Navbar */}
      <nav className="flex px-10 justify-between py-5">
        <h3 className="text-2xl tracking-tight">Khaatabook</h3>
        <div className="navlinks flex gap-5">
          <Link className="tracking-tight" to="#">Home</Link>
          <Link className="tracking-tight" to="#">Create New Hisaab</Link>
        </div>
      </nav>

      {/* Hisaab Content */}
      <div className="px-10 hisaabs">
        <h3 className="text-2xl font-medium mb-5 mt-10 tracking-tight">
          Hisaab of <span className="text-blue-500">12-03-2024</span> date
        </h3>
        <p className="font-medium text-xl mb-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam aperiam labore officiis perspiciatis!
        </p>
        {/* Edit Link */}
        <Link className="text-zinc-400" to="/edit/">edit this hisaab</Link>
      </div>
    </main>
  );
};

export default ViewNote;
