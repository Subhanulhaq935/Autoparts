"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import POSRegister from "./components/POSRegister";
import StoreManager from "./components/StoreManager";
import ReceiptModal from "./components/ReceiptModal";
import MKSLogo from "./components/MKSLogo";
import {
  Product,
  Category,
  defaultProducts,
  defaultCategories,
} from "./data";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [view, setView] = useState<"register" | "manager">("register");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout Modal State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptCart, setReceiptCart] = useState<CartItem[]>([]);
  const [receiptTotal, setReceiptTotal] = useState(0);
  const [receiptDiscount, setReceiptDiscount] = useState(0);
  const [receiptPaid, setReceiptPaid] = useState(0);
  const [receiptChange, setReceiptChange] = useState(0);
  const [receiptInvoiceNum, setReceiptInvoiceNum] = useState("");

  // Load from local storage and merge any new codebase products/categories
  useEffect(() => {
    const savedProducts = localStorage.getItem("pos_products");
    const savedCategories = localStorage.getItem("pos_categories");

    let currentProducts = defaultProducts;
    let currentCategories = defaultCategories;

    if (savedCategories) {
      try {
        const parsedCategories: Category[] = JSON.parse(savedCategories);
        const parsedIds = new Set(parsedCategories.map((c) => c.id));
        const missingCategories = defaultCategories.filter((c) => !parsedIds.has(c.id));
        
        if (missingCategories.length > 0) {
          currentCategories = [...parsedCategories, ...missingCategories];
          localStorage.setItem("pos_categories", JSON.stringify(currentCategories));
        } else {
          currentCategories = parsedCategories;
        }
      } catch (e) {
        currentCategories = defaultCategories;
      }
    } else {
      localStorage.setItem("pos_categories", JSON.stringify(defaultCategories));
    }
    setCategories(currentCategories);

    if (savedProducts) {
      try {
        const parsedProducts: Product[] = JSON.parse(savedProducts);
        const parsedIds = new Set(parsedProducts.map((p) => p.id));
        const missingProducts = defaultProducts.filter((p) => !parsedIds.has(p.id));

        if (missingProducts.length > 0) {
          currentProducts = [...parsedProducts, ...missingProducts];
          localStorage.setItem("pos_products", JSON.stringify(currentProducts));
        } else {
          currentProducts = parsedProducts;
        }
      } catch (e) {
        currentProducts = defaultProducts;
      }
    } else {
      localStorage.setItem("pos_products", JSON.stringify(defaultProducts));
    }
    setProducts(currentProducts);
  }, []);

  // Save products to local storage
  const saveProductsList = (newList: Product[]) => {
    setProducts(newList);
    localStorage.setItem("pos_products", JSON.stringify(newList));
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Inventory/Store Handlers
  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, price: newPrice } : p
    );
    saveProductsList(updated);
    
    // Sync price inside active cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, price: newPrice } }
          : item
      )
    );
  };

  const handleUpdateProductDetails = (productId: string, updatedFields: Partial<Product>) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, ...updatedFields } : p
    );
    saveProductsList(updated);

    // Sync details inside active cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, ...updatedFields } }
          : item
      )
    );
  };

  const handleAddProduct = (newProduct: Omit<Product, "id">) => {
    const newId = `prod_${Date.now()}`;
    const productWithId: Product = {
      ...newProduct,
      id: newId,
    };
    const updated = [...products, productWithId];
    saveProductsList(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product from inventory?")) {
      const updated = products.filter((p) => p.id !== productId);
      saveProductsList(updated);
      handleRemoveFromCart(productId);
    }
  };

  const handleResetToDefault = () => {
    if (confirm("This will overwrite all price updates and modifications, resetting to default prices. Continue?")) {
      saveProductsList(defaultProducts);
      setCategories(defaultCategories);
      localStorage.setItem("pos_categories", JSON.stringify(defaultCategories));
      setCart([]);
    }
  };

  // Checkout Handler
  const handleCheckout = (cashPaid: number, discountAmount: number) => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const finalTotal = subtotal - discountAmount;
    const change = Math.max(0, cashPaid - finalTotal);

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const invoiceNum = `INV-${randomNum}`;

    setReceiptCart(cart);
    setReceiptTotal(finalTotal);
    setReceiptDiscount(discountAmount);
    setReceiptPaid(cashPaid);
    setReceiptChange(change);
    setReceiptInvoiceNum(invoiceNum);
    setIsReceiptOpen(true);

    setCart([]);
  };

  if (showWelcome) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 scale-150 rounded-full bg-amber-500/8 blur-2xl" />
          <MKSLogo size={170} />
        </div>

        {/* Business name */}
        <h1 className="mt-6 text-4xl font-black tracking-tight text-white">
          <span className="text-amber-400">Shabbir Khan</span> Auto Body Parts
        </h1>
        <p className="mt-1 font-urdu text-lg text-amber-500/70" dir="rtl">
          شبیر خان آٹو باڈی پارٹس
        </p>

        {/* Divider */}
        <div className="mt-5 flex items-center gap-3">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-600/50" />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-600/50" />
        </div>

        {/* Address */}
        <p className="mt-5 flex items-center gap-2 text-sm font-medium text-zinc-400">
          <svg className="h-4 w-4 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          Bara Sandha Stop, T 4, Band Road, Lahore
        </p>

        {/* Phone numbers */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {["0300-4254118", "0300-4177275", "0334-0450186"].map((num) => (
            <div
              key={num}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2"
            >
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0 10.302 8.365 18.662 18.662 18.662 0-5.799-3.03-10.896-7.594-13.825C16.806 8.26 18 5.768 18 3a7.5 7.5 0 0 0-15.75 0c0 1.17.266 2.278.75 3.256-.161.078-.318.16-.473.247A7.5 7.5 0 0 1 2.25 6.338Z" />
              </svg>
              <span className="font-mono text-sm font-semibold text-zinc-300">{num}</span>
            </div>
          ))}
        </div>

        {/* Enter button */}
        <button
          onClick={() => setShowWelcome(false)}
          className="mt-10 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-9 py-4 text-base font-black text-black shadow-2xl shadow-amber-500/25 transition-all hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/35 active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          Enter Billing System
        </button>

        <p className="mt-10 text-xs text-zinc-700">Powered by Antigravity POS</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 print:bg-white print:text-black">
      {/* Top Header */}
      <Header
        currentView={view}
        onViewChange={setView}
        productsCount={products.length}
      />

      {/* Main View Container */}
      <main className="flex-1 print:p-0">
        {view === "register" ? (
          <POSRegister
            products={products}
            categories={categories}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateCartQty={handleUpdateCartQty}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        ) : (
          <StoreManager
            products={products}
            categories={categories}
            onUpdateProductPrice={handleUpdateProductPrice}
            onUpdateProductDetails={handleUpdateProductDetails}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetToDefault={handleResetToDefault}
          />
        )}
      </main>

      {/* Invoice receipt modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        cart={receiptCart}
        totalAmount={receiptTotal}
        discountAmount={receiptDiscount}
        cashPaid={receiptPaid}
        changeDue={receiptChange}
        invoiceNumber={receiptInvoiceNum}
      />
    </div>
  );
}
