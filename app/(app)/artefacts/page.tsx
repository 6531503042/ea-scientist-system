"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Layers, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useArtefacts } from "@/hooks/useArtefacts";
import { useArtefactTypes } from "@/hooks/useArtefactTypes";
import { ArtefactTable } from "./_components/ArtefactTable";
import { ArtefactTableSkeleton } from "./_components/ArtefactTableSkeleton";
import { TypesTable } from "./_components/TypesTable";
import { CreateTypeModal } from "./_components/CreateTypeModal";
import {
  EditTypeModal,
  type EditTypeTarget,
} from "./_components/EditTypeModal";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type {
  ArchitectureLayer,
  ArtefactCategory,
} from "@/types/artefact-type";

const TABS = [
  { id: "list", icon: List, label: "รายการ Artefact" },
  { id: "types", icon: Layers, label: "ประเภท Artefact" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ArtefactsPage() {
  const { toast } = useToast();
  const {
    artefacts,
    loading: artefactsLoading,
    error: artefactsError,
    fetchArtefacts,
  } = useArtefacts();
  const {
    layers,
    categories,
    loading: typesLoading,
    createLayer,
    updateLayer,
    deleteLayer,
    createCategory,
    updateCategory,
    deleteCategory,
    getLoc,
  } = useArtefactTypes();

  const [activeTab, setActiveTab] = useState<TabId>("list");
  const [isCreateTypeModalOpen, setIsCreateTypeModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTypeTarget | null>(null);

  const handleCreateLayer = async (data: Parameters<typeof createLayer>[0]) => {
    const result = await createLayer(data);
    if (result) {
      toast({ title: "เพิ่ม Layer สำเร็จ" });
      setIsCreateTypeModalOpen(false);
    } else {
      toast({ variant: "destructive", title: "เพิ่ม Layer ไม่สำเร็จ" });
    }
  };

  const handleCreateCategory = async (
    data: Parameters<typeof createCategory>[0],
  ) => {
    const result = await createCategory(data);
    if (result) {
      toast({ title: "เพิ่ม Category สำเร็จ" });
      setIsCreateTypeModalOpen(false);
    } else {
      toast({ variant: "destructive", title: "เพิ่ม Category ไม่สำเร็จ" });
    }
  };

  const handleEditLayer = (layer: ArchitectureLayer) => {
    setEditTarget({ type: "layer", item: layer });
  };

  const handleEditCategory = (category: ArtefactCategory) => {
    setEditTarget({ type: "category", item: category });
  };

  const handleUpdateLayer = async (
    id: number,
    data: Parameters<typeof updateLayer>[1],
  ) => {
    const result = await updateLayer(id, data);
    if (result) {
      toast({ title: "บันทึก Layer สำเร็จ" });
      setEditTarget(null);
    } else {
      toast({ variant: "destructive", title: "บันทึก Layer ไม่สำเร็จ" });
    }
  };

  const handleUpdateCategory = async (
    id: number,
    data: Parameters<typeof updateCategory>[1],
  ) => {
    const result = await updateCategory(id, data);
    if (result) {
      toast({ title: "บันทึก Category สำเร็จ" });
      setEditTarget(null);
    } else {
      toast({ variant: "destructive", title: "บันทึก Category ไม่สำเร็จ" });
    }
  };

  const handleDeleteLayer = async (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการปิดใช้งาน Layer นี้?")) {
      const ok = await deleteLayer(id);
      toast(
        ok
          ? { title: "ปิดใช้งาน Layer สำเร็จ" }
          : { variant: "destructive", title: "ปิดใช้งาน Layer ไม่สำเร็จ" },
      );
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการปิดใช้งาน Category นี้?")) {
      const ok = await deleteCategory(id);
      toast(
        ok
          ? { title: "ปิดใช้งาน Category สำเร็จ" }
          : { variant: "destructive", title: "ปิดใช้งาน Category ไม่สำเร็จ" },
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with tabs - always visible */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 pt-4 pb-2 border-b border-border shrink-0">
        <div className="flex items-center gap-0.5 p-1 bg-muted/80 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "types" && (
          <Button
            size="sm"
            className="gap-1.5 h-8"
            onClick={() => setIsCreateTypeModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">เพิ่มประเภท</span>
            <span className="sm:hidden">เพิ่ม</span>
          </Button>
        )}
      </div>

      {/* Artefacts tab */}
      {activeTab === "list" && (
        <div className="flex-1 overflow-hidden">
          {artefactsLoading && artefacts.length === 0 && !artefactsError ? (
            <ArtefactTableSkeleton />
          ) : artefactsError && artefacts.length === 0 ? (
            <div className="p-4 sm:p-6">
              <Alert variant="destructive">
                <AlertTitle>โหลดรายการ Artefact ไม่สำเร็จ</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>{artefactsError}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchArtefacts()}
                  >
                    ลองใหม่
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <ArtefactTable initialData={artefacts} onRefresh={fetchArtefacts} />
          )}
        </div>
      )}

      {/* Types tab */}
      <AnimatePresence mode="wait">
        {activeTab === "types" && (
          <motion.div
            key="types-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-auto"
          >
            <TypesTable
              layers={layers}
              categories={categories}
              loading={typesLoading}
              getLoc={getLoc}
              onEditLayer={handleEditLayer}
              onDeleteLayer={handleDeleteLayer}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CreateTypeModal
        isOpen={isCreateTypeModalOpen}
        onClose={() => setIsCreateTypeModalOpen(false)}
        layers={layers}
        onSubmitLayer={handleCreateLayer}
        onSubmitCategory={handleCreateCategory}
      />

      <EditTypeModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        target={editTarget}
        layers={layers}
        onUpdateLayer={handleUpdateLayer}
        onUpdateCategory={handleUpdateCategory}
      />
    </div>
  );
}
