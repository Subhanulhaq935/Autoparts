"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "../data";

interface CartItem {
  product: Product;
  quantity: number;
}

interface POSRegisterProps {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateCartQty: (productId: string, qty: number) => void;
  onClearCart: () => void;
  onCheckout: (cashPaid: number, discountAmount: number) => void;
}

export default function POSRegister({
  products,
  categories,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQty,
  onClearCart,
  onCheckout,
}: POSRegisterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cashPaidInput, setCashPaidInput] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("fixed");
  const [discountInput, setDiscountInput] = useState("");

  const totalAmount = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart]
  );

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nameUrdu.includes(searchTerm) ||
        (product.code && product.code.includes(searchTerm));
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const discountAmount = useMemo(() => {
    const val = parseFloat(discountInput) || 0;
    if (val <= 0 || totalAmount <= 0) return 0;
    if (discountType === "percent") {
      return Math.round((Math.min(val, 100) / 100) * totalAmount);
    }
    return Math.min(Math.round(val), totalAmount);
  }, [discountInput, discountType, totalAmount]);

  const discountedTotal = totalAmount - discountAmount;

  const parsedCashPaid = parseFloat(cashPaidInput) || 0;
  const changeDue = Math.max(0, parsedCashPaid - discountedTotal);

  const selectedCategoryLabel =
    selectedCategory === "all"
      ? null
      : categories.find((c) => c.id === selectedCategory)?.name;

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (parsedCashPaid < discountedTotal) {
      alert("Amount paid is less than the total amount!");
      return;
    }
    onCheckout(parsedCashPaid, discountAmount);
    setCashPaidInput("");
    setDiscountInput("");
  };

  const checkoutLabel = () => {
    if (cart.length === 0) return "Add Items to Checkout";
    if (parsedCashPaid <= 0) return "Complete Checkout";
    if (parsedCashPaid < discountedTotal)
      return `Short by Rs. ${(discountedTotal - parsedCashPaid).toLocaleString()}`;
    return "Complete Checkout →";
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:gap-6 lg:px-8">

      {/* ═══ LEFT: Products Panel ═══ */}
      <div className="min-w-0 flex-1 space-y-4">

        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by item code, English or Urdu name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-2xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm transition-colors duration-200 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filter Pills — reliable outer/inner scroll pattern */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex min-w-max gap-2">
            {/* All */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
              }`}
            >
              All Items
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                selectedCategory === "all"
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 text-slate-500 dark:bg-zinc-700 dark:text-zinc-400"
              }`}>
                {products.length}
              </span>
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                  selectedCategory === c.id
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
                }`}
              >
                {c.name}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                  selectedCategory === c.id
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-zinc-700 dark:text-zinc-400"
                }`}>
                  {categoryCounts[c.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600"></div>
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""}
            </span>
            {selectedCategoryLabel && (
              <span className="text-sm text-slate-400 dark:text-zinc-500">
                in <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedCategoryLabel}</span>
              </span>
            )}
            {searchTerm && (
              <span className="text-sm text-slate-400 dark:text-zinc-500">
                for "<span className="font-semibold text-violet-600 dark:text-violet-400">{searchTerm}</span>"
              </span>
            )}
          </div>
          {filteredProducts.length > 0 && (
            <span className="text-xs font-mono font-semibold text-slate-400 dark:text-zinc-600">
              #1 – #{filteredProducts.length}
            </span>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => {
            const inCart = cart.find((item) => item.product.id === product.id);
            return (
              <button
                key={product.id}
                onClick={() => onAddToCart(product)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-zinc-900 ${
                  inCart
                    ? "border-indigo-300 shadow-md shadow-indigo-100 ring-1 ring-indigo-200 dark:border-indigo-700 dark:shadow-indigo-950 dark:ring-indigo-900"
                    : "border-slate-200 shadow-sm hover:border-indigo-300 dark:border-zinc-700 dark:hover:border-indigo-600"
                }`}
              >
                {/* Top row: sequential index + code badge */}
                <div className="flex items-start justify-between">
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-slate-100 px-1 text-[10px] font-black text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {inCart && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white shadow-sm shadow-indigo-500/30">
                        {inCart.quantity}
                      </span>
                    )}
                    {product.code && (
                      <span className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-black text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
                        #{product.code}
                      </span>
                    )}
                  </div>
                </div>

                {/* Names */}
                <div className="mt-2.5 flex-1 space-y-1">
                  <p className="line-clamp-2 text-xs font-light leading-tight text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
                    {product.name}
                  </p>
                  <p className="line-clamp-1 text-right text-[10px] font-bold leading-relaxed text-slate-500 dark:text-zinc-400 font-urdu" dir="rtl">
                    {product.nameUrdu}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-zinc-700/60">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Rs.</span>
                  <span className="text-sm font-black text-indigo-600 transition-colors group-hover:text-violet-600 dark:text-indigo-400 dark:group-hover:text-violet-400">
                    {product.price.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800">
                <svg className="h-8 w-8 text-slate-400 dark:text-zinc-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">No items found</h3>
              <p className="mt-1 text-xs text-slate-400 dark:text-zinc-600">Try a different search term or category.</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT: Cart Panel ═══ */}
      <div className="w-full shrink-0 lg:sticky lg:top-20 lg:w-96 lg:max-h-[calc(100vh-5.5rem)]">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">

          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-zinc-700/60">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/25">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white">Current Order</h2>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                  {cartItemCount > 0 ? `${cartItemCount} unit${cartItemCount !== 1 ? "s" : ""} · ${cart.length} item${cart.length !== 1 ? "s" : ""}` : "Empty"}
                </p>
              </div>
            </div>
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 scrollbar-thin">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-zinc-800/60"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[9px] font-black text-slate-400 dark:text-zinc-600">
                      #{item.product.code || "–"}
                    </span>
                  </div>
                  <p className="truncate text-xs font-light text-slate-900 dark:text-white leading-tight">
                    {item.product.name}
                  </p>
                  <p className="text-right text-[10px] font-bold text-slate-500 dark:text-zinc-400 font-urdu leading-loose" dir="rtl">
                    {item.product.nameUrdu}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                    Rs.{item.product.price.toLocaleString()} × {item.quantity} =&nbsp;
                    <span className="font-black text-indigo-600 dark:text-indigo-400">
                      Rs.{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 pt-0.5">
                  <button
                    onClick={() => onRemoveFromCart(item.product.id)}
                    className="text-slate-300 transition-colors hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-zinc-600 dark:bg-zinc-700">
                    <button
                      onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1)}
                      className="flex h-6 w-7 items-center justify-center text-sm font-bold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                    >
                      −
                    </button>
                    <span className="min-w-7 px-1 text-center text-xs font-black text-slate-800 dark:text-zinc-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                      className="flex h-6 w-7 items-center justify-center text-sm font-bold text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800">
                  <svg className="h-7 w-7 text-slate-300 dark:text-zinc-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-400 dark:text-zinc-600">Cart is empty</p>
                <p className="mt-0.5 text-xs text-slate-300 dark:text-zinc-700">Tap a product to start billing</p>
              </div>
            )}
          </div>

          {/* Cart Footer: Totals + Payment */}
          <div className="space-y-3 border-t border-slate-100 bg-white px-5 py-4 dark:border-zinc-700/60 dark:bg-zinc-900">

            {/* Totals block */}
            <div className="space-y-1">
              {discountAmount > 0 && (
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-slate-400 dark:text-zinc-500">Subtotal</span>
                  <span className="font-semibold text-slate-600 dark:text-zinc-300">
                    Rs.&nbsp;{totalAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-rose-500">
                    Discount{discountType === "percent" ? ` (${discountInput}%)` : ""}
                  </span>
                  <span className="font-bold text-rose-500">
                    − Rs.&nbsp;{discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-slate-100 pt-2 dark:border-zinc-700/60">
                <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">Grand Total</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  Rs.&nbsp;{discountedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment + Discount section */}
            {cart.length > 0 && (
              <div className="space-y-2.5 rounded-xl bg-slate-50 p-3 dark:bg-zinc-800/50">

                {/* Discount row */}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                      Discount on Total
                    </p>
                    <input
                      type="number"
                      min="0"
                      placeholder={discountType === "percent" ? "Enter %" : "Enter Rs."}
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      className="block w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 transition-colors focus:border-rose-400 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  {/* % / Rs toggle */}
                  <div className="flex flex-col overflow-hidden rounded-xl border-2 border-slate-200 dark:border-zinc-600">
                    <button
                      onClick={() => { setDiscountType("percent"); setDiscountInput(""); }}
                      className={`px-3 py-1.5 text-xs font-black transition-colors ${
                        discountType === "percent"
                          ? "bg-rose-500 text-white"
                          : "bg-white text-slate-500 hover:bg-slate-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => { setDiscountType("fixed"); setDiscountInput(""); }}
                      className={`border-t border-slate-200 px-3 py-1.5 text-xs font-black transition-colors dark:border-zinc-600 ${
                        discountType === "fixed"
                          ? "bg-rose-500 text-white"
                          : "bg-white text-slate-500 hover:bg-slate-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                    >
                      Rs
                    </button>
                  </div>
                </div>

                {/* Cash Received */}
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Cash Received (Rs.)
                </p>
                <input
                  type="number"
                  placeholder="Enter amount..."
                  value={cashPaidInput}
                  onChange={(e) => setCashPaidInput(e.target.value)}
                  className="block w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-black text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />

                {/* Quick Cash Buttons */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    discountedTotal,
                    Math.ceil(discountedTotal / 500) * 500,
                    Math.ceil(discountedTotal / 1000) * 1000,
                    Math.ceil(discountedTotal / 5000) * 5000,
                  ]
                    .filter((val, i, self) => val > 0 && self.indexOf(val) === i)
                    .slice(0, 3)
                    .map((amount, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCashPaidInput(amount.toString())}
                        className="rounded-lg border border-slate-200 bg-white py-1.5 text-[10px] font-black text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                      >
                        {amount.toLocaleString()}
                      </button>
                    ))}
                </div>

                {/* Change Due */}
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Change:</span>
                  <span className={`text-base font-black ${
                    parsedCashPaid > 0 && changeDue >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-300 dark:text-zinc-700"
                  }`}>
                    Rs.&nbsp;{changeDue.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              disabled={cart.length === 0 || parsedCashPaid < discountedTotal}
              className={`w-full rounded-xl py-3.5 text-sm font-black tracking-wide transition-all duration-200 ${
                cart.length > 0 && parsedCashPaid >= discountedTotal
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40"
                  : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              {checkoutLabel()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
