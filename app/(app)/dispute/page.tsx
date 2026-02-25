"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  DISPUTE_OUTCOMES,
  ONTARIO_EVIDENCE_RULES,
  T1_EXPLAINER,
  FILING_OPTIONS,
  SERVICE_CHECKLIST,
  getDemandLetterTemplate,
} from "@/lib/dispute";
import { listInspections } from "@/lib/inspections-supabase";
import type { Inspection } from "@/lib/types";
import { ChevronRight, FileText, Copy, Check, ExternalLink } from "lucide-react";
import { format, addDays } from "date-fns";

type DisputeStep =
  | "home"
  | "what"
  | "details"
  | "evidence"
  | "rules"
  | "letter"
  | "t1"
  | "filing"
  | "service"
  | "finish";

const STEP_ORDER: DisputeStep[] = [
  "home",
  "what",
  "details",
  "evidence",
  "rules",
  "letter",
  "t1",
  "filing",
  "service",
  "finish",
];

const SLIDE = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  animate: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -28 }),
  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
};

export default function DisputePage() {
  const { user } = useAuth();
  const [step, setStep] = useState<DisputeStep>("home");
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const [outcome, setOutcome] = useState<string>("");
  const [amountDisputed, setAmountDisputed] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [address, setAddress] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [hasMoveInPhotos, setHasMoveInPhotos] = useState<"yes" | "no" | "kinda">("no");
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selectedInspectionId, setSelectedInspectionId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const deadlineDate = format(addDays(new Date(), 14), "MMMM d, yyyy");

  const stepIndex = STEP_ORDER.indexOf(step);
  const totalSteps = STEP_ORDER.length - 1; // exclude "home" from progress

  async function loadInspections() {
    if (!user?.uid) return;
    const list = await listInspections(user.uid);
    setInspections(list);
    if (list.length > 0 && !selectedInspectionId)
      setSelectedInspectionId(list[0].id);
  }

  const demandLetter =
    user?.email && landlordName && address && amountDisputed
      ? getDemandLetterTemplate({
          tenantName:
            (user as { user_metadata?: { full_name?: string } })?.user_metadata
              ?.full_name ||
            user.email?.split("@")[0] ||
            "Tenant",
          tenantEmail: user.email,
          landlordName,
          address,
          amountDisputed: parseFloat(amountDisputed) || 0,
          outcome,
          date: format(new Date(), "MMMM d, yyyy"),
          deadlineDate,
        })
      : "";

  function copyLetter() {
    if (!demandLetter) return;
    navigator.clipboard.writeText(demandLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function goNext(s: DisputeStep) {
    setDir(1);
    setStep(s);
  }

  function goBack(s: DisputeStep) {
    setDir(-1);
    setStep(s);
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-24">
      {/* Progress bar — shown on all non-home steps */}
      <div
        className="mb-5 overflow-hidden"
        style={{ height: step === "home" ? 0 : "auto", transition: "height 0.3s" }}
      >
        {step !== "home" && (
          <>
            <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-500 rounded-full"
                initial={false}
                animate={{ width: `${(stepIndex / totalSteps) * 100}%` }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="text-slate-600 text-xs mt-1 text-right">
              Step {stepIndex} of {totalSteps}
            </p>
          </>
        )}
      </div>

      <h1 className="text-xl font-bold text-white mb-1">Get your money back</h1>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={SLIDE}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={SLIDE.transition}
        >
          {/* Screen 1: Home */}
          {step === "home" && (
            <>
              <p className="text-slate-400 text-sm mb-6">
                Answer 5 questions. We&apos;ll build a dispute-ready Evidence Pack + a
                demand letter you can send today.
              </p>
              <button
                type="button"
                onClick={() => goNext("what")}
                className="w-full py-4 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 mb-3 active:scale-[0.97] transition-transform"
              >
                Start
              </button>
              <Link
                href="/inspection/new"
                className="block text-center text-slate-400 text-sm hover:text-cyan-400"
              >
                I already have photos → Upload &amp; build pack
              </Link>
            </>
          )}

          {/* Screen 2: What happened */}
          {step === "what" && (
            <>
              <button
                type="button"
                onClick={() => goBack("home")}
                className="text-cyan-400 text-sm mb-4"
              >
                ← Back
              </button>
              <p className="text-slate-300 text-sm mb-4">What happened?</p>
              <ul className="space-y-2 mb-6">
                {DISPUTE_OUTCOMES.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOutcome(o.id);
                        goNext("details");
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 text-left hover:border-cyan-500/50 active:scale-[0.98] transition-transform"
                    >
                      <span className="text-white">{o.label}</span>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Screen 3: Quick Details */}
          {step === "details" && (
            <>
              <button
                type="button"
                onClick={() => goBack("what")}
                className="text-cyan-400 text-sm mb-4"
              >
                ← Change outcome
              </button>
              <p className="text-slate-300 text-sm mb-4">Quick details (5 fields)</p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    Rental address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="123 Main St, City"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    Landlord name (or company) *
                  </label>
                  <input
                    type="text"
                    value={landlordName}
                    onChange={(e) => setLandlordName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="Name or company"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    Amount withheld ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amountDisputed}
                    onChange={(e) => setAmountDisputed(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. 1200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    Move-out date
                  </label>
                  <input
                    type="date"
                    value={moveOutDate}
                    onChange={(e) => setMoveOutDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    Do you have move-in photos?
                  </label>
                  <div className="flex gap-2">
                    {(["yes", "no", "kinda"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setHasMoveInPhotos(v)}
                        className={`flex-1 py-2 rounded-lg border text-sm active:scale-[0.96] transition-transform ${
                          hasMoveInPhotos === v
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-slate-800 border-slate-600 text-slate-400"
                        }`}
                      >
                        {v === "yes" ? "Yes" : v === "no" ? "No" : "Kinda"}
                      </button>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Even messy photos help. We&apos;ll organize them into a clean
                    evidence timeline.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => goNext("evidence")}
                disabled={!address || !landlordName || !amountDisputed}
                className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 disabled:opacity-50 active:scale-[0.97] transition-transform"
              >
                Next: Evidence upload
              </button>
            </>
          )}

          {/* Screen 4: Evidence Upload */}
          {step === "evidence" && (
            <>
              <button
                type="button"
                onClick={() => goBack("details")}
                className="text-cyan-400 text-sm mb-4"
              >
                ← Back
              </button>
              <p className="text-slate-300 text-sm mb-2">Evidence upload</p>
              <p className="text-slate-500 text-xs mb-4">
                You&apos;ll need to share evidence with the landlord and LTB before a
                hearing. We&apos;ll format it for you.
              </p>
              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <p className="text-white text-sm font-medium">Move-in photos</p>
                  <p className="text-slate-500 text-xs">Optional</p>
                  <button
                    type="button"
                    onClick={loadInspections}
                    className="text-cyan-400 text-xs mt-1"
                  >
                    {inspections.length === 0
                      ? "Link a Proof Pack"
                      : "Change selection"}
                  </button>
                  {inspections.length > 0 && (
                    <select
                      value={selectedInspectionId}
                      onChange={(e) => setSelectedInspectionId(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white text-sm"
                    >
                      <option value="">— None —</option>
                      {inspections.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.address} · {i.type} (
                          {format(new Date(i.startedAt), "MMM d")})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <p className="text-white text-sm font-medium">Move-out photos</p>
                  <p className="text-slate-500 text-xs">Recommended</p>
                  {inspections.length > 0 && (
                    <select
                      value={selectedInspectionId}
                      onChange={(e) => setSelectedInspectionId(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white text-sm"
                    >
                      <option value="">— None —</option>
                      {inspections.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.address} · {i.type} (
                          {format(new Date(i.startedAt), "MMM d")})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <p className="text-slate-500 text-xs">
                  Receipts, invoices, and message screenshots: add to your Evidence
                  Pack manually or attach when filing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => goNext("rules")}
                className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 active:scale-[0.97] transition-transform"
              >
                Next: Evidence rules
              </button>
            </>
          )}

          {/* Screen 5: Evidence Rules */}
          {step === "rules" && (
            <>
              <button
                type="button"
                onClick={() => goBack("evidence")}
                className="text-cyan-400 text-sm mb-4"
              >
                ← Back
              </button>
              <h2 className="text-lg font-bold text-white mb-2">
                Evidence deadlines (Ontario LTB)
              </h2>
              <p className="text-amber-400/90 text-sm mb-4">
                Do this or you can get cooked
              </p>
              <ul className="space-y-2 mb-6 list-disc list-inside text-slate-300 text-sm">
                {ONTARIO_EVIDENCE_RULES[0].bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => goNext("letter")}
                className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 active:scale-[0.97] transition-transform"
              >
                Got it → Build my pack
              </button>
            </>
          )}

          {/* Screen 6: Demand Letter */}
          {step === "letter" && (
            <>
              <button
                type="button"
                onClick={() => goBack("rules")}
                className="text-cyan-400 text-sm mb-4"
              >
                ← Back
              </button>
              <h2 className="text-lg font-bold text-white mb-1">
                Send this first (it matters)
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                A clean demand letter resolves a surprising number of disputes without
                a hearing.
              </p>
              <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Demand letter (draft)
                  </span>
                  <button
                    type="button"
                    onClick={copyLetter}
                    className="flex items-center gap-1 px-2 py-1 rounded text-cyan-400 text-sm hover:bg-cyan-500/20 active:scale-[0.95] transition-transform"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="text-slate-300 text-xs whitespace-pre-wrap font-sans overflow-x-auto">
                  {demandLetter || "Fill in details first."}
                </pre>
              </div>
              <button
                type="button"
                onClick={() => goNext("t1")}
                className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 active:scale-[0.97] transition-transform"
              >
                Next: Which form is this?
              </button>
            </>
          )}

          {/* Screen 7: T1 Explainer */}
          {step === "t1" && (
            <>
              <button
                type="button"
                onClick={() => goBack("letter")}
                className="text-cyan-400 text-sm mb-4"
              >
                ← Back
              </button>
              <h2 className="text-lg font-bold text-white mb-2">
                Which form is this?
              </h2>
              <p className="text-slate-400 text-sm mb-4">{T1_EXPLAINER.body}</p>
              <div className="space-y-2 mb-6">
                <a
                  href={T1_EXPLAINER.links.instructions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 active:scale-[0.98] transition-transform"
                >
                  <span className="text-white">Open official T1 instructions</span>
                  <ExternalLink className="w-5 h-5 text-slate-500" />
                </a>
                <a
                  href={T1_EXPLAINER.links.formPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 active:scale-[0.98] transition-transform"
                >
                  <span className="text-white">Open official T1 PDF form</span>
                  <ExternalLink className="w-5 h-5 text-slate-500" />
                </a>
              </div>
              <button
                type="button"
                onClick={() => goNext("filing")}
                className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 active:scale-[0.97] transition-transform"
              >
                Next: How to file
              </button>
            </>
          )}

          {/* Screen 8: Filing Options */}
          {step === "filing" && (
            <>
              <button
                type="button"
                onClick={() => goBack("t1")}
                className="text-cyan-400 text-sm mb-4"
              >
                ← Back
              </button>
              <h2 className="text-lg font-bold text-white mb-2">
                How to file (Ontario)
              </h2>
              <ul className="space-y-2 mb-6 list-disc list-inside text-slate-300 text-sm">
                {FILING_OPTIONS.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <a
                href={FILING_OPTIONS.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 active:scale-[0.98] transition-transform mb-4"
              >
                <span className="text-white">Tribunals Ontario Portal</span>
                <ExternalLink className="w-5 h-5 text-slate-500" />
              </a>
              <button
                type="button"
                onClick={() => goNext("service")}
                className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 active:scale-[0.97] transition-transform"
              >
                Next: Serving documents
              </button>
            </>
          )}

          {/* Screen 9: Service Helper */}
          {step === "service" && (
            <>
              <button
                type="button"
                onClick={() => goBack("filing")}
                className="text-cyan-400 text-sm mb-4"
              >
                ← Back
              </button>
              <h2 className="text-lg font-bold text-white mb-2">
                {SERVICE_CHECKLIST.title}
              </h2>
              <p className="text-slate-400 text-sm mb-4">{SERVICE_CHECKLIST.body}</p>
              <ul className="space-y-2 mb-6 list-decimal list-inside text-slate-300 text-sm">
                {SERVICE_CHECKLIST.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => goNext("finish")}
                className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 active:scale-[0.97] transition-transform"
              >
                My Dispute Pack is ready
              </button>
            </>
          )}

          {/* Screen 10: Finish */}
          {step === "finish" && (
            <>
              <div className="rounded-2xl bg-proof-green/20 border border-proof-green/40 p-6 text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-1">
                  Your Dispute Pack is ready
                </h2>
                <p className="text-slate-400 text-sm">
                  You have: demand letter (copy above), T1 links, evidence deadlines,
                  and serving checklist.
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <Link
                  href="/inspection/new"
                  className="block w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold text-center hover:bg-cyan-400 active:scale-[0.97] transition-transform"
                >
                  Create Evidence Pack (if you need one)
                </Link>
                <a
                  href="https://tribunalsontario.ca/ltb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 active:scale-[0.97] transition-transform"
                >
                  Open LTB website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("home");
                  setOutcome("");
                }}
                className="block w-full text-center text-slate-500 text-sm"
              >
                Start over
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {step !== "home" && (
        <p className="text-slate-600 text-xs mt-8 text-center">
          Information only, not legal advice. Outcome not guaranteed.
        </p>
      )}
    </div>
  );
}
