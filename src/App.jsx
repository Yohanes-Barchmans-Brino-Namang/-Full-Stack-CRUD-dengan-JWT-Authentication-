import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ProductDashboard from "./pages/ProductDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rute dilindungi dengan cara dibungkus (Wrapper) */}
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;