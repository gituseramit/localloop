import { OrderStatus, DeliveryType } from "@prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  AWAITING_PICKUP: "Awaiting Pickup",
  PICKED_UP: "Picked Up",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-[#fff7ed] text-[#9a3412] border border-[#ffedd5]",
  ACCEPTED: "bg-[#f0f9ff] text-[#0369a1] border border-[#e0f2fe]",
  REJECTED: "bg-[#fef2f2] text-[#991b1b] border border-[#fee2e2]",
  AWAITING_PICKUP: "bg-[#f5f3ff] text-[#5b21b6] border border-[#ede9fe]",
  PICKED_UP: "bg-[#fdfaff] text-[#6d28d9] border border-[#f5f3ff]",
  IN_PROGRESS: "bg-[#eff6ff] text-[#1e40af] border border-[#dbeafe]",
  COMPLETED: "bg-[#f0fdf4] text-[#166534] border border-[#dcfce7]",
  OUT_FOR_DELIVERY: "bg-[#fffbeb] text-[#92400e] border border-[#fef3c7]",
  DELIVERED: "bg-[#f0fdf4] text-[#15803d] border border-[#dcfce7]",
  CANCELLED: "bg-[#f8fafc] text-[#475569] border border-[#f1f5f9]",
  REFUNDED: "bg-[#fff1f2] text-[#be123c] border border-[#ffe4e6]",
};

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  PICKUP: "Partner Pickup",
  DELIVERY: "Home Delivery",
  SELF_COLLECT: "Self Collect",
};

export const SERVICE_CATEGORIES = [
  { name: "Printouts", slug: "printouts", icon: "🖨️" },
  { name: "Photocopy / Xerox", slug: "photocopy", icon: "📋" },
  { name: "Scanning", slug: "scanning", icon: "🔍" },
  { name: "Lamination", slug: "lamination", icon: "🗂️" },
  { name: "Binding", slug: "binding", icon: "📚" },
  { name: "Passport Photo", slug: "passport-photo", icon: "🪪" },
  { name: "ID Card Print", slug: "id-card", icon: "🪪" },
  { name: "Document Typing", slug: "typing", icon: "⌨️" },
  { name: "Resume Making", slug: "resume", icon: "📄" },
  { name: "PDF Conversion", slug: "pdf", icon: "📁" },
  { name: "Form Filling", slug: "form-filling", icon: "📝" },
  { name: "Exam Registration", slug: "exam-registration", icon: "🎓" },
  { name: "Government Forms", slug: "govt-forms", icon: "🏛️" },
];

export const PLATFORM_COMMISSION_RATE = 15; // 15%
export const DEFAULT_DELIVERY_FEE = 30; // ₹30

export const VEHICLE_TYPES = ["Bicycle", "Motorcycle", "Car", "E-Scooter"];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Puducherry",
];

export const OPERATING_HOURS_DEFAULT = {
  monday: { open: "09:00", close: "20:00", closed: false },
  tuesday: { open: "09:00", close: "20:00", closed: false },
  wednesday: { open: "09:00", close: "20:00", closed: false },
  thursday: { open: "09:00", close: "20:00", closed: false },
  friday: { open: "09:00", close: "20:00", closed: false },
  saturday: { open: "09:00", close: "18:00", closed: false },
  sunday: { open: "10:00", close: "15:00", closed: true },
};
