"use client";

import { motion } from "framer-motion";
import { X, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { Artefact, ArtefactType } from "@/types/artefact";
import { ARTEFACT_TYPE_LABELS } from "@/config/ui-constants";
import { graphTypeColors, artefactTypeOrder } from "@/lib/graph-helpers";

interface MobileLibrarySheetProps {
  artefacts: Artefact[];
  onClose: () => void;
  onSelectArtefact: (artefact: Artefact) => void;
}

export function MobileLibrarySheet({
  artefacts,
  onClose,
  onSelectArtefact,
}: MobileLibrarySheetProps) {
  const { t, language } = useLanguage();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 h-[70vh] bg-card rounded-t-2xl shadow-2xl z-50 flex flex-col"
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center py-2">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 py-2 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{t("graph.artefactLibrary")}</h3>
            <p className="text-xs text-muted-foreground">
              {language === "th"
                ? "เลือก Artefact เพื่อดูรายละเอียด"
                : "Select Artefact to view details"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {artefactTypeOrder.map((type) => {
              const typeArtefacts = artefacts.filter((a) => a.type === type);
              if (typeArtefacts.length === 0) return null;

              return (
                <div key={type} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        graphTypeColors[type],
                      )}
                    ></span>
                    {language === "th"
                      ? ARTEFACT_TYPE_LABELS[type]?.th || type
                      : ARTEFACT_TYPE_LABELS[type]?.en || type}{" "}
                    ({typeArtefacts.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {typeArtefacts.map((artefact) => (
                      <button
                        key={artefact.id}
                        onClick={() => {
                          onSelectArtefact(artefact);
                          onClose();
                        }}
                        className="p-3 bg-muted/50 border border-border rounded-lg text-left hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={cn("p-1 rounded", graphTypeColors[type])}
                          >
                            <Briefcase className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-medium truncate flex-1">
                            {artefact.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {artefact.nameTh}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
