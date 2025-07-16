// Inventory list view page
// PRD: inventory: "Inventory list view at /inventory with search and filters"

import React, { useState, useEffect } from 'react';
import { MagnifyingGlass } from 'phosphor-react';

interface InventoryItem {
  id: string;
  sku_id: string;
  serial_number: string;
  barcode: string;
  condition: 'new' | 'good' | 'fair' | 'damaged';
  status: 'available' | 'booked' | 'maintenance' | 'retired';
  location: string;
  purchase_price: number;
  current_value: number;
  notes: string;
  created_at: any;
  created_by: string;
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [statusFilter, conditionFilter]);

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (conditionFilter) params.append('condition', conditionFilter);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/inventory?${params.toString()}`);
      const data = await response.json();
      setInventory(data.inventory || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mobile-container">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-light">
          <h1 className="font-heading text-xl font-semibold">Inventory</h1>
          <p className="text-gray-medium text-sm mt-1">
            {filteredInventory.length} items
          </p>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 space-y-4 border-b border-gray-light">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" />
            <input
              type="text"
              placeholder="Search by serial, barcode, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-medium rounded-input focus:outline-none focus:border-accent font-body"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-3 overflow-x-auto">
            <div className="flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-medium rounded-input text-sm appearance-none bg-white min-w-0"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div className="flex-shrink-0">
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-medium rounded-input text-sm appearance-none bg-white min-w-0"
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-medium">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-medium">No inventory items found</p>
              <p className="text-gray-medium text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <div key={item.id} className="border border-gray-light rounded-card p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">SKU: {item.sku_id}</h3>
                      {item.serial_number && (
                        <p className="text-gray-medium text-xs">SN: {item.serial_number}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-medium text-xs">Location</p>
                      <p className="font-medium">{item.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-medium text-xs">Current Value</p>
                      <p className="font-medium">₹{item.current_value?.toLocaleString() || 0}</p>
                    </div>
                  </div>

                  {item.barcode && (
                    <div className="mt-3 pt-3 border-t border-gray-light">
                      <p className="text-gray-medium text-xs">Barcode: {item.barcode}</p>
                    </div>
                  )}

                  {item.notes && (
                    <div className="mt-3">
                      <p className="text-gray-medium text-xs mb-1">Notes</p>
                      <p className="text-sm">{item.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}