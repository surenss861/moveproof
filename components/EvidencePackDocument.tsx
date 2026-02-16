"use client";

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Inspection, PhotoRecord } from "@/lib/types";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 4, fontWeight: "bold" },
  subtitle: { fontSize: 10, color: "#64748b", marginBottom: 20 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 8 },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 120, color: "#64748b" },
  value: { flex: 1 },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  photoBlock: { width: "30%", marginBottom: 12 },
  photoCaption: { fontSize: 8, color: "#64748b", marginTop: 4 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: "#94a3b8" },
  chainSection: { marginBottom: 12 },
  chainRow: { flexDirection: "row", marginBottom: 2, fontSize: 8 },
  chainHash: { fontFamily: "Courier", fontSize: 7, wordBreak: "break-all" },
});

const DISCLAIMER =
  "Information only, not legal advice. Outcome not guaranteed. Use this Evidence Pack to support deposit disputes or insurance claims.";

export function EvidencePackDocument({ inspection }: { inspection: Inspection }) {
  const completedAt = inspection.completedAt || inspection.updatedAt;
  const photos = inspection.photos || [];
  const byRoom = photos.reduce(
    (acc, p) => {
      if (!acc[p.room]) acc[p.room] = [];
      acc[p.room].push(p);
      return acc;
    },
    {} as Record<string, PhotoRecord[]>
  );

  return (
    <Document>
      {/* Page 1: Chain of Custody */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>MoveProof Evidence Pack</Text>
        <Text style={styles.subtitle}>
          Dispute-ready Evidence Pack (LTB-friendly format) · Ontario
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chain of custody</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Pack ID</Text>
            <Text style={styles.value}>{inspection.packId ?? inspection.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Generated (server)</Text>
            <Text style={styles.value}>
              {format(new Date(inspection.generatedAtServer || completedAt), "PPP 'at' p")}
            </Text>
          </View>
          {inspection.packHash && (
            <View style={styles.chainSection}>
              <Text style={styles.label}>Pack hash</Text>
              <Text style={styles.chainHash}>{inspection.packHash}</Text>
            </View>
          )}
          <Text style={{ fontSize: 8, color: "#64748b", marginTop: 8 }}>
            Verify: moveproof.app/verify (paste Pack ID)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence items</Text>
          {photos.map((p, i) => (
            <View key={p.evidenceId ?? i} style={styles.chainRow}>
              <Text style={styles.label}>
                {p.evidenceId ?? `Photo ${i + 1}`} · {p.room}
              </Text>
              <Text style={styles.chainHash}>
                {p.uploadedAtServer
                  ? format(new Date(p.uploadedAtServer), "yyyy-MM-dd HH:mm")
                  : format(new Date(p.timestamp), "yyyy-MM-dd HH:mm")}
                {p.sha256 ? ` · ${p.sha256.slice(0, 16)}...` : ""}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>{DISCLAIMER}</Text>
      </Page>

      {/* Page 2+: Property details + Photo log */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Property & inspection details</Text>
        <Text style={styles.subtitle}>
          {inspection.type === "move-in" ? "Move-in" : "Move-out"} ·{" "}
          {format(new Date(completedAt), "PPP 'at' p")}
        </Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{inspection.address}</Text>
          </View>
          {inspection.landlordName && (
            <View style={styles.row}>
              <Text style={styles.label}>Landlord / PM</Text>
              <Text style={styles.value}>{inspection.landlordName}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Started</Text>
            <Text style={styles.value}>
              {format(new Date(inspection.startedAt), "PPP 'at' p")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Completed</Text>
            <Text style={styles.value}>
              {format(new Date(completedAt), "PPP 'at' p")}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo log (by room)</Text>
          {Object.entries(byRoom).map(([room, roomPhotos]) => (
            <View key={room} style={{ marginBottom: 12 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 6 }}>{room}</Text>
              <View style={styles.photoGrid}>
                {roomPhotos.slice(0, 6).map((p, i) => (
                  <View key={p.evidenceId ?? i} style={styles.photoBlock}>
                    <Image
                      src={p.url}
                      style={{ width: "100%", height: 80, objectFit: "cover" }}
                    />
                    <Text style={styles.photoCaption}>
                      {format(new Date(p.timestamp), "MMM d, yyyy HH:mm")}
                      {p.latitude != null &&
                        ` · GPS: ${p.latitude.toFixed(4)}, ${p.longitude?.toFixed(4)}`}
                    </Text>
                  </View>
                ))}
              </View>
              {roomPhotos.length > 6 && (
                <Text style={styles.photoCaption}>
                  + {roomPhotos.length - 6} more photo(s) for this room
                </Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>{DISCLAIMER}</Text>
      </Page>
    </Document>
  );
}
