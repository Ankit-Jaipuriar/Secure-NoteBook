import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './components/HomePage'; 
import Create from './components/Create'; 
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} /> {/* Register page route */}
          <Route path="/create" element={<Create />} /> {/* Create page route */}
          <Route path="/login" element={<Login />} /> {/* Login page route */}
          <Route path="/Home" element={<HomePage />} /> {/* Login page route */}

          {/* Add a default route or other routes as needed */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
