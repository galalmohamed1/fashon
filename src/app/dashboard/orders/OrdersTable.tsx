'use client';

import { useState } from 'react';
import { Search, Loader2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import { updateOrderStatus } from '@/actions/admin.actions';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { AdminOrder, AdminOrderItem } from '@/types/admin/adminOrders';

interface OrdersTableProps {
  initialOrders: AdminOrder[];
}

const statusOptions: AdminOrder['status'][] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filtered = orders.filter((o) => {
    const orderStatus = (o.status || 'pending').toLowerCase();
    const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter.toLowerCase();
    const customer = (
      o.shippingAddress?.fullName ||
      o.user?.name ||
      o.contactEmail ||
      ''
    ).toLowerCase();
    const id = (o._id || '').toLowerCase();
    const matchesSearch =
      id.includes(search.toLowerCase()) || customer.includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (
    orderId: string,
    newStatus: AdminOrder['status']
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        toast.error(res.message || 'Failed to update order status');
      }
    } catch {
      toast.error('An error occurred while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            TRANSACTIONS & FULFILLMENT
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-1">
            ORDERS ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5">
          {['all', ...statusOptions].map((tab) => {
            const isActive = statusFilter === tab;
            const count =
              tab === 'all'
                ? orders.length
                : orders.filter((o) => (o.status || 'pending').toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-black text-white font-bold'
                    : 'bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-zinc-200 rounded bg-white overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              No orders found matching your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-3">ORDER ID</th>
                  <th className="px-6 py-3">CUSTOMER</th>
                  <th className="px-6 py-3">DATE</th>
                  <th className="px-6 py-3">TOTAL</th>
                  <th className="px-6 py-3">STATUS</th>
                  <th className="px-6 py-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {filtered.map((order) => {
                  const id = order._id?.slice(-8).toUpperCase() ?? 'N/A';
                  const customerName =
                    order.shippingAddress?.fullName ||
                    order.user?.name ||
                    order.contactEmail ||
                    'Guest';
                  const date = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—';
                  const total = order.total ?? order.totalPrice ?? 0;
                  const isUpdating = updatingId === order._id;

                  return (
                    <tr key={order._id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-black font-semibold">
                        #{id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-black">{customerName}</p>
                        {order.user?.email && (
                          <p className="text-xs text-zinc-400 font-mono">
                            {order.user.email}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                        {date}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-black">
                        ${total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            disabled={isUpdating}
                            value={(order.status || 'pending').toLowerCase()}
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value as AdminOrder['status']
                              )
                            }
                            className="text-[11px] font-mono uppercase tracking-wider bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1 focus:outline-hidden focus:border-black cursor-pointer disabled:opacity-50"
                          >
                            {statusOptions.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          {isUpdating && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-black hover:bg-zinc-100 rounded border border-zinc-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          VIEW
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded max-w-xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-zinc-200 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  ORDER SPECIFICATION
                </p>
                <h3 className="font-display font-black text-xl text-black uppercase mt-0.5">
                  ORDER #{selectedOrder._id?.slice(-8).toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="cursor-pointer p-1 text-zinc-400 hover:text-black rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded p-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  CURRENT STATUS
                </p>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  ORDER TOTAL
                </p>
                <p className="font-mono text-base font-bold text-black mt-0.5">
                  ${(selectedOrder.total ?? selectedOrder.totalPrice ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-3">
                  ORDER ITEMS ({selectedOrder.items.length})
                </p>
                <div className="border border-zinc-200 rounded overflow-hidden divide-y divide-zinc-100">
                  {selectedOrder.items.map((item: AdminOrderItem, idx: number) => {
                    const productName =
                      typeof item.product === 'object' && item.product?.name
                        ? item.product.name
                        : item.name ?? 'Unknown Product';
                    const qty = item.quantity ?? 1;
                    const price = item.price ?? 0;
                    return (
                      <div key={item._id ?? idx} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-zinc-50/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center font-mono text-[10px] font-bold text-zinc-500 shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black leading-tight">{productName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.size && (
                                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">SIZE: {item.size}</span>
                              )}
                              {item.color && (
                                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">COLOR: {item.color}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono text-xs font-bold text-black">x{qty}</p>
                          <p className="font-mono text-[11px] text-zinc-500">${(price * qty).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customer & Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-50/70 border border-zinc-200 rounded p-4 space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  CUSTOMER
                </p>
                <p className="text-sm font-medium text-black">
                  {selectedOrder.shippingAddress?.fullName ||
                    selectedOrder.user?.name ||
                    'Guest'}
                </p>
                {selectedOrder.user?.email && (
                  <p className="font-mono text-xs text-zinc-600">
                    {selectedOrder.user.email}
                  </p>
                )}
              </div>

              <div className="bg-zinc-50/70 border border-zinc-200 rounded p-4 space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  SHIPPING DESTINATION
                </p>
                {selectedOrder.shippingAddress ? (
                  <p className="text-xs text-zinc-700">
                    {selectedOrder.shippingAddress.address || '—'},{' '}
                    {selectedOrder.shippingAddress.city || '—'},{' '}
                    {selectedOrder.shippingAddress.country || '—'}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400">No shipping address recorded</p>
                )}
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-black text-white font-mono text-xs uppercase tracking-widest rounded hover:bg-zinc-800 transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
