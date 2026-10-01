import Link from 'next/link';
import { Package, ShoppingCart, Users, DollarSign, ArrowUpRight, Plus } from 'lucide-react';
import { getAdminStats } from '@/actions/admin.actions';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            DASHBOARD OVERVIEW
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-1">
            CONTROL CENTER
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-widest rounded hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            NEW PRODUCT
          </Link>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-800 border border-zinc-200 text-xs font-mono uppercase tracking-widest rounded hover:bg-zinc-50 transition-colors shadow-xs"
          >
            ORDERS
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL REVENUE"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          sub="Gross sales revenue"
        />
        <StatCard
          label="TOTAL ORDERS"
          value={stats.totalOrders}
          icon={ShoppingCart}
          sub="All processed orders"
        />
        <StatCard
          label="TOTAL PRODUCTS"
          value={stats.totalProducts}
          icon={Package}
          sub="Active catalog items"
        />
        <StatCard
          label="TOTAL CUSTOMERS"
          value={stats.totalCustomers}
          icon={Users}
          sub="Registered accounts"
        />
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-zinc-50 border border-zinc-200 rounded p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-sm text-black uppercase tracking-wider">
            ORDER FULFILLMENT STATUS
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Realtime Breakdown
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => {
            const count = stats.statusCounts[st] ?? 0;
            return (
              <div
                key={st}
                className="bg-white border border-zinc-200 rounded p-3 text-center space-y-1"
              >
                <StatusBadge status={st} />
                <p className="font-display font-black text-xl text-black mt-1">
                  {count}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                  Orders
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="border border-zinc-200 rounded bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="font-display font-bold text-base text-black uppercase tracking-wider">
              RECENT ORDERS
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">
              Latest transactions placed in store
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-zinc-700 hover:text-black font-semibold"
          >
            VIEW ALL <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              No orders recorded yet.
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
                  <th className="px-6 py-3">STATUS</th>
                  <th className="px-6 py-3 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {stats.recentOrders.map((order) => {
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

                  return (
                    <tr key={order._id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-black font-medium">
                        #{id}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-700">
                        {customerName}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                        {date}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs font-bold text-black">
                        ${total.toLocaleString()}
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
