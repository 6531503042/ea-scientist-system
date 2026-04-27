"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Upload,
  FileText,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { resolveApiUrl } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { useArtefacts } from "@/hooks/useArtefacts";

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "export" | "import";
}

interface ImportPayloadItem {
  architectureLayerId?: number;
  categoryId: number;
  ownerDepartmentId?: number;
  responsibleById?: number;
  artefactName: Record<string, string>;
  description?: Record<string, string>;
  lifecycleStatus?: string;
  riskLevel?: string;
  usageFrequency?: string;
  version?: string;
  attributes?: Record<string, unknown>;
  tags?: string[];
}

function getAuthHeaders() {
  const headers: Record<string, string> = {};

  if (typeof window === "undefined") return headers;

  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return headers;

    const parsed = JSON.parse(raw);
    const token: string | undefined = parsed?.state?.accessToken;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore malformed storage
  }

  return headers;
}

export function ExportImportModal({
  isOpen,
  onClose,
  mode,
}: ExportImportModalProps) {
  const { user } = useAuth();
  const { allArtefacts, fetchArtefacts } = useArtefacts();

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const logAudit = async (
    action: string,
    summary: string,
    entityLabel?: string,
  ) => {
    if (!user) return;

    try {
      await fetch(resolveApiUrl("/api/v1/audit-logs"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user.id,
          action,
          summary,
          entityType: "ARTEFACT",
          entityLabel,
        }),
      });
    } catch {
      // Non-blocking: export/import should still succeed if audit fails
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      const response = await fetch(resolveApiUrl("/api/v1/artefacts/export"), {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Export failed (${response.status})`);
      }

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") || "";
      const fileNameMatch = disposition.match(/filename="?([^\"]+)"?/i);
      const fileName =
        fileNameMatch?.[1] ||
        `artefacts-export-${new Date().toISOString().slice(0, 10)}.json`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      await logAudit(
        "EXPORT",
        `Exported artefacts (${allArtefacts.length} items) as JSON`,
        "Bulk Export",
      );

      setResult({ success: true, message: "ส่งออกข้อมูลสำเร็จ" });
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "ส่งออกข้อมูลไม่สำเร็จ",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const normalizeImportItems = (raw: unknown): ImportPayloadItem[] => {
    const source = Array.isArray(raw)
      ? raw
      : raw && typeof raw === "object" && Array.isArray((raw as any).artefacts)
        ? (raw as any).artefacts
        : [];

    return source
      .map((item: any) => ({
        architectureLayerId: item.architectureLayerId,
        categoryId: item.categoryId,
        ownerDepartmentId: item.ownerDepartmentId,
        responsibleById: item.responsibleById,
        artefactName: item.artefactName,
        description: item.description,
        lifecycleStatus: item.lifecycleStatus,
        riskLevel: item.riskLevel,
        usageFrequency: item.usageFrequency,
        version: item.version,
        attributes: item.attributes,
        tags: item.tags,
      }))
      .filter(
        (item: ImportPayloadItem) =>
          Number.isFinite(item.categoryId) &&
          !!item.artefactName &&
          typeof item.artefactName === "object",
      );
  };

  const processImport = async (file: File) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const artefacts = normalizeImportItems(parsed);

      if (artefacts.length === 0) {
        throw new Error("ไฟล์ไม่ถูกต้อง หรือไม่มีรายการที่นำเข้าได้");
      }

      const response = await fetch(resolveApiUrl("/api/v1/artefacts/import"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({ artefacts }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.message || "นำเข้าข้อมูลไม่สำเร็จ");
      }

      await logAudit(
        "IMPORT",
        `Imported artefacts from ${file.name}`,
        file.name,
      );
      await fetchArtefacts();

      const created = json?.data?.created ?? artefacts.length;
      const failed = json?.data?.failed ?? 0;
      const message =
        failed > 0
          ? `นำเข้าเสร็จ: สำเร็จ ${created}, ไม่สำเร็จ ${failed}`
          : `นำเข้าไฟล์ ${file.name} สำเร็จ (${created} รายการ)`;

      setResult({ success: failed === 0, message });
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "นำเข้าข้อมูลไม่สำเร็จ",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processImport(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      void processImport(file);
    }
  };

  const handleClose = () => {
    setResult(null);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  mode === "export" ? "bg-success/10" : "bg-primary/10"
                }`}
              >
                {mode === "export" ? (
                  <Download className="w-5 h-5 text-success" />
                ) : (
                  <Upload className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {mode === "export" ? "ส่งออกข้อมูล" : "นำเข้าข้อมูล"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {mode === "export"
                    ? "Export Artefacts เป็น JSON"
                    : "Import Artefacts จากไฟล์ JSON"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {mode === "export" ? (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  พร้อมส่งออกข้อมูลทั้งหมด
                  <span className="font-semibold text-foreground">
                    {" "}
                    {allArtefacts.length}{" "}
                  </span>
                  รายการ ในรูปแบบ JSON
                </p>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">
                  ลากไฟล์มาวางที่นี่
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  หรือคลิกเพื่อเลือกไฟล์ JSON
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                  เลือกไฟล์
                  <input
                    type="file"
                    className="hidden"
                    accept=".json"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            )}

            {result && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  result.success
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {result.success ? (
                  <Check className="w-5 h-5 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                )}
                <p className="text-sm font-medium">{result.message}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
            >
              ปิด
            </button>
            <button
              onClick={() => {
                if (mode === "export") {
                  void handleExport();
                }
              }}
              disabled={isProcessing || mode !== "export"}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังดำเนินการ...
                </span>
              ) : mode === "export" ? (
                "เริ่มส่งออก"
              ) : (
                "เลือกไฟล์เพื่อเริ่มนำเข้า"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
