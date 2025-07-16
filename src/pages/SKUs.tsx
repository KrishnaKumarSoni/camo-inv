// SKUs page with category grouping
// PRD: skus: "Equipment types list at /skus with category grouping"

import React, { useState, useEffect } from 'react';
import { MagnifyingGlass, Package } from 'phosphor-react';

interface SKU {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  specifications: Record<string, any>;
  price_per_day: number;
  security_deposit: number;
  image_url: string;
  created_at: any;
  is_active: boolean;
}

interface GroupedSKUs {
  [category: string]: SKU[];
}

export default function SKUs() {
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [groupedSKUs, setGroupedSKUs] = useState<GroupedSKUs>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');

  useEffect(() => {
    fetchSKUs();
  }, [selectedCategory]);

  const fetchSKUs = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('group_by_category', viewMode === 'grouped' ? 'true' : 'false');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/skus?${params.toString()}`);
      const data = await response.json();
      
      if (viewMode === 'grouped') {
        setGroupedSKUs(data.skus_by_category || {});
        // Also set flat list for search
        const flatSKUs = Object.values(data.skus_by_category || {}).flat() as SKU[];
        setSKUs(flatSKUs);
      } else {
        setSKUs(data.skus || []);
      }
    } catch (error) {
      console.error('Failed to fetch SKUs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSKUs = skus.filter(sku =>
    sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sku.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(skus.map(sku => sku.category)));

  const renderSKUCard = (sku: SKU) => (
    <div key={sku.id} className="border border-gray-light rounded-card p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-sm">{sku.name}</h3>
          <p className="text-gray-medium text-xs">{sku.brand} {sku.model}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          sku.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {sku.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {sku.description && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{sku.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-medium text-xs">Daily Rate</p>
          <p className="font-medium">₹{sku.price_per_day?.toLocaleString() || 0}</p>
        </div>
        <div>
          <p className="text-gray-medium text-xs">Security Deposit</p>
          <p className="font-medium">₹{sku.security_deposit?.toLocaleString() || 0}</p>
        </div>
      </div>

      {Object.keys(sku.specifications || {}).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-light">
          <p className="text-gray-medium text-xs mb-2">Key Specs</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(sku.specifications).slice(0, 3).map(([key, value]) => (
              <span key={key} className="px-2 py-1 bg-gray-light text-xs rounded">
                {key}: {String(value)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mobile-container">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-light">
          <h1 className="font-heading text-xl font-semibold">Equipment SKUs</h1>
          <p className="text-gray-medium text-sm mt-1">
            {filteredSKUs.length} equipment types
          </p>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 space-y-4 border-b border-gray-light">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" />
            <input
              type="text"
              placeholder="Search equipment, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-medium rounded-input focus:outline-none focus:border-accent font-body"
            />
          </div>

          {/* View toggle and category filter */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-3 py-2 rounded-input text-sm ${
                  viewMode === 'grouped' 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-light text-gray-700'
                }`}
              >
                Grouped
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-input text-sm ${
                  viewMode === 'list' 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-light text-gray-700'
                }`}
              >
                List
              </button>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-medium rounded-input text-sm appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SKUs Content */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-medium">Loading SKUs...</p>
            </div>
          ) : (
            <div>
              {/* Search results or all items when searching */}
              {searchTerm && (
                <div className="mb-6">
                  <h2 className="font-heading font-medium mb-4">
                    Search Results ({filteredSKUs.length})
                  </h2>
                  {filteredSKUs.length === 0 ? (
                    <p className="text-gray-medium text-center py-4">No SKUs found matching your search</p>
                  ) : (
                    <div className="space-y-4">
                      {filteredSKUs.map(renderSKUCard)}
                    </div>
                  )}
                </div>
              )}

              {/* Grouped view */}
              {!searchTerm && viewMode === 'grouped' && (
                <div className="space-y-6">
                  {Object.entries(groupedSKUs).map(([category, categorySkus]) => (
                    <div key={category}>
                      <div className="flex items-center space-x-2 mb-4">
                        <Package size={20} className="text-accent" />
                        <h2 className="font-heading font-medium">{category}</h2>
                        <span className="text-gray-medium text-sm">({categorySkus.length})</span>
                      </div>
                      
                      {categorySkus.length === 0 ? (
                        <p className="text-gray-medium text-sm pl-7">No items in this category</p>
                      ) : (
                        <div className="space-y-4 pl-7">
                          {categorySkus.map(renderSKUCard)}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {Object.keys(groupedSKUs).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-medium">No SKUs found</p>
                    </div>
                  )}
                </div>
              )}

              {/* List view */}
              {!searchTerm && viewMode === 'list' && (
                <div className="space-y-4">
                  {skus.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-medium">No SKUs found</p>
                    </div>
                  ) : (
                    skus.map(renderSKUCard)
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}