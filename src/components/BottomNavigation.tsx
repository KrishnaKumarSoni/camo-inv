// Bottom navigation component
// PRD: navigation: "Bottom tab bar with 3 tabs: Add Item, Inventory, SKUs"

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Package, Tag, SignOut } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const tabs = [
    {
      path: '/add',
      label: 'Add Item',
      icon: Plus,
      weight: 'bold' as const
    },
    {
      path: '/inventory',
      label: 'Inventory',
      icon: Package,
      weight: 'bold' as const
    },
    {
      path: '/skus',
      label: 'SKUs',
      icon: Tag,
      weight: 'bold' as const
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-5 left-5 right-5 max-w-mobile mx-auto bg-black rounded-full shadow-lg">
      {/* PRD: navigation: "Bottom tab bar with 3 tabs: Add Item, Inventory, SKUs" */}
      {/* Updated: super rounded semi circular corners, floating with 20px margins, black background */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Main tabs */}
        <div className="flex flex-1 justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-button transition-colors ${
                  active 
                    ? 'text-accent' 
                    : 'text-white hover:text-accent'
                }`}
              >
                <Icon 
                  size={20} 
                  weight={active ? 'fill' : 'regular'} 
                />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Logout button */}
        {/* PRD: header: "Simple header with page title and logout button NO TOP NAV BAR" */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center py-2 px-3 text-white hover:text-red-400 transition-colors"
          title="Logout"
        >
          <SignOut size={20} />
          <span className="text-xs mt-1 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}