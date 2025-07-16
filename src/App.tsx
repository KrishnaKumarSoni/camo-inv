// Main App component with routing
// PRD: pages_and_routing: add_item, inventory, skus, login routes

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNavigation from './components/BottomNavigation';
import Login from './pages/Login';
import AddItem from './pages/AddItem';
import Inventory from './pages/Inventory';
import SKUs from './pages/SKUs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-page-bg">
          {/* Main content area */}
          <div className="pb-24"> {/* Add bottom padding for floating navigation */}
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              {/* PRD: access_control: "Only allow access to authenticated users, no role restrictions for MVP" */}
              <Route 
                path="/add" 
                element={
                  <ProtectedRoute>
                    <AddItem />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inventory" 
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/skus" 
                element={
                  <ProtectedRoute>
                    <SKUs />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/add" replace />} />
            </Routes>
          </div>

          {/* Bottom Navigation - only show on protected routes */}
          <Routes>
            <Route 
              path="/add" 
              element={
                <ProtectedRoute>
                  <BottomNavigation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute>
                  <BottomNavigation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/skus" 
              element={
                <ProtectedRoute>
                  <BottomNavigation />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
