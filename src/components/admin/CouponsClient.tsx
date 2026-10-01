'use client';

import { useState, useTransition } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Check,
  Tag,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Coupon } from '@/types/category';
import { createCoupon, updateCoupon, deleteCoupon } from '@/actions/admin.actions';

interface CouponsClientProps {
  initialCoupons: Coupon[];
}

const emptyForm = {
  code: '',
  discount: '',
  discountType: 'percentage' as 'percentage' | 'fixed',
  expiresAt: '',
  usageLimit: '',
};

export function CouponsClient({ initialCoupons }: CouponsClientProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Coupon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditTarget(coupon);
    setForm({
      code: coupon.code,
      discount: coupon.discount.toString(),
      discountType: coupon.discountType,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
      usageLimit: coupon.usageLimit?.toString() ?? '',
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.code.trim()) {
      toast.error('Coupon code is required');
      return;
    }
    if (!form.discount || Number(form.discount) <= 0) {
      toast.error('Valid discount value is required');
      return;
    }
    setSaving(true);
    try {
      const body = {
        code: form.code.trim().toUpperCase(),
        discount: Number(form.discount),
        discountType: form.discountType,
        ...(form.expiresAt ? { expiresAt: form.expiresAt } : {}),
        ...(form.usageLimit ? { usageLimit: Number(form.usageLimit) } : {}),
      };

      if (editTarget) {
        const res = await updateCoupon(editTarget._id, body);
        if (res.success && res.data) {
          setCoupons((prev) =>
            prev.map((c) => (c._id === editTarget._id ? res.data! : c))
          );
          toast.success('Coupon updated');
          closeModal();
        } else {
          toast.error(res.message || 'Update failed');
        }
      } else {
        const res = await createCoupon(body);
        if (res.success && res.data) {
          setCoupons((prev) => [res.data!, ...prev]);
          toast.success('Coupon created');
          closeModal();
        } else {
          toast.error(res.message || 'Create failed');
        }
      }
    } finally {
      setSaving(false);
    }
  }

  function toggleActive(coupon: Coupon) {
    startTransition(async () => {
      const res = await updateCoupon(coupon._id, { isActive: !coupon.isActive });
      if (res.success && res.data) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? res.data! : c))
        );
        toast.success(`Coupon ${res.data.isActive ? 'activated' : 'deactivated'}`);
      } else {
        toast.error(res.message || 'Failed to toggle coupon');
      }
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    startTransition(async () => {
      const res = await deleteCoupon(id);
      if (res.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
        toast.success('Coupon deleted');
      } else {
        toast.error(res.message || 'Delete failed');
      }
    });
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            PROMOTIONS & DISCOUNTS
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-1">
            COUPONS
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-widest rounded hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          NEW COUPON
        </button>
      </div>

      {/* Table */}
      <div className="border border-zinc-200 rounded bg-white overflow-hidden shadow-xs mt-6">
        {coupons.length === 0 ? (
          <div className="py-16 text-center">
            <Tag className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              No coupons yet. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Usage</th>
                  <th className="px-6 py-3">Expires</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-black tracking-wider bg-zinc-100 px-2.5 py-1 rounded">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-black">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discount}%`
                        : `$${coupon.discount}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                        {coupon.discountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-600">
                      {coupon.usedCount ?? 0}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' / ∞'}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(coupon)}
                        disabled={isPending}
                        className="flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title={coupon.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {coupon.isActive ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-600" />
                            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600">
                              ACTIVE
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-zinc-400" />
                            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                              INACTIVE
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(coupon._id)}
                          className="p-1.5 rounded hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                {editTarget ? 'EDIT COUPON' : 'NEW COUPON'}
              </p>
              <button
                onClick={closeModal}
                className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Code */}
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="w-full px-4 py-2.5 text-sm font-mono bg-white border border-zinc-200 rounded focus:outline-none focus:border-black transition-colors tracking-widest uppercase"
                />
              </div>

              {/* Discount + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    placeholder="20"
                    className="w-full px-4 py-2.5 text-sm font-mono bg-white border border-zinc-200 rounded focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                    Discount Type *
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full px-4 py-2.5 text-xs font-mono uppercase bg-white border border-zinc-200 rounded focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="percentage">PERCENTAGE (%)</option>
                    <option value="fixed">FIXED ($)</option>
                  </select>
                </div>
              </div>

              {/* Expiry + Usage Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                    Expires At
                  </label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm font-mono bg-white border border-zinc-200 rounded focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    placeholder="∞ Unlimited"
                    className="w-full px-4 py-2.5 text-sm font-mono bg-white border border-zinc-200 rounded focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50 rounded-b-xl">
              <button
                onClick={closeModal}
                className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-zinc-600 hover:text-black border border-zinc-200 rounded hover:bg-white transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white font-mono text-xs uppercase tracking-widest rounded hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    SAVING...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {editTarget ? 'UPDATE' : 'CREATE'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200 p-6 space-y-4">
            <p className="font-display font-bold text-base text-black uppercase tracking-wider">
              CONFIRM DELETE
            </p>
            <p className="text-sm text-zinc-600 font-sans">
              Delete this coupon? Any users with this code will no longer be able to use it.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-zinc-600 hover:text-black border border-zinc-200 rounded hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-mono text-xs uppercase tracking-widest rounded hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
