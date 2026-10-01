'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2, X, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Category } from '@/types/category';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/actions/admin.actions';

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditTarget(null);
    setName('');
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    setName(cat.name);
    setImageFile(null);
    setImagePreview(cat.image?.secure_url ?? null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setName('');
    setImageFile(null);
    setImagePreview(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      if (imageFile) fd.append('image', imageFile);

      if (editTarget) {
        const res = await updateCategory(editTarget._id, fd);
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c._id === editTarget._id ? res.data! : c))
          );
          toast.success('Category updated');
          closeModal();
        } else {
          toast.error(res.message || 'Update failed');
        }
      } else {
        const res = await createCategory(fd);
        if (res.success && res.data) {
          setCategories((prev) => [res.data!, ...prev]);
          toast.success('Category created');
          closeModal();
        } else {
          toast.error(res.message || 'Create failed');
        }
      }
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(id: string) {
    setDeleteId(id);
  }

  function handleDelete() {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        toast.success('Category deleted');
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
            CATALOG MANAGEMENT
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-1">
            CATEGORIES
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-mono uppercase tracking-widest rounded hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          NEW CATEGORY
        </button>
      </div>

      {/* Table */}
      <div className="border border-zinc-200 rounded bg-white overflow-hidden shadow-xs mt-6">
        {categories.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              No categories yet. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="px-6 py-4">
                      {cat.image?.secure_url ? (
                        <div className="w-12 h-12 rounded border border-zinc-200 overflow-hidden relative bg-zinc-100">
                          <Image
                            src={cat.image.secure_url}
                            alt={cat.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded border border-zinc-200 bg-zinc-100 flex items-center justify-center">
                          <span className="font-mono text-[9px] text-zinc-400">NO IMG</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-sans text-sm font-medium text-black">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                      {new Date(cat.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 hover:text-black transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(cat._id)}
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
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  {editTarget ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Footwear"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded focus:outline-none focus:border-black font-sans transition-colors"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                  Category Image
                </label>
                <label className="border-2 border-dashed border-zinc-200 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors text-center">
                  {imagePreview ? (
                    <div className="relative w-24 h-24">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        sizes="96px"
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-7 h-7 text-zinc-400 mb-2" />
                      <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                        Click to upload image
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Modal Footer */}
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

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200 p-6 space-y-4">
            <p className="font-display font-bold text-base text-black uppercase tracking-wider">
              CONFIRM DELETE
            </p>
            <p className="text-sm text-zinc-600 font-sans">
              Are you sure you want to delete this category? This action cannot be undone.
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
