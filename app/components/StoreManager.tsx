"use client";

import { useState } from "react";
import { Product, Category } from "../data";

interface StoreManagerProps {
  products: Product[];
  categories: Category[];
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onUpdateProductDetails: (productId: string, updatedFields: Partial<Product>) => void;
  onAddProduct: (product: Omit<Product, "id">) => void;
  onDeleteProduct: (productId: string) => void;
  onResetToDefault: () => void;
}

export default function StoreManager({
  products,
  categories,
  onUpdateProductPrice,
  onUpdateProductDetails,
  onAddProduct,
  onDeleteProduct,
  onResetToDefault,
}: StoreManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newNameUrdu, setNewNameUrdu] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0]?.id || "suzuki-84");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameUrdu.includes(searchTerm) ||
      (product.code && product.code.includes(searchTerm));
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePriceChange = (productId: string, valStr: string) => {
    const cleanVal = valStr.replace(/[^0-9]/g, "");
    const parsed = parseInt(cleanVal, 10);
    if (!isNaN(parsed)) {
      onUpdateProductPrice(productId, parsed);
    } else if (cleanVal === "") {
      onUpdateProductPrice(productId, 0);
    }
  };

  const handleFieldChange = (productId: string, field: keyof Product, val: string) => {
    onUpdateProductDetails(productId, { [field]: val });
  };

  const handleAddSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    const parsedPrice = parseInt(newPrice, 10);
    onAddProduct({
      code: newCode || undefined,
      name: newName,
      nameUrdu: newNameUrdu,
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      category: newCategory,
    });
    setNewCode("");
    setNewName("");
    setNewNameUrdu("");
    setNewPrice("");
    setIsAdding(false);
  };

  const categoryName =
    selectedCategory === "all"
      ? "All Categories"
      : categories.find((c) => c.id === selectedCategory)?.name || "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Store Inventory
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Update pricing, add products, or reset to defaults
              </p>
            </div>
          </div>
        </div>

        {/* Stats + Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Stats chips */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
              <svg className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Products</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{products.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/40">
              <svg className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Categories</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{categories.length}</p>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={onResetToDefault}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reset Defaults
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Item
          </button>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by code, English or Urdu name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Results label */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-3.5 w-0.5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600"></div>
        <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
          Showing{" "}
          <span className="font-black text-slate-800 dark:text-white">{filteredProducts.length}</span>{" "}
          {selectedCategory !== "all" && (
            <>items in <span className="text-indigo-600 dark:text-indigo-400">{categoryName}</span></>
          )}
          {selectedCategory === "all" && "items"}
        </p>
      </div>

      {/* ── Inventory Table ── */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800/60">
                <th className="w-12 px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  #
                </th>
                <th className="w-16 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Code
                </th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Item Details (English / Urdu)
                </th>
                <th className="w-44 px-4 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Price (Rs.)
                </th>
                <th className="w-16 px-4 py-3.5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Del
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-700/60">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="group transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-950/10"
                  >
                    {/* Row number */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[10px] font-black text-slate-400 dark:bg-zinc-800 dark:text-zinc-600">
                        {index + 1}
                      </span>
                    </td>

                    {/* Code */}
                    <td className="px-4 py-3.5">
                      <span className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-black text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
                        #{product.code || "–"}
                      </span>
                    </td>

                    {/* Names */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => handleFieldChange(product.id, "name", e.target.value)}
                          className="w-full max-w-xs border-b border-transparent bg-transparent py-0.5 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-300 focus:border-indigo-500 focus:outline-none dark:text-white dark:hover:border-zinc-600"
                        />
                        <input
                          type="text"
                          value={product.nameUrdu}
                          onChange={(e) => handleFieldChange(product.id, "nameUrdu", e.target.value)}
                          dir="rtl"
                          className="w-full max-w-48 border-b border-transparent bg-transparent py-0.5 text-right text-xs font-semibold text-slate-400 transition-colors hover:border-slate-300 focus:border-indigo-500 focus:outline-none dark:text-zinc-500 dark:hover:border-zinc-600 font-urdu"
                        />
                      </div>
                    </td>

                    {/* Price input */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800">
                        <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">Rs.</span>
                        <input
                          type="text"
                          value={product.price === 0 ? "" : product.price.toLocaleString()}
                          onChange={(e) => handlePriceChange(product.id, e.target.value)}
                          placeholder="0"
                          className="w-24 border-0 bg-transparent p-0 text-right text-sm font-black text-slate-900 focus:outline-none dark:text-white"
                        />
                      </div>
                    </td>

                    {/* Delete */}
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="rounded-lg p-1.5 text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 group-hover:opacity-100 dark:text-zinc-700 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                        title="Delete product"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800">
                        <svg className="h-7 w-7 text-slate-400 dark:text-zinc-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-slate-500 dark:text-zinc-500">No items match your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Product Modal ── */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/25">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Add New Product</h3>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    Code (optional)
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. 53"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Item Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Front Door Girdle"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  آئٹم کا نام (Urdu)
                </label>
                <input
                  type="text"
                  value={newNameUrdu}
                  onChange={(e) => setNewNameUrdu(e.target.value)}
                  placeholder="مثال: فرنٹ شو پردہ"
                  dir="rtl"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-urdu"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-4 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
