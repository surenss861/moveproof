"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  getInspection,
  uploadInspectionPhoto,
  completeInspection,
} from "@/lib/inspections-supabase";
import { computePackHash } from "@/lib/hash";
import type { Inspection, RoomId } from "@/lib/types";
import { ROOMS } from "@/lib/types";
import { PhotoCapture } from "@/components/PhotoCapture";
import { format } from "date-fns";
import { Check, ChevronRight, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";

export default function InspectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [activeRoom, setActiveRoom] = useState<RoomId | null>(null);

  useEffect(() => {
    if (!id) return;
    getInspection(id)
      .then(setInspection)
      .catch(() => setInspection(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handlePhoto(file: File, lat?: number, lng?: number) {
    if (!user?.uid || !inspection || !activeRoom) return;
    try {
      await uploadInspectionPhoto(
        user.uid,
        inspection.id,
        file,
        activeRoom,
        undefined,
        lat,
        lng
      );
      const updated = await getInspection(id);
      setInspection(updated ?? inspection);
    } catch {
      // show toast in real app
    }
  }

  async function handleComplete() {
    if (!inspection) return;
    setCompleting(true);
    try {
      const items = (inspection.photos || []).filter((p) => p.evidenceId && p.sha256);
      const packHash =
        items.length > 0
          ? await computePackHash(items as Array<{ evidenceId: string; sha256: string }>)
          : "";
      const generatedAt = new Date().toISOString();
      await completeInspection(inspection.id, packHash, generatedAt);
      router.push(`/inspection/${inspection.id}/complete`);
    } finally {
      setCompleting(false);
    }
  }

  if (loading || !inspection) {
    return (
      <div className="px-4 py-8 flex justify-center">
        <p className="text-slate-400">
          {loading ? "Loading…" : "Inspection not found"}
        </p>
      </div>
    );
  }

  const photoCount = inspection.photos?.length ?? 0;
  const hasAnyPhotos = photoCount > 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-24">
      <Link
        href="/dashboard"
        className="text-cyan-400 text-sm mb-4 inline-block"
      >
        ← Dashboard
      </Link>
      <div className="mb-6">
        <p className="text-slate-500 text-sm">
          {inspection.type === "move-in" ? "Move-in" : "Move-out"} · Started{" "}
          {format(new Date(inspection.startedAt), "MMM d, yyyy")}
        </p>
        <h1 className="text-lg font-bold text-white truncate">
          {inspection.address}
        </h1>
      </div>

      <p className="text-slate-400 text-sm mb-4">
        Document each room with at least one photo. Timestamp and location are
        added automatically.
      </p>

      <div className="space-y-2 mb-6">
        {ROOMS.map((room) => {
          const roomPhotos =
            inspection.photos?.filter((p) => p.room === room) ?? [];
          const count = roomPhotos.length;
          const isActive = activeRoom === room;
          return (
            <div
              key={room}
              className={clsx(
                "rounded-xl border overflow-hidden transition-colors",
                isActive
                  ? "bg-cyan-500/10 border-cyan-500/50"
                  : "bg-slate-800/60 border-slate-700/50"
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveRoom(isActive ? null : room)
                }
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div
                  className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    count > 0 ? "bg-proof-green/20 text-proof-green" : "bg-slate-700 text-slate-400"
                  )}
                >
                  {count > 0 ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{room}</p>
                  <p className="text-slate-500 text-xs">
                    {count} photo{count !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronRight
                  className={clsx(
                    "w-5 h-5 shrink-0 text-slate-500 transition-transform",
                    isActive && "rotate-90"
                  )}
                />
              </button>
              {isActive && (
                <div className="px-4 pb-4 pt-0 border-t border-slate-700/50">
                  <div className="flex flex-wrap gap-2 pt-3">
                    {roomPhotos.map((p) => (
                      <a
                        key={p.evidenceId ?? p.url}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-16 h-16 rounded-lg bg-slate-700 overflow-hidden shrink-0"
                      >
                        <img
                          src={p.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                    <PhotoCapture
                      onCapture={handlePhoto}
                      label="Add photo"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleComplete}
        disabled={!hasAnyPhotos || completing}
        className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {completing
          ? "Generating…"
          : hasAnyPhotos
            ? "Complete & get Evidence Pack PDF"
            : "Add at least one photo to continue"}
      </button>
    </div>
  );
}
