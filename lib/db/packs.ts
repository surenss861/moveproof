import { supabase } from "@/lib/supabase/client";
import type { RoomId } from "@/lib/types";

export type PackType = "move_in" | "move_out" | "dispute";

export interface PackRow {
  id: string;
  user_id: string;
  type: PackType;
  address: string;
  landlord_name: string | null;
  started_at: string;
  completed_at: string | null;
  pack_hash: string | null;
  manifest_version: number | null;
  generated_at: string | null;
  room_notes: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface EvidenceRow {
  id: string;
  pack_id: string;
  room: string;
  storage_path: string;
  sha256: string;
  captured_at: string;
  uploaded_at: string;
  mime_type: string | null;
  size_bytes: number | null;
  gps: { lat: number; lng: number } | null;
  note: string | null;
  created_at: string;
}

export async function createPack(
  userId: string,
  type: PackType,
  address: string,
  landlordName?: string
): Promise<string> {
  const { data, error } = await supabase
    .from("packs")
    .insert({
      user_id: userId,
      type,
      address,
      landlord_name: landlordName || null,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function getPack(packId: string) {
  const { data, error } = await supabase
    .from("packs")
    .select("*")
    .eq("id", packId)
    .single();
  if (error || !data) return null;
  return data as PackRow;
}

export async function listPacks(): Promise<PackRow[]> {
  const { data, error } = await supabase
    .from("packs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as PackRow[];
}

export async function getEvidenceForPack(packId: string): Promise<EvidenceRow[]> {
  const { data, error } = await supabase
    .from("evidence_items")
    .select("*")
    .eq("pack_id", packId)
    .order("uploaded_at", { ascending: true });
  if (error) return [];
  return (data ?? []) as EvidenceRow[];
}

export async function addEvidence(
  packId: string,
  room: RoomId,
  storagePath: string,
  sha256: string,
  capturedAt: string,
  mimeType?: string,
  sizeBytes?: number,
  gps?: { lat: number; lng: number },
  note?: string,
  evidenceId?: string
): Promise<EvidenceRow> {
  const insert: Record<string, unknown> = {
    pack_id: packId,
    room,
    storage_path: storagePath,
    sha256,
    captured_at: capturedAt,
    uploaded_at: new Date().toISOString(),
    mime_type: mimeType || null,
    size_bytes: sizeBytes ?? null,
    gps: gps ?? null,
    note: note || null,
  };
  if (evidenceId) insert.id = evidenceId;
  const { data, error } = await supabase
    .from("evidence_items")
    .insert(insert)
    .select()
    .single();
  if (error) throw error;
  return data as EvidenceRow;
}

export async function completePack(
  packId: string,
  packHash: string,
  generatedAt: string
): Promise<void> {
  const { error } = await supabase
    .from("packs")
    .update({
      completed_at: new Date().toISOString(),
      pack_hash: packHash,
      manifest_version: 1,
      generated_at: generatedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", packId);
  if (error) throw error;
}

export async function getPackForVerify(packId: string) {
  const { data: pack, error: packErr } = await supabase
    .from("packs")
    .select("id, pack_hash, generated_at")
    .eq("id", packId)
    .single();
  if (packErr || !pack) return null;
  const { data: items } = await supabase
    .from("evidence_items")
    .select("id, sha256, uploaded_at")
    .eq("pack_id", packId)
    .order("uploaded_at", { ascending: true });
  return {
    packId: pack.id,
    packHash: pack.pack_hash,
    generatedAtServer: pack.generated_at,
    items: (items ?? []).map((i) => ({
      evidenceId: i.id,
      sha256: i.sha256,
      uploadedAtServer: i.uploaded_at,
    })),
  };
}
