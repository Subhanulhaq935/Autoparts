"use client";

import { useRef } from "react";
import { Product } from "../data";
import MKSLogo from "./MKSLogo";

interface CartItem {
  product: Product;
  quantity: number;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  customerName?: string;
  invoiceNumber: string;
}

const SHOP = {
  name: "Shabbir Khan Auto Body Parts",
  nameUrdu: "شبیر خان آٹو باڈی پارٹس",
  address: "Bara Sandha Stop, T 4, Band Road, Lahore",
  phones: ["0300-4254118", "0300-4177275", "0334-0450186"],
};

export default function ReceiptModal({
  isOpen,
  onClose,
  cart,
  totalAmount,
  discountAmount = 0,
  customerName = "",
  invoiceNumber,
}: ReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const subtotal = totalAmount + discountAmount;

  const currentDate = new Date().toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm print:relative print:inset-auto print:bg-transparent print:p-0 print:backdrop-blur-none">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 print:rounded-none print:shadow-none print:max-w-none max-h-[92vh] print:max-h-none">

        {/* ── Screen-only top bar ── */}
        <div className="flex items-center justify-between bg-gradient-to-r from-zinc-900 to-zinc-800 px-6 py-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15">
              <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <span className="text-sm font-black text-white">Invoice Generated</span>
            <span className="rounded-full bg-zinc-700 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-300">
              {invoiceNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── INVOICE BODY ── */}
        <div
          ref={printRef}
          className="min-h-0 flex-1 overflow-y-auto bg-white scrollbar-thin print:overflow-visible print:bg-white"
        >
          {/* HEADER: Logo (left) + INVOICE title (right) */}
          <div className="flex items-start justify-between border-b-4 border-zinc-900 px-8 pb-4 pt-5 print:px-6 print:pt-4">

            {/* Left: Logo + company info */}
            <div className="flex items-center gap-4">
              <div className="print:scale-75 print:origin-left">
                <MKSLogo size={80} />
              </div>
              <div>
                <p className="text-base font-light text-zinc-900">{SHOP.name}</p>
                <p className="font-urdu text-sm font-bold text-zinc-700" dir="rtl">{SHOP.nameUrdu}</p>
                <p className="mt-1 text-xs font-light text-zinc-500">{SHOP.address}</p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  {SHOP.phones.map((p) => (
                    <span key={p} className="text-[11px] font-light text-zinc-600">
                      📞 {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: INVOICE title */}
            <div className="text-right">
              <p className="text-3xl font-black uppercase tracking-widest text-zinc-900">
                Invoice
              </p>
              <div className="mt-2 space-y-0.5 text-right text-xs text-zinc-500">
                <p>
                  <span className="font-semibold text-zinc-700">Bill No.:</span>{" "}
                  <span className="font-mono font-black text-zinc-900">{invoiceNumber}</span>
                </p>
                <p>
                  <span className="font-semibold text-zinc-700">Date:</span> {currentDate}
                </p>
                <p>
                  <span className="font-semibold text-zinc-700">Time:</span> {currentTime}
                </p>
                {customerName && (
                  <p className="mt-1 border-t border-zinc-200 pt-1">
                    <span className="font-semibold text-zinc-700">Customer:</span>{" "}
                    <span className="font-black text-zinc-900">{customerName}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* META BOX */}
          <div className="bg-zinc-100 px-8 py-2 print:px-6">
            <div className="flex items-center gap-6 text-xs">
              <div>
                <p className="font-black uppercase tracking-wider text-zinc-400">Items</p>
                <p className="mt-0.5 font-bold text-zinc-800">{cart.length} product{cart.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="h-6 w-px bg-zinc-300" />
              <div>
                <p className="font-black uppercase tracking-wider text-zinc-400">Total Units</p>
                <p className="mt-0.5 font-bold text-zinc-800">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </p>
              </div>
              <div className="h-6 w-px bg-zinc-300" />
              <div>
                <p className="font-black uppercase tracking-wider text-zinc-400">Invoice Amount</p>
                <p className="mt-0.5 font-black text-zinc-900">Rs. {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="px-8 py-2 print:px-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-zinc-900">
                  <th className="py-2 text-left text-[11px] font-black uppercase tracking-widest text-zinc-500">#</th>
                  <th className="py-2 text-left text-[11px] font-black uppercase tracking-widest text-zinc-500">Product / Item</th>
                  <th className="py-2 text-right text-[11px] font-black uppercase tracking-widest text-zinc-500">Qty</th>
                  <th className="py-2 text-right text-[11px] font-black uppercase tracking-widest text-zinc-500">Rate (Rs.)</th>
                  <th className="py-2 text-right text-[11px] font-black uppercase tracking-widest text-zinc-500">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr
                    key={item.product.id}
                    className={`border-b ${index % 2 === 1 ? "bg-zinc-50" : "bg-white"}`}
                  >
                    <td className="py-2 text-xs font-bold text-zinc-400">{index + 1}</td>
                    <td className="py-2 pr-4">
                      <p className="font-light leading-snug text-zinc-900">{item.product.name}</p>
                      {item.product.nameUrdu && (
                        <p className="text-right text-xs font-bold text-zinc-900 font-urdu" dir="rtl"
                          style={{ fontWeight: 700, textShadow: "0 0 0.4px currentColor" }}>
                          {item.product.nameUrdu}
                        </p>
                      )}
                      {item.product.code && (
                        <span className="inline-block rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[9px] font-black text-amber-700">
                          Code #{item.product.code}
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-right font-light text-zinc-700">{item.quantity}</td>
                    <td className="py-2 text-right font-light text-zinc-700">{item.product.price.toLocaleString()}</td>
                    <td className="py-2 text-right font-black text-zinc-900">
                      {(item.product.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER: message (left) + totals (right) */}
          <div className="flex items-end justify-between border-t-2 border-zinc-200 px-8 py-4 print:px-6">

            {/* Left: message */}
            <div className="max-w-xs space-y-1">
              <p className="text-xs font-black uppercase tracking-wider text-zinc-400">Note</p>
              <p className="text-sm font-light text-zinc-700">Thank you for your business!</p>
              <p className="font-urdu text-sm font-bold text-zinc-700" dir="rtl">آپ کا شکریہ</p>
              <p className="mt-2 text-[10px] text-zinc-400">Powered by Antigravity POS</p>
            </div>

            {/* Right: totals breakdown */}
            <div className="min-w-56 space-y-1.5 text-sm">
              {discountAmount > 0 && (
                <div className="flex justify-between gap-8 text-zinc-600">
                  <span className="font-light">Subtotal</span>
                  <span className="font-light">Rs. {subtotal.toLocaleString()}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between gap-8 text-rose-600">
                  <span className="font-light">Discount</span>
                  <span className="font-light">− Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between gap-8 border-t-2 border-zinc-900 pt-2 text-base">
                <span className="font-black text-zinc-900">TOTAL</span>
                <span className="font-black text-zinc-900">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="bg-zinc-900 px-8 py-2.5 text-center print:px-6">
            <p className="text-[11px] font-semibold tracking-wide text-zinc-400">
              {SHOP.name} · {SHOP.address} · {SHOP.phones.join(" · ")}
            </p>
          </div>
        </div>

        {/* ── Action buttons (screen only) ── */}
        <div className="flex gap-3 border-t border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/30 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-zinc-200 bg-white py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            New Sale
          </button>
          <button
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 py-3 text-sm font-bold text-white shadow-lg transition-all hover:from-zinc-700 hover:to-zinc-800"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.821V21h10.56v-7.179m-10.56 0A2.25 2.25 0 0 1 4.5 11.58V8.25a2.25 2.25 0 0 1 2.25-2.25h10.56A2.25 2.25 0 0 1 19.5 8.25v3.33a2.25 2.25 0 0 1-2.22 2.241m-10.56 0h10.56M9 3h6m-6 3h6m-9 9h.008v.008H3.75V15Zm1.5 0h.008v.008H5.25V15Z" />
            </svg>
            Print Invoice
          </button>
        </div>

      </div>
    </div>
  );
}
