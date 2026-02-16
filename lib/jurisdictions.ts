export type RegionStatus = "live" | "soon";

export type Region = {
  id: string; // "on", "ca", "ny", etc
  label: string; // "Ontario"
  country: "CA" | "US";
  status: RegionStatus;
  shortBlurb: string;
  route: string; // "/r/on"
};

export const REGIONS: Region[] = [
  {
    id: "on",
    label: "Ontario",
    country: "CA",
    status: "live",
    shortBlurb: "LTB-ready module live.",
    route: "/r/on",
  },
  {
    id: "bc",
    label: "British Columbia",
    country: "CA",
    status: "soon",
    shortBlurb: "RTB module coming soon.",
    route: "/r/bc",
  },
  { id: "ca", label: "California", country: "US", status: "soon", shortBlurb: "Coming soon.", route: "/r/ca" },
  { id: "ny", label: "New York", country: "US", status: "soon", shortBlurb: "Coming soon.", route: "/r/ny" },
  { id: "tx", label: "Texas", country: "US", status: "soon", shortBlurb: "Coming soon.", route: "/r/tx" },
];

export type JurisdictionModule = {
  regionId: string;
  tribunalOrCourt: string;
  deadlinesBullets: string[];
  includes: string[];
  disclaimer: string;
};

export const MODULES: Record<string, JurisdictionModule> = {
  on: {
    regionId: "on",
    tribunalOrCourt: "Ontario (LTB / Small Claims)",
    deadlinesBullets: [
      "Ontario: Document move-out condition immediately (same day).",
      "Ontario: Keep a dated communication log with the landlord.",
      "Ontario: If disputed, use your Pack index to support your claim/defense.",
    ],
    includes: [
      "Chain of custody + media manifest",
      "Tamper-evident hashes + Pack ID verification",
      "Demand letter template + filing checklist (Ontario)",
    ],
    disclaimer:
      "MoveProof is not a law firm. This provides structured evidence packaging and jurisdiction checklists.",
  },
  bc: {
    regionId: "bc",
    tribunalOrCourt: "BC (RTB) — Coming soon",
    deadlinesBullets: ["BC module is coming soon."],
    includes: ["Evidence pack still works everywhere."],
    disclaimer: "Coming soon.",
  },
  ca: { regionId: "ca", tribunalOrCourt: "California — Coming soon", deadlinesBullets: ["Coming soon."], includes: ["Evidence pack still works everywhere."], disclaimer: "Coming soon." },
  ny: { regionId: "ny", tribunalOrCourt: "New York — Coming soon", deadlinesBullets: ["Coming soon."], includes: ["Evidence pack still works everywhere."], disclaimer: "Coming soon." },
  tx: { regionId: "tx", tribunalOrCourt: "Texas — Coming soon", deadlinesBullets: ["Coming soon."], includes: ["Evidence pack still works everywhere."], disclaimer: "Coming soon." },
};
