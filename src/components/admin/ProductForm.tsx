'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { Category, SubCategory } from '@/types/category';
import { createProduct, updateProduct } from '@/actions/admin.actions';
import { compressImage } from '@/lib/compressImage';

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: Category[];
  subCategories: SubCategory[];
}

export function ProductForm({
  initialProduct,
  categories,
  subCategories,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const initialSubCatId =
    typeof initialProduct?.subCategory === 'string'
      ? initialProduct.subCategory
      : (initialProduct?.subCategory as any)?._id ?? '';

  const matchedSubCat = (subCategories || []).find(
    (sc) => sc._id === initialSubCatId
  );
  const derivedParentCatId =
    typeof matchedSubCat?.category === 'string'
      ? matchedSubCat.category
      : (matchedSubCat?.category as any)?._id ?? '';

  const initialCatId =
    (typeof initialProduct?.category === 'string'
      ? initialProduct.category
      : (initialProduct?.category as any)?._id) ||
    derivedParentCatId ||
    '';

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialProduct?.name ?? '');
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? '');
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? '');
  const [discountPrice, setDiscountPrice] = useState(
    initialProduct?.discountPrice?.toString() ?? ''
  );
  const [category, setCategory] = useState(initialCatId);
  const [subCategory, setSubCategory] = useState(initialSubCatId);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState(
    (initialProduct as any)?.coupon ?? ''
  );

  const filteredSubCategories = (subCategories || []).filter((sc) => {
    if (!category) return false;
    const scCatId =
      typeof sc.category === 'string'
        ? sc.category
        : (sc.category as Category | null)?._id;
    return scCatId === category;
  });

  const handleCategoryChange = (newCategoryId: string) => {
    setCategory(newCategoryId);
    const subcategoryNew = (subCategories || []).some((sc) => {
      const scCategoryId =
        typeof sc.category === 'string'
          ? sc.category
          : (sc.category as Category | null)?._id;
      return scCategoryId === newCategoryId && sc._id === subCategory;
    });
    if (!subcategoryNew) {
      setSubCategory('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);

    const newPreviews = filesArray.map((f) => URL.createObjectURL(f));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim()) {
    toast.error("Product title is required");
    return;
  }

  if (!description.trim()) {
    toast.error("Product description is required");
    return;
  }

  if (!price || Number(price) <= 0) {
    toast.error("Valid price is required");
    return;
  }

  if (stock === '' || Number(stock) < 0) {
    toast.error("Valid stock quantity is required");
    return;
  }

  if (!category) {
    toast.error("Category is required");
    return;
  }

  if (!subCategory) {
    toast.error("SubCategory is required");
    return;
  }

  if (!selectedFiles.length && !isEditing) {
    toast.error("Product image is required");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    // Product data
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("stock", stock);

    if (discountPrice) {
      formData.append("discountPrice", discountPrice);
    }

    if (category) {
      formData.append("category", category);
    }

    if (subCategory) {
      formData.append("subCategory", subCategory);
    }

    if (couponCode) {
      formData.append("coupon", couponCode);
    }

    // Images
    const compressedFiles = await Promise.all(
      selectedFiles.map((file) => compressImage(file))
    );

    compressedFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Create / Update
    let res ;

    if (isEditing && initialProduct) {
      res = await updateProduct(initialProduct._id, formData);
    } else {
      res = await createProduct(formData);
    }

    if (!res || !res.success) {
      toast.error(res?.message || "Operation failed. Please try again.");
      return;
    }

    toast.success(
      isEditing
        ? "Product updated successfully"
        : "Product created successfully"
    );

    router.push("/dashboard/products");
    router.refresh();

  } catch (err) {
    console.error("[ProductForm] ERROR:", err);
    toast.error("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="max-w-4xl space-y-8">
      {/* Back link & Header */}
      <div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-black mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO PRODUCTS
        </Link>
        <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          {isEditing ? 'CATALOG UPDATE' : 'NEW INVENTORY ENTRY'}
        </p>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-1">
          {isEditing ? `EDIT: ${initialProduct.name}` : 'ADD NEW PRODUCT'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white border border-zinc-200 rounded p-6 space-y-4 shadow-xs">
          <h2 className="font-display font-bold text-sm text-black uppercase tracking-wider">
            PRODUCT DETAILS
          </h2>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. OVERSIZED CYBER HOODIE"
              className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black font-sans transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div>
  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 font-bold mb-1.5">
    Stock*
  </label>
  <input
    type="number"
    min="0"
    value={stock}
    onChange={(e) => setStock(e.target.value)}
    placeholder="e.g. 50"
    required
    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
  />
</div>
            <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the product silhouette, fabric, and fit..."
              className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black font-sans transition-colors"
            />
          </div>
        </div>

        {/* Pricing & Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded p-6 space-y-4 shadow-xs">
            <h2 className="font-display font-bold text-sm text-black uppercase tracking-wider">
              PRICING
            </h2>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                Regular Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="120"
                className="w-full px-4 py-2.5 text-sm font-mono bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                Discount Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="95 (Optional)"
                className="w-full px-4 py-2.5 text-sm font-mono bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded p-6 space-y-4 shadow-xs">
            <h2 className="font-display font-bold text-sm text-black uppercase tracking-wider">
              ORGANIZATION
            </h2>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs font-mono uppercase bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black transition-colors"
              >
                <option value="">SELECT CATEGORY</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
                SubCategory *
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
                disabled={!category}
                className="w-full px-4 py-2.5 text-xs font-mono uppercase bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black transition-colors disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!category
                    ? '← SELECT CATEGORY FIRST'
                    : filteredSubCategories.length === 0
                    ? 'NO SUBCATEGORIES IN THIS CATEGORY'
                    : 'SELECT SUBCATEGORY'}
                </option>
                {filteredSubCategories.map((sc) => (
                  <option key={sc._id} value={sc._id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Coupon / Promotions */}
        <div className="bg-white border border-zinc-200 rounded p-6 space-y-4 shadow-xs">
          <h2 className="font-display font-bold text-sm text-black uppercase tracking-wider">
            PROMOTIONS
          </h2>
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 block">
              Apply Coupon Code
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. SAVE20 (Optional)"
              className="w-full px-4 py-2.5 text-sm font-mono tracking-widest uppercase bg-white border border-zinc-200 rounded focus:outline-hidden focus:border-black transition-colors"
            />
            <p className="font-mono text-[10px] text-zinc-400 tracking-wider">
              Leave blank if no coupon applies to this product. Manage coupons under{' '}
              <a href="/dashboard/coupons" className="underline hover:text-black transition-colors">
                Admin → Coupons
              </a>
              .
            </p>
          </div>
        </div>

        {/* Media & Images */}
        <div className="bg-white border border-zinc-200 rounded p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-sm text-black uppercase tracking-wider">
              PRODUCT MEDIA
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Multiple files supported
            </span>
          </div>

          {/* Current images if editing */}
          {isEditing && initialProduct?.images && initialProduct.images.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                CURRENT IMAGES
              </p>
              <div className="flex flex-wrap gap-3">
                {initialProduct.images.map((img, idx) => (
                  <div
                    key={img.public_id || idx}
                    className="w-20 h-24 bg-zinc-100 rounded border border-zinc-200 overflow-hidden relative"
                  >
                    <Image
                      src={img.secure_url}
                      alt="Product"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New files upload area */}
          <div className="space-y-3">
            <label className="border-2 border-dashed border-zinc-200 rounded p-8 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors text-center">
              <Upload className="w-8 h-8 text-zinc-400 mb-2" />
              <p className="font-mono text-xs uppercase tracking-widest font-semibold text-black">
                CLICK TO UPLOAD NEW IMAGES
              </p>
              <p className="font-mono text-[10px] text-zinc-400 tracking-wider mt-1">
                PNG, JPG, WEBP UP TO 5MB EACH
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {filePreviews.length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  NEW IMAGES READY TO UPLOAD ({filePreviews.length})
                </p>
                <div className="flex flex-wrap gap-3">
                  {filePreviews.map((url, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-24 bg-zinc-100 rounded border border-zinc-200 overflow-hidden relative group"
                    >
                      <Image
                        src={url}
                        alt="Preview"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-black transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
          <Link
            href="/dashboard/products"
            className="px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-zinc-600 hover:text-black border border-zinc-200 rounded hover:bg-zinc-50 transition-colors"
          >
            CANCEL
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white font-mono text-xs uppercase tracking-widest rounded hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                SAVING...
              </>
            ) : isEditing ? (
              'UPDATE PRODUCT'
            ) : (
              'CREATE PRODUCT'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
