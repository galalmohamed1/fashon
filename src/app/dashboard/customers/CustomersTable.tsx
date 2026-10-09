'use client';

import { useState } from 'react';
import { Search, UserCheck, Shield } from 'lucide-react';
import { AdminCustomer } from '@/types/admin/adminCustomer';

interface CustomersTableProps {
  initialCustomers: AdminCustomer[];
}

export function CustomersTable({ initialCustomers }: CustomersTableProps) {
  const [customers] = useState<AdminCustomer[]>(initialCustomers);
  const [search, setSearch] = useState('');

  const filtered = customers.filter((c) => {
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            CLIENT DIRECTORY
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-1">
            CUSTOMERS ({customers.length})
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono uppercase tracking-wider bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black transition-colors"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            Clear
          </button>
        )}
      </div>

      {/* Customers Table */}
      <div className="border border-zinc-200 rounded bg-white overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              {search
                ? 'No customer records match your query.'
                : 'No registered customers found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-3">CUSTOMER</th>
                  <th className="px-6 py-3">EMAIL</th>
                  <th className="px-6 py-3">ROLE</th>
                  <th className="px-6 py-3">JOINED DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {filtered.map((customer) => {
                  const isAdmin = customer.role === 'admin';
                  const date = customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—';

                  return (
                    <tr
                      key={customer._id}
                      className="hover:bg-zinc-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono text-xs font-bold text-zinc-700">
                            {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-medium text-black">
                            {customer.name || 'Unnamed Client'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-zinc-600">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded border ${
                            isAdmin
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}
                        >
                          {isAdmin ? (
                            <Shield className="w-3 h-3 text-white" />
                          ) : (
                            <UserCheck className="w-3 h-3 text-zinc-500" />
                          )}
                          {customer.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                        {date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
