import { getSupabase } from "@/lib/supabase/client";
import * as db from "@/lib/db/packs";
import { sha256Hex, computePackHash } from "@/lib/hash";
import type { Inspection, PhotoRecord, RoomId } from "@/lib/types";

const BUCKET = "evidence";

function packTypeToInsp(type: db.PackType): "move-in" | "move-out" {
  return type === "move_in" ? "move-in" : "move-out";
}

function inspectionTypeToPack(type: "move-in" | "move-out"): db.PackType {
  return type === "move-in" ? "move_in" : "move_out";
}

export async function createInspection(
  userId: string,
  type: "move-in" | "move-out",
  address: string,
  landlordName?: string
): Promise<string> {
  return db.createPack(userId, inspectionTypeToPack(type), address, landlordName);
}

export async function getInspection(inspectionId: string): Promise<Inspection | null> {
  const pack = await db.getPack(inspectionId);
  if (!pack) return null;
  const evidence = await db.getEvidenceForPack(pack.id);
  const photos: PhotoRecord[] = evidence.map((e) => ({
    evidenceId: e.id,
    url: getEvidencePublicUrl(e.storage_path),
    storagePath: e.storage_path,
    sha256: e.sha256,
    timestamp: e.captured_at,
    uploadedAtServer: e.uploaded_at,
    room: e.room as RoomId,
    note: e.note ?? undefined,
    mimeType: e.mime_type ?? undefined,
    sizeBytes: e.size_bytes ?? undefined,
    latitude: e.gps?.lat,
    longitude: e.gps?.lng,
  }));
  return {
    id: pack.id,
    userId: pack.user_id,
    type: packTypeToInsp(pack.type),
    address: pack.address,
    landlordName: pack.landlord_name ?? undefined,
    startedAt: pack.started_at,
    completedAt: pack.completed_at ?? undefined,
    photos,
    roomNotes: (pack.room_notes as Partial<Record<RoomId, string>>) ?? {},
    packId: pack.id,
    packHash: pack.pack_hash ?? undefined,
    manifestVersion: pack.manifest_version ?? undefined,
    generatedAtServer: pack.generated_at ?? undefined,
    createdAt: pack.created_at,
    updatedAt: pack.updated_at,
  };
}

export async function listInspections(userId: string): Promise<Inspection[]> {
  const packs = await db.listPacks();
  const list: Inspection[] = [];
  for (const pack of packs) {
    const evidence = await db.getEvidenceForPack(pack.id);
    const photos: PhotoRecord[] = evidence.map((e) => ({
      evidenceId: e.id,
      url: getEvidencePublicUrl(e.storage_path),
      storagePath: e.storage_path,
      sha256: e.sha256,
      timestamp: e.captured_at,
      uploadedAtServer: e.uploaded_at,
      room: e.room as RoomId,
      note: e.note ?? undefined,
      mimeType: e.mime_type ?? undefined,
      sizeBytes: e.size_bytes ?? undefined,
      latitude: e.gps?.lat,
      longitude: e.gps?.lng,
    }));
    list.push({
      id: pack.id,
      userId: pack.user_id,
      type: packTypeToInsp(pack.type),
      address: pack.address,
      landlordName: pack.landlord_name ?? undefined,
      startedAt: pack.started_at,
      completedAt: pack.completed_at ?? undefined,
      photos,
      roomNotes: (pack.room_notes as Partial<Record<RoomId, string>>) ?? {},
      packId: pack.id,
      packHash: pack.pack_hash ?? undefined,
      manifestVersion: pack.manifest_version ?? undefined,
      generatedAtServer: pack.generated_at ?? undefined,
      createdAt: pack.created_at,
      updatedAt: pack.updated_at,
    });
  }
  return list;
}

export async function completeInspection(
  inspectionId: string,
  packHash: string,
  generatedAtServer: string
): Promise<void> {
  await db.completePack(inspectionId, packHash, generatedAtServer);
}

export async function uploadInspectionPhoto(
  userId: string,
  inspectionId: string,
  file: File,
  room: RoomId,
  note?: string,
  lat?: number,
  lng?: number
): Promise<PhotoRecord> {
  const buf = await file.arrayBuffer();
  const sha256 = await sha256Hex(buf);
  const evidenceId = crypto.randomUUID();
  const ext = file.name.split(".").pop() || "jpg";
  const storagePath = `${userId}/${inspectionId}/${evidenceId}.${ext}`;

  const { error: uploadErr } = await getSupabase().storage
    .from(BUCKET)
    .upload(storagePath, buf, {
      contentType: file.type,
      upsert: false,
    });
  if (uploadErr) throw uploadErr;

  const capturedAt = new Date(file.lastModified || Date.now()).toISOString();
  const gps = lat != null && lng != null ? { lat, lng } : undefined;
  const row = await db.addEvidence(
    inspectionId,
    room,
    storagePath,
    sha256,
    capturedAt,
    file.type,
    file.size,
    gps,
    note,
    evidenceId
  );

  return {
    evidenceId: row.id,
    url: getEvidencePublicUrl(storagePath),
    storagePath,
    sha256,
    timestamp: capturedAt,
    uploadedAtServer: new Date().toISOString(),
    room,
    note,
    mimeType: file.type,
    sizeBytes: file.size,
    latitude: lat,
    longitude: lng,
  };
}

function getEvidencePublicUrl(storagePath: string): string {
  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}
