"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  Search,
  MessageCircle,
  PhoneCall,
  Clock,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import { useAdminRequests } from "@/lib/firebase/hooks";
import {
  updateInspectionRequestStatus,
  deleteInspectionRequest,
} from "@/lib/firebase/firestore";
import { InspectionRequest, BranchId } from "@/types/shewimy";

export default function AdminRequestsPage() {
  const { requests, loading, error, refetch } = useAdminRequests();

  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  // Filter requests
  const filtered = requests.filter((r) => {
    const matchesBranch =
      branchFilter === "all" || r.selectedBranch === branchFilter;

    const matchesStatus =
      statusFilter === "all" || (r.status || "new") === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.clientName.toLowerCase().includes(q) ||
      r.phoneNumber.includes(q) ||
      (r.customerNotes && r.customerNotes.toLowerCase().includes(q));

    return matchesBranch && matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (
    id: string,
    status: InspectionRequest["status"]
  ) => {
    await updateInspectionRequestStatus(id, status);
    refetch();
    setNotice("تم تحديث حالة الطلب بنجاح");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف طلب العميل "${name}"؟`)) {
      return;
    }
    await deleteInspectionRequest(id);
    refetch();
    setNotice("تم حذف الطلب بنجاح");
    setTimeout(() => setNotice(null), 3000);
  };

  const getBranchLabel = (id: BranchId) => {
    switch (id) {
      case "mansoura":
        return "فرع المنصورة";
      case "mahalla":
        return "فرع المحلة الكبرى";
      case "samanoud":
        return "فرع سمنود";
      default:
        return "الفرع الرئيسي";
    }
  };

  const getServiceLabel = (srv: string) => {
    switch (srv) {
      case "kitchen_3d":
        return "تصميم مطبخ ثلاثي الأبعاد 3D";
      case "dressing_inspection":
        return "معاينة دريسنج روم وغرف ملابس";
      case "full_home_decor":
        return "ديكورات وتجاليد حوائط وأثاث متكامل";
      default:
        return srv;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "deal_closed":
        return { text: "تم إتمام الاتفاق", class: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "visit_scheduled":
        return { text: "تم حجز الزيارة", class: "bg-blue-50 text-blue-800 border-blue-200" };
      case "contacted":
        return { text: "تم التواصل", class: "bg-purple-50 text-purple-800 border-purple-200" };
      default:
        return { text: "جديد (بانتظار التواصل)", class: "bg-amber-50 text-amber-800 border-amber-200" };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-outline-variant/20">
        <div>
          <span className="text-xs text-secondary font-semibold uppercase tracking-wider block mb-1">
            إدارة العملاء والمبيعات
          </span>
          <h1 className="text-2xl font-bold text-primary font-readex">
            طلبات المعاينة والاستشارات
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            متابعة استمارات الزيارات الهندسية والتواصل المباشر مع العملاء عبر الواتساب
          </p>
        </div>

        <div className="text-xs text-on-surface-variant bg-surface-container-lowest border border-outline-variant/20 px-3.5 py-2 rounded-xl shadow-sm">
          إجمالي الطلبات المسجلة: <span className="font-bold text-primary font-mono">{requests.length}</span>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1F5E4B] text-xs flex items-center gap-2 animate-fadeIn font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#1F5E4B]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث باسم العميل، الهاتف، أو الملاحظات..."
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 pl-9 text-xs text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            >
              <option value="all">كل الفروع (المنصورة، المحلة، سمنود)</option>
              <option value="mansoura">فرع المنصورة</option>
              <option value="mahalla">فرع المحلة الكبرى</option>
              <option value="samanoud">فرع سمنود</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            >
              <option value="all">كل الحالات</option>
              <option value="new">جديد (بانتظار التواصل)</option>
              <option value="contacted">تم التواصل</option>
              <option value="visit_scheduled">تم حجز الزيارة</option>
              <option value="deal_closed">تم إتمام الاتفاق</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-16 text-center text-on-surface-variant shadow-sm">
          <CalendarCheck className="w-12 h-12 mx-auto text-outline-variant mb-3" />
          <p className="text-sm font-medium">لم يتم العثور على طلبات مطابقة</p>
          <p className="text-xs text-on-surface-variant/80 mt-1">
            عندما يقوم أي زائر بتعبئة استمارة حجز المعاينة، سيظهر طلبه هنا فورياً.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((req) => {
            const cleanPhone = (req.phoneNumber || "").replace(/[^0-9]/g, "");
            const intlPhone = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;
            const badge = getStatusBadge(req.status);

            const whatsappUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(
              `مرحباً أستاذ ${req.clientName}، تواصلك مع إدارة مطابخ الشويمي بخصوص طلبك (${getServiceLabel(
                req.requestedService
              )}). نتشرف بخدمتكم وتحديد موعد الرفع الهندسي والمناقشة.`
            )}`;

            return (
              <div
                key={req.id}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/20 shadow-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-primary font-readex">
                          {req.clientName}
                        </h3>
                        <p className="text-xs font-mono text-on-surface-variant font-medium" dir="ltr">
                          {req.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.class}`}
                    >
                      {badge.text}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-2 py-3 border-y border-outline-variant/10 text-xs text-on-surface">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="text-on-surface-variant">الفرع المفضل:</span>
                      <span className="text-primary font-bold">
                        {getBranchLabel(req.selectedBranch)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="text-on-surface-variant">الخدمة:</span>
                      <span className="text-on-surface font-medium">
                        {getServiceLabel(req.requestedService)}
                      </span>
                    </div>

                    {req.customerNotes && (
                      <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 mt-2">
                        <p className="text-[11px] text-on-surface-variant mb-0.5 font-bold font-readex">
                          ملاحظات العميل:
                        </p>
                        <p className="text-xs text-on-surface leading-relaxed">
                          {req.customerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-on-surface-variant font-medium">الحالة:</label>
                    <select
                      value={req.status || "new"}
                      onChange={(e) =>
                        handleStatusChange(req.id!, e.target.value as any)
                      }
                      className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2.5 py-1 text-xs text-primary focus:outline-none focus:border-secondary"
                    >
                      <option value="new">جديد</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="visit_scheduled">تم حجز الزيارة</option>
                      <option value="deal_closed">تم إتمام الاتفاق</option>
                    </select>
                  </div>

                  {/* Quick Connect & Delete */}
                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </a>

                    <a
                      href={`tel:${req.phoneNumber}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-semibold transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-secondary" />
                      <span>اتصال</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(req.id!, req.clientName)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
