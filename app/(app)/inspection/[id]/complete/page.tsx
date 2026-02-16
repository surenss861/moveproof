"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getInspection } from "@/lib/inspections-supabase";
import type { Inspection } from "@/lib/types";
import { EvidencePackDocument } from "@/components/EvidencePackDocument";
import { FileCheck, Download } from "lucide-react";

export default function InspectionCompletePage() {
  const params = useParams();
  const id = params?.id as string;
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getInspection(id)
      .then(setInspection)
      .catch(() => setInspection(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDownload() {
    if (!inspection) return;
    setPdfLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(
        <EvidencePackDocument inspection={inspection} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MoveProof-Evidence-Pack-${id.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setPdfLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-8 flex justify-center">
        <p className="text-slate-400">Loading…</p>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="px-4 py-8">
        <p className="text-slate-400">Inspection not found.</p>
        <Link href="/dashboard" className="text-cyan-400 mt-4 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <div className="rounded-2xl bg-proof-green/20 border border-proof-green/40 p-6 text-center mb-6">
        <FileCheck className="w-12 h-12 text-proof-green mx-auto mb-3" />
        <h1 className="text-xl font-bold text-white mb-1">
          Proof Pack complete
        </h1>
        <p className="text-slate-400 text-sm">
          Your dispute-ready Evidence Pack (LTB-friendly format) is ready.
          Download the PDF with Chain of Custody and keep it for disputes.
        </p>
      </div>

      <p className="text-slate-500 text-xs mb-2">
        Pack ID: {inspection.packId ?? inspection.id} · Verify at /verify
      </p>
      <button
        onClick={handleDownload}
        disabled={pdfLoading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 disabled:opacity-50"
      >
        <Download className="w-5 h-5" />
        {pdfLoading ? "Generating PDF…" : "Download Evidence Pack (PDF)"}
      </button>

      <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <p className="text-slate-400 text-sm mb-2">What to do next</p>
        <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
          <li>Store the PDF in a safe place (cloud + local)</li>
          <li>Share with your landlord if you want a sign-off (optional)</li>
          <li>If there’s a dispute, use Get your money back for your demand letter and LTB guide</li>
        </ul>
      </div>

      <Link
        href="/dispute"
        className="block mt-4 text-center text-cyan-400 text-sm"
      >
        Start a dispute →
      </Link>
      <Link
        href="/dashboard"
        className="block mt-6 text-center text-slate-500 text-sm"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
