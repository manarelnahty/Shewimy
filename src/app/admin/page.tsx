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
} from "@/lib/firebase/hooks";
import { updateInspectionRequestStatus } from "@/lib/firebase/firestore";
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
    <div className="space-y-8 max-w-7xl mx-auto font-cairo">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-outline-variant/20">
        <div>
          <span className="text-xs text-secondary font-semibold uppercase tracking-wider block mb-1">
            لوحة الإدارة السحابية
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-readex">
            متابعة الكتالوج والمعاينات
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            إحصائيات فورية ومزامنة سحابية مع قاعدة بيانات Firestore
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(31,94,75,0.2)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موديل جديد</span>
          </Link>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <CalendarCheck className="w-4 h-4 text-secondary" />
            <span>كافة الطلبات ({requests.length})</span>
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards (Matching TrustBar and Landing Page Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant font-medium">المنتجات في الكتالوج</span>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary font-readex">
                {loadingProducts ? "..." : products.length}
              </span>
              <span className="text-xs text-[#1F5E4B] font-semibold">موديل نشط</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              موزعة على 5 أقسام رئيسية حسب معايير DRD
            </p>
          </div>
        </div>

        {/* New Requests */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant font-medium">طلبات جديدة بانتظار التواصل</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-amber-800 font-readex">
                {loadingRequests ? "..." : newRequests.length}
              </span>
              <span className="text-xs text-amber-700 font-semibold">طلب جديد</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              عملاء ينتظرون الاتصال وتحديد موعد المعاينة
            </p>
          </div>
        </div>

        {/* Scheduled Inspections */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant font-medium">معاينات مجدولة</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary font-readex">
                {loadingRequests ? "..." : scheduledRequests.length}
              </span>
              <span className="text-xs text-on-surface-variant">من أصل {requests.length} طلب</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              تم التنسيق وموعد الرفع الهندسي محدد
            </p>
          </div>
        </div>

        {/* Active Branches */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant font-medium">فروع المعارض النشطة</span>
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed/40 text-secondary flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary font-readex">
                {branches.length}
              </span>
              <span className="text-xs text-[#1F5E4B] font-semibold">فروع في الدلتا</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              المنصورة • المحلة الكبرى • سمنود
            </p>
          </div>
        </div>
      </div>

      {/* DRD Catalog Taxonomy Breakdown */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-primary font-readex">
              توزيع المنتجات والكتالوج (DRD Taxonomy)
            </h2>
            <p className="text-xs text-on-surface-variant">
              النسب الرسمية المستهدفة وفق وثيقة المواصفات الفنية
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs text-secondary hover:underline font-semibold flex items-center gap-1"
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
                className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between hover:bg-surface-container transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary font-readex">
                      {info.labelAr.split(" ")[0]}
                    </span>
                    <span className="text-[10px] bg-secondary-fixed/50 text-secondary font-bold px-2 py-0.5 rounded-full font-mono">
                      {info.sharePercent}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 leading-relaxed">
                    {info.labelAr}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-primary font-readex">
                    {count}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">موديل متوفر</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Inspection Requests Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-primary font-readex">
              أحدث طلبات المعاينة والاستشارات
            </h2>
            <p className="text-xs text-on-surface-variant">
              الطلبات الواردة مباشرة من استمارة حجز المعاينة بالموقع
            </p>
          </div>
          <Link
            href="/admin/requests"
            className="text-xs text-secondary hover:underline font-semibold flex items-center gap-1"
          >
            <span>إدارة كل الطلبات ({requests.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant">
            <CalendarCheck className="w-10 h-10 mx-auto text-outline-variant mb-3" />
            <p className="text-sm font-medium">لا توجد طلبات معاينة مسجلة حتى الآن</p>
            <p className="text-xs text-on-surface-variant/80 mt-1">
              الطلبات المقدمة من نموذج &quot;صمم مطبخك&quot; ستظهر هنا فورياً
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-container-low border-b border-outline-variant/20 text-on-surface-variant">
                <tr>
                  <th className="py-3 px-4 font-semibold">اسم العميل</th>
                  <th className="py-3 px-4 font-semibold">رقم الهاتف</th>
                  <th className="py-3 px-4 font-semibold">الفرع المفضل</th>
                  <th className="py-3 px-4 font-semibold">الخدمة المطلوبة</th>
                  <th className="py-3 px-4 font-semibold">حالة الطلب</th>
                  <th className="py-3 px-4 font-semibold text-center">الإجراء السريع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                {requests.slice(0, 6).map((req) => {
                  const cleanPhone = (req.phoneNumber || "").replace(/[^0-9]/g, "");
                  const intlPhone = cleanPhone.startsWith("0")
                    ? `2${cleanPhone}`
                    : cleanPhone;

                  const whatsappUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(
                    `مرحباً أستاذ ${req.clientName}، معك إدارة مطابخ الشويمي بخصوص طلب المعاينة الخاص بحضرتكم.`
                  )}`;

                  return (
                    <tr key={req.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-primary font-readex">
                        {req.clientName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                        {req.phoneNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-surface-container text-on-surface font-medium">
                          {req.selectedBranch === "mansoura"
                            ? "المنصورة"
                            : req.selectedBranch === "mahalla"
                            ? "المحلة الكبرى"
                            : "سمنود"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
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
                          className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2.5 py-1 text-[11px] text-on-surface focus:outline-none focus:border-secondary"
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
                            className="p-1.5 rounded-lg bg-emerald-50 text-[#1F5E4B] hover:bg-emerald-100 transition-colors"
                            title="مراسلة عبر واتساب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${req.phoneNumber}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
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
