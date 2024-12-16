import './App.css';
import { ThemeProvider, useTheme } from './context/ThemeContext'; // Make sure to import useTheme from context
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './components/HomePage'; 
import Create from './components/Create'; 
import Login from './components/Login';
import Register from './components/Register';
import { useEffect } from 'react'; // Don't forget to import useEffect

function App() {
  const { isDark } = useTheme(); // Use the useTheme hook here
  
  // Apply theme dynamically based on the value of isDark
  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} /> {/* Register page route */}
        <Route path="/create" element={<Create />} /> {/* Create page route */}
        <Route path="/login" element={<Login />} /> {/* Login page route */}
        <Route path="/Home" element={<HomePage />} /> {/* Home page route */}
      </Routes>
    </Router>
  );
}

export default function MainApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
