'use client';

import { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { SubCategory, Category } from '@/types/category';
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '@/actions/admin.actions';

interface SubCategoriesClientProps {
  initialSubCategories: SubCategory[];
  categories: Category[];
}

export function SubCategoriesClient({
  initialSubCategories,
  categories,
}: SubCategoriesClientProps) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>(initialSubCategories);
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SubCategory | null>(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditTarget(null);
    setName('');
    setCategoryId('');
    setModalOpen(true);
  }

  function openEdit(sc: SubCategory) {
    setEditTarget(sc);
    setName(sc.name);
    const catId =
      typeof sc.category === 'string'
        ? sc.category
        : (sc.category as Category | null)?._id ?? '';
    setCategoryId(catId);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setName('');
    setCategoryId('');
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Sub-category name is required');
      return;
    }
    setSaving(true);
    try {
      const body = { name: name.trim(), ...(categoryId ? { category: categoryId } : {}) };

      if (editTarget) {
        const res = await updateSubCategory(editTarget._id, body);
        if (res.success && res.data) {
          setSubCategories((prev) =>
            prev.map((sc) => (sc._id === editTarget._id ? res.data! : sc))
          );
          toast.success('Sub-category updated');
          closeModal();
        } else {
          toast.error(res.message || 'Update failed');
        }
      } else {
        const res = await createSubCategory(body);
        if (res.success && res.data) {
          setSubCategories((prev) => [res.data!, ...prev]);
          toast.success('Sub-category created');
          closeModal();
        } else {
          toast.error(res.message || 'Create failed');
        }
      }
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    startTransition(async () => {
      const res = await deleteSubCategory(id);
      if (res.success) {
        setSubCategories((prev) => prev.filter((sc) => sc._id !== id));
        toast.success('Sub-category deleted');
      } else {
        toast.error(res.message || 'Delete failed');
      }
    });
  }

  function getCategoryName(cat: SubCategory['category']): string {
    if (!cat) return '—';
    if (typeof cat === 'string') {
      const found = categories.find((c) => c._id === cat);
      return found?.name ?? cat;
    }
    return (cat as Category).name;
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            CATALOG MANAGEMENT
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-1">
            SUB-CATEGORIES
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-widest rounded hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          NEW SUB-CATEGORY
        </button>
      </div>

      {/* Table */}
      <div className="border border-zinc-200 rounded bg-white overflow-hidden shadow-xs mt-6">
        {subCategories.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              No sub-categories yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Parent Category</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {subCategories.map((sc) => (
                  <tr key={sc._id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="px-6 py-4 font-sans text-sm font-medium text-black">
                      {sc.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{sc.slug}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 font-mono text-[10px] uppercase tracking-wider rounded">
                        {getCategoryName(sc.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                      {new Date(sc.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(sc)}
                          className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(sc._id)}
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                {editTarget ? 'EDIT SUB-CATEGORY' : 'NEW SUB-CATEGORY'}
              </p>
              <button
                onClick={closeModal}
                className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pajamas"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded focus:outline-none focus:border-black font-sans transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                  Parent Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-mono uppercase bg-white border border-zinc-200 rounded focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">NO PARENT CATEGORY</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
              Delete this sub-category? This cannot be undone.
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
