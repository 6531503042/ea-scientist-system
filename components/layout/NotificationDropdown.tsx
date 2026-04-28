"use client";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Layers,
  Settings,
  Users,
  Shield,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/use-auth-store";

type NotificationType = "info" | "warning" | "success" | "error";
type NotificationCategory = "artefact" | "system" | "user" | "security";

interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

function getUnreadCount(items: Notification[]) {
  return items.filter((item) => !item.read).length;
}

function formatRelativeTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "เมื่อสักครู่";
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} วันที่แล้ว`;

  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function mapAuditToNotification(item: any): Notification {
  const action = String(item?.action || "").toLowerCase();
  const entityType = String(item?.entityType || "system").toLowerCase();

  let type: NotificationType = "info";
  if (action.includes("delete") || action.includes("remove")) type = "warning";
  if (action.includes("create")) type = "success";

  let category: NotificationCategory = "system";
  if (entityType.includes("artefact") || entityType.includes("relationship"))
    category = "artefact";
  if (
    entityType.includes("user") ||
    entityType.includes("role") ||
    entityType.includes("department")
  )
    category = "user";
  if (entityType.includes("security") || entityType.includes("auth"))
    category = "security";

  const entityLabel = item?.entityLabel || item?.entityType || "System";

  return {
    id: String(item?.id ?? crypto.randomUUID()),
    type,
    category,
    title: item?.summary || `${action || "updated"} ${entityLabel}`,
    message: `กิจกรรม: ${action || "-"} • เป้าหมาย: ${entityLabel}`,
    timestamp: formatRelativeTimestamp(item?.createdAt),
    read: false,
  };
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
};

const typeColors = {
  info: "text-info bg-info/10",
  warning: "text-warning bg-warning/10",
  success: "text-success bg-success/10",
  error: "text-destructive bg-destructive/10",
};

const categoryIcons = {
  artefact: Layers,
  system: Settings,
  user: Users,
  security: Shield,
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: notificationList = [] } = useQuery<Notification[]>({
    queryKey: ["header-notifications"],
    queryFn: async () => {
      const data = await apiClient.get<any[]>("/api/v1/audit-logs?limit=20");
      const items = Array.isArray(data) ? data : [];
      return items.map(mapAuditToNotification);
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    refetchInterval: () => {
      if (!isAuthenticated) return false;
      if (typeof document !== "undefined" && document.hidden) return false;
      return 60 * 1000;
    },
    refetchOnWindowFocus: true,
  });

  const visibleNotifications = notificationList
    .filter((item) => !dismissedIds.has(item.id))
    .map((item) => ({ ...item, read: readIds.has(item.id) }));

  const unreadCount = getUnreadCount(visibleNotifications);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const markAllAsRead = () => {
    setReadIds(new Set(visibleNotifications.map((item) => item.id)));
  };

  const removeNotification = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">การแจ้งเตือน</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  อ่านทั้งหมด
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[360px] overflow-y-auto">
              {visibleNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  ไม่มีการแจ้งเตือน
                </div>
              ) : (
                visibleNotifications.map((notification) => {
                  const TypeIcon = typeIcons[notification.type];
                  const CategoryIcon = categoryIcons[notification.category];
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors relative group ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Type Icon */}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[notification.type]}`}
                        >
                          <TypeIcon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-medium text-foreground truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <CategoryIcon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 rounded hover:bg-muted transition-colors"
                              title="ทำเครื่องหมายว่าอ่านแล้ว"
                            >
                              <Check className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title="ลบ"
                          >
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border">
              <button className="w-full py-1.5 text-sm text-primary hover:underline text-center">
                ดูทั้งหมด
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
