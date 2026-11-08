"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  CalendarCheck,
  Building2,
  Clock,
  ArrowUpRight,
  Plus,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  useAdminProducts,
  useAdminRequests,
  useBranches,
  updateInspectionRequestStatus,
} from "@/lib/firebase";
import { MAIN_SECTIONS_INFO, MainSection } from "@/types/shewimy";

export default function AdminDashboardPage() {
  const { products, loading: loadingProducts } = useAdminProducts();
  const { requests, loading: loadingRequests, refetch: refetchRequests } = useAdminRequests();
  const { branches } = useBranches();

  const newRequests = requests.filter((r) => r.status === "new" || !r.status);
  const scheduledRequests = requests.filter((r) => r.status === "visit_scheduled");

  // Section breakdown counts
  const sectionCounts: Record<MainSection, number> = {
    kitchens: products.filter((p) => p.mainSection === "kitchens").length,
    dressing_rooms: products.filter((p) => p.mainSection === "dressing_rooms" || (p.category as any) === "dressing").length,
    furniture: products.filter((p) => p.mainSection === "furniture").length,
    decor: products.filter((p) => p.mainSection === "decor" || (p.category as any) === "cladding").length,
    windows: products.filter((p) => p.mainSection === "windows").length,
  };

  const handleQuickStatusChange = async (
    id: string,
    newStatus: "new" | "contacted" | "visit_scheduled" | "deal_closed"
  ) => {
    await updateInspectionRequestStatus(id, newStatus);
    refetchRequests();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-readex">
            لوحة الإدارة والمتابعة
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            إحصائيات فورية ومزامنة سحابية مع قاعدة بيانات Firestore
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 bg-[#7a5b3e] hover:bg-[#8f6b49] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موديل جديد</span>
          </Link>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <CalendarCheck className="w-4 h-4 text-[#d4af37]" />
            <span>كافة الطلبات ({requests.length})</span>
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-5 shadow-sm hover:border-[#7a5b3e]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">المنتجات في الكتالوج</span>
            <div className="w-9 h-9 rounded-xl bg-[#7a5b3e]/20 text-[#a37953] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-readex">
              {loadingProducts ? "..." : products.length}
            </span>
            <span className="text-xs text-emerald-400">موديل نشط</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            موزعة على 5 أقسام رئيسية حسب معايير DRD
          </p>
        </div>

        {/* New Requests */}
        <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-5 shadow-sm hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">طلبات جديدة بانتظار التواصل</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-readex">
              {loadingRequests ? "..." : newRequests.length}
            </span>
            <span className="text-xs text-amber-400">طلب جديد</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            عملاء ينتظرون الاتصال وتحديد موعد المعاينة
          </p>
        </div>

        {/* Scheduled Inspections */}
        <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-5 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">معاينات مجدولة</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-readex">
              {loadingRequests ? "..." : scheduledRequests.length}
            </span>
            <span className="text-xs text-gray-400">من أصل {requests.length} طلب</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            تم التنسيق وموعد الرفع الهندسي محدد
          </p>
        </div>

        {/* Active Branches */}
        <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-5 shadow-sm hover:border-[#1F5E4B]/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">فروع المعارض النشطة</span>
            <div className="w-9 h-9 rounded-xl bg-[#1F5E4B]/20 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-readex">
              {branches.length}
            </span>
            <span className="text-xs text-emerald-400">فروع في الدلتا</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            المنصورة • المحلة الكبرى • سمنود
          </p>
        </div>
      </div>

      {/* DRD Catalog Taxonomy Breakdown */}
      <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-readex">
              توزيع المنتجات والكتالوج (DRD Taxonomy)
            </h2>
            <p className="text-xs text-gray-400">
              النسب الرسمية المستهدفة وفق وثيقة المتطلبات
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs text-[#d4af37] hover:underline flex items-center gap-1"
          >
            <span>عرض كل المنتجات</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {(Object.keys(MAIN_SECTIONS_INFO) as MainSection[]).map((key) => {
            const info = MAIN_SECTIONS_INFO[key];
            const count = sectionCounts[key] || 0;
            return (
              <div
                key={key}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-200">
                      {info.labelAr.split(" ")[0]}
                    </span>
                    <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-mono">
                      {info.sharePercent}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1">
                    {info.labelAr}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white font-readex">
                    {count}
                  </span>
                  <span className="text-[11px] text-gray-400">موديل متوفر</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Inspection Requests Table */}
      <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-readex">
              أحدث طلبات المعاينة والاستشارات
            </h2>
            <p className="text-xs text-gray-400">
              الطلبات الواردة مباشرة من استمارة حجز المعاينة بالموقع
            </p>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs text-[#d4af37] hover:underline flex items-center gap-1"
          >
            <span>إدارة كل الطلبات ({requests.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <CalendarCheck className="w-10 h-10 mx-auto text-gray-600 mb-3" />
            <p className="text-sm font-medium">لا توجد طلبات معاينة مسجلة حتى الآن</p>
            <p className="text-xs text-gray-500 mt-1">
              الطلبات المقدمة من نموذج &quot;صمم مطبخك&quot; ستظهر هنا فورياً
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-gray-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">اسم العميل</th>
                  <th className="py-3 px-4 font-semibold">رقم الهاتف</th>
                  <th className="py-3 px-4 font-semibold">الفرع المفضل</th>
                  <th className="py-3 px-4 font-semibold">الخدمة المطلوبة</th>
                  <th className="py-3 px-4 font-semibold">حالة الطلب</th>
                  <th className="py-3 px-4 font-semibold text-center">الإجراء السريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {requests.slice(0, 6).map((req) => {
                  const cleanPhone = (req.phoneNumber || "").replace(/[^0-9]/g, "");
                  const intlPhone = cleanPhone.startsWith("0")
                    ? `2${cleanPhone}`
                    : cleanPhone;

                  const whatsappUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(
                    `مرحباً أستاذ ${req.clientName}، معك إدارة مطابخ الشويمي بخصوص طلب المعاينة الخاص بحضرتكم.`
                  )}`;

                  return (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white">
                        {req.clientName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-300">
                        {req.phoneNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-white/5 text-gray-300">
                          {req.selectedBranch === "mansoura"
                            ? "المنصورة"
                            : req.selectedBranch === "mahalla"
                            ? "المحلة الكبرى"
                            : "سمنود"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {req.requestedService === "kitchen_3d"
                          ? "تصميم مطبخ 3D"
                          : req.requestedService === "dressing_inspection"
                          ? "معاينة دريسنج روم"
                          : "ديكورات وتجاليد متكاملة"}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={req.status || "new"}
                          onChange={(e) =>
                            handleQuickStatusChange(req.id!, e.target.value as any)
                          }
                          className="bg-[#131a21] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-gray-200 focus:outline-none"
                        >
                          <option value="new">جديد (بانتظار التواصل)</option>
                          <option value="contacted">تم التواصل</option>
                          <option value="visit_scheduled">تم حجز الزيارة</option>
                          <option value="deal_closed">تم إتمام الاتفاق</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="مراسلة عبر واتساب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${req.phoneNumber}`}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="اتصال هاتفي"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>
                        </div>
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
