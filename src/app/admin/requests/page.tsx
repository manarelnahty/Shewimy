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
import {
  useAdminRequests,
  updateInspectionRequestStatus,
  deleteInspectionRequest,
} from "@/lib/firebase";
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
        return { text: "تم إتمام الاتفاق", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "visit_scheduled":
        return { text: "تم حجز الزيارة", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "contacted":
        return { text: "تم التواصل", class: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      default:
        return { text: "جديد (بانتظار التواصل)", class: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-readex">
            طلبات المعاينة والاستشارات
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            متابعة استمارات الزيارات الهندسية والتواصل المباشر مع العملاء عبر الواتساب
          </p>
        </div>

        <div className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
          إجمالي الطلبات المسجلة: <span className="font-bold text-white font-mono">{requests.length}</span>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث باسم العميل، الهاتف، أو الملاحظات..."
              className="w-full bg-[#131a21] border border-white/10 rounded-xl px-4 py-2 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7a5b3e]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
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
              className="w-full bg-[#131a21] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#7a5b3e]"
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
        <div className="bg-[#0c1217] border border-white/10 rounded-2xl p-16 text-center text-gray-400">
          <CalendarCheck className="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <p className="text-sm font-medium">لم يتم العثور على طلبات مطابقة</p>
          <p className="text-xs text-gray-500 mt-1">
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
                className="bg-[#0c1217] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <User className="w-4 h-4 text-[#d4af37]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white font-readex">
                          {req.clientName}
                        </h3>
                        <p className="text-xs font-mono text-gray-400" dir="ltr">
                          {req.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge.class}`}
                    >
                      {badge.text}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-2 py-3 border-y border-white/5 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-400">الفرع المفضل:</span>
                      <span className="text-white font-medium">
                        {getBranchLabel(req.selectedBranch)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-400">الخدمة:</span>
                      <span className="text-gray-200">
                        {getServiceLabel(req.requestedService)}
                      </span>
                    </div>

                    {req.customerNotes && (
                      <div className="bg-[#131a21] p-2.5 rounded-lg border border-white/5 mt-2">
                        <p className="text-[11px] text-gray-400 mb-0.5 font-medium">
                          ملاحظات العميل:
                        </p>
                        <p className="text-xs text-gray-200 leading-relaxed">
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
                    <label className="text-[11px] text-gray-400">الحالة:</label>
                    <select
                      value={req.status || "new"}
                      onChange={(e) =>
                        handleStatusChange(req.id!, e.target.value as any)
                      }
                      className="bg-[#131a21] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>واتساب</span>
                    </a>

                    <a
                      href={`tel:${req.phoneNumber}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>اتصال</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(req.id!, req.clientName)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
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
