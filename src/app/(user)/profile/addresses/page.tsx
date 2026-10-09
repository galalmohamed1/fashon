'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaMapMarkerAlt, FaTimes, FaLocationArrow, FaSpinner } from 'react-icons/fa';

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    recipient: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('user_addresses');
    if (saved) {
      setAddresses(JSON.parse(saved));
    } else {
      // Default initial state if none saved
      const initial = [
        {
          id: 1,
          name: 'Home',
          recipient: 'John Doe',
          street: '123 Main St, Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          isDefault: true,
        }
      ];
      setAddresses(initial);
      localStorage.setItem('user_addresses', JSON.stringify(initial));
    }
  }, []);

  // Save to localStorage whenever addresses change
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem('user_addresses', JSON.stringify(addresses));
    }
  }, [addresses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenForm = (address?: any) => {
    if (address) {
      setFormData(address);
      setEditingId(address.id);
    } else {
      setFormData({ name: '', recipient: '', street: '', city: '', state: '', zipCode: '' });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(a => a.id === editingId ? { ...formData, id: editingId, isDefault: a.isDefault } : a));
    } else {
      const newAddress = {
        ...formData,
        id: Date.now(),
        isDefault: addresses.length === 0, // First address is default
      };
      setAddresses([...addresses, newAddress]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: number) => {
    const updated = addresses.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  // Auto-fill location using Geolocation API and free OpenStreetMap reverse geocoding
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim API (Free, no key required)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (data && data.address) {
            const addr = data.address;
            setFormData(prev => ({
              ...prev,
              street: addr.road || addr.street || addr.suburb || '',
              city: addr.city || addr.town || addr.village || addr.county || '',
              state: addr.state || addr.region || '',
              zipCode: addr.postcode || '',
            }));
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
          alert("Failed to get address from coordinates.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location. Please check your permissions.");
        setIsLoadingLocation(false);
      }
    );
  };

  // Helper to generate a Google Maps embed URL
  const getMapUrl = (address: any) => {
    const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.zipCode}`);
    return `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved delivery addresses.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <FaPlus /> Add New Address
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-5 pt-4">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLoadingLocation}
                className="w-full flex justify-center items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoadingLocation ? <FaSpinner className="animate-spin" /> : <FaLocationArrow />}
                {isLoadingLocation ? 'Detecting Location...' : 'Use My Current Location'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Label (e.g., Home)</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="Home" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Recipient Name</label>
                  <input required name="recipient" value={formData.recipient} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Street Address</label>
                <input required name="street" value={formData.street} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">City</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="New York" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">State</label>
                  <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="NY" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">ZIP</label>
                  <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="10001" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-md shadow-green-600/20">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`relative rounded-xl border-2 overflow-hidden transition-all flex flex-col ${
              address.isDefault
                ? 'border-green-500 bg-green-50/30'
                : 'border-gray-200 hover:border-green-200 bg-white'
            }`}
          >
            {/* Google Maps Iframe */}
            <div className="w-full h-32 bg-gray-100 relative">
              <iframe
                title={`Map for ${address.name}`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={getMapUrl(address)}
                allowFullScreen
              />
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded shadow-sm z-10">
                  Default
                </span>
              )}
            </div>

            <div className="p-5 flex-1">
              <div className="flex items-start gap-3 mb-2">
                <div className="bg-gray-100 p-2.5 rounded-full text-gray-500 mt-1">
                  <FaMapMarkerAlt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{address.name}</h3>
                  <p className="text-gray-700 font-medium text-sm">{address.recipient}</p>
                </div>
              </div>

              <div className="text-gray-500 text-sm space-y-1 mb-5 ml-12">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100/80 mt-auto">
                <button onClick={() => handleOpenForm(address)} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(address.id)} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                  <FaTrash /> Delete
                </button>
                {!address.isDefault && (
                  <button onClick={() => handleSetDefault(address.id)} className="text-sm font-medium text-green-600 hover:text-green-700 ml-auto">
                    Set as default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {addresses.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-gray-500 bg-gray-50">
            <FaMapMarkerAlt className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p>No addresses found.</p>
            <button onClick={() => handleOpenForm()} className="text-green-600 font-medium hover:underline mt-2">Add your first address</button>
          </div>
        )}
      </div>
    </div>
  );
}