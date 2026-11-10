"use client";

import React, { useState } from "react";
import {
  X,
  AlertCircle,
  Loader2,
  Building2,
  MapPin,
  Check,
  Banknote,
  AlertTriangle,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { BRANCHES_LIST } from "@/data/branches";
import { BranchId } from "@/types/shewimy";
import { generateOrderWhatsAppLink } from "@/lib/whatsapp";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, estimatedTotal, clearCart } = useCart();

  const [clientName, setClientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [city, setCity] = useState("المنصورة / الدقهلية");
  const [addressDetails, setAddressDetails] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>("mansoura");
  const [customerNotes, setCustomerNotes] = useState("");
  const [disclaimerChecked, setDisclaimerChecked] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedBranch =
    BRANCHES_LIST.find((b) => b.id === selectedBranchId) || BRANCHES_LIST[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientName.trim()) {
      setError("يرجى إدخال اسم العميل بالكامل");
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setError("يرجى إدخال رقم هاتف وواتساب صحيح (11 رقم)");
      return;
    }

    if (!addressDetails.trim()) {
      setError("يرجى كتابة عنوان المعاينة ومكان الشقة أو الفيلا");
      return;
    }

    if (!disclaimerChecked) {
      setError("يرجى الموافقة على إقرار الأسعار الاسترشادية وطريقة الدفع كاش");
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        clientName: clientName.trim(),
        phoneNumber: cleanPhone,
        alternatePhone: alternatePhone.trim() || undefined,
        city: city.trim(),
        addressDetails: addressDetails.trim(),
        selectedBranch: selectedBranchId,
        branchName: selectedBranch.name,
        branchWhatsapp: selectedBranch.whatsappNumber,
        items,
        totalItemsCount: items.reduce((acc, it) => acc + (it.quantity || 1), 0),
        estimatedTotal,
        customerNotes: customerNotes.trim() || undefined,
        priceDisclaimerAcknowledged: true,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        clearCart();
        // Redirect directly to WhatsApp — mandatory, no intermediate screen
        const waUrl = generateOrderWhatsAppLink(data.order);
        window.location.href = waUrl;
      } else {
        setError(data.error || "فشل تسجيل الطلب، يرجى المحاولة ثانية");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ في الاتصال بالخادم";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e7e5e0] animate-in fade-in zoom-in-95 duration-200 my-auto text-right">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e0]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1F5E4B]/10 text-[#1F5E4B] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1b1c1a] font-readex">
                  تأكيد حجز المعاينة والتعاقد
                </h3>
                <p className="text-[11px] text-[#5e6368]">
                  الدفع نقداً فقط (Cash) • توجيه مباشر لواتساب الفرع
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f8f6f2] hover:bg-[#ece8df] flex items-center justify-center text-[#5e6368] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Branch Selection Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1b1c1a] font-readex">
              1. اختر الفرع الأقرب إليك لاستلام الطلب والمعاينة:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {BRANCHES_LIST.map((b) => {
                const isSelected = selectedBranchId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBranchId(b.id as BranchId)}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#1F5E4B] bg-[#1F5E4B]/5 ring-1 ring-[#1F5E4B]"
                        : "border-[#e7e5e0] bg-[#fbf9f5] hover:border-stone-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1b1c1a]">
                          {b.name.split("(")[0].trim()}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#1F5E4B] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#5e6368] leading-tight line-clamp-1">
                        {b.address}
                      </p>
                    </div>
                    <span className="text-[9px] text-[#855224] font-semibold mt-2 block">
                      واتساب: {b.phones[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client Info Fields */}
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-bold text-[#1b1c1a] font-readex">
              2. بيانات العميل وموقع المعاينة:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#1b1c1a] mb-1">
                  الاسم بالكامل *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: أستاذ أحمد الشربيني"
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1b1c1a] mb-1">
                  رقم الهاتف والواتساب *
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01012345678"
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#1b1c1a] mb-1">
                  المحافظة والمدينة *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: المنصورة - حي الجامعة"
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1b1c1a] mb-1">
                  هاتف بديل (اختياري)
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="01234567890"
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#1b1c1a] mb-1">
                العنوان التفصيلي ومكان المعاينة *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="اسم الشارع، رقم العمارة، رقم الشقة أو اسم الكومباوند..."
                  className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl pr-9 pl-3.5 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
                />
                <MapPin className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#1b1c1a] mb-1">
                ملاحظات أو مواعيد مفضلة للزيارة (اختياري)
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="مثال: الشقة تحت التشطيب النهائي، نفضل الزيارة بعد الساعة ٥ مساءً..."
                className="w-full bg-[#fbf9f5] border border-[#d6d3cd] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1F5E4B] focus:ring-1 focus:ring-[#1F5E4B]"
              />
            </div>
          </div>

          {/* CASH ONLY & PRICE VARIANCE MANDATORY NOTICE */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2.5">
            <div className="flex items-start gap-2">
              <Banknote className="w-4 h-4 text-emerald-800 mt-0.5 shrink-0" />
              <p className="text-xs font-bold text-emerald-900 leading-relaxed font-readex">
                نظام السداد: الدفع نقداً فقط (Cash Only)
              </p>
            </div>
            <p className="text-[11px] text-stone-700 leading-relaxed pr-6">
              يتم سداد دفعة التعاقد نقداً عند موعد المعاينة الهندسية وتوقيع العقد الرسمي بصالة
              عرض الفرع أو بموقعكم، دون الحاجة لأي بطاقات بنكية أونلاين.
            </p>

            <div className="flex items-start gap-2 pt-1 border-t border-amber-200/60">
              <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                <strong>تنبيه معماري هام:</strong> الأسعار المعروضة استرشادية لمساحات قياسية،
                وقد تتغير القيمة الإجمالية بالزيادة أو النقصان وفقاً للرفع الهندسي الدقيق لمساحتكم
                على الطبيعة، ونوع الخامات والإكسسوارات والميكانزمات المختارة عند التعاقد.
              </p>
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={disclaimerChecked}
                onChange={(e) => setDisclaimerChecked(e.target.checked)}
                className="w-4 h-4 text-[#1F5E4B] rounded border-stone-300 focus:ring-[#1F5E4B]"
              />
              <span className="text-[11px] font-bold text-[#1b1c1a]">
                أقر بأن الأسعار استرشادية وتخضع للمعاينة، وأن السداد نقداً فقط عند التعاقد.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#e7e5e0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs text-[#5e6368] hover:text-[#1b1c1a] font-medium transition-colors cursor-pointer"
            >
              رجوع للسلة
            </button>

            <button
              type="submit"
              disabled={submitting || !disclaimerChecked}
              className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>
                {submitting ? "جاري الإرسال لواتساب..." : "تأكيد الطلب وإرساله لواتساب الفرع"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
