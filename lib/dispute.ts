export const DISPUTE_OUTCOMES = [
  { id: "deduction", label: "They kept part of my money" },
  { id: "full_withheld", label: "They kept all of my money" },
  { id: "delay", label: "They're delaying / ignoring me" },
  { id: "illegal_fee", label: "They charged an illegal fee/deposit" },
  { id: "unsure", label: "Not sure (help me choose)" },
] as const;

export const LTB_ROUTES = {
  t1: { label: "T1", form: "Application for a Refund of the Last Month's Rent and/or a Refund of a Rent Deposit" },
  t2: { label: "T2", form: "Tenant's Rights (not covered yet)", future: true },
  t6: { label: "T6", form: "Repairs (not covered yet)", future: true },
};

export const ONTARIO_EVIDENCE_RULES = [
  {
    title: "Evidence deadlines (Ontario LTB)",
    bullets: [
      "Send your evidence to both the landlord and the LTB at least 7 days before the hearing.",
      "If you're replying to something new they submitted, reply evidence is usually due 5 days before the hearing.",
      "If you're mailing documents, send earlier to avoid missing deadlines (mail can take time).",
    ],
  },
];

export const ONTARIO_LTB_STEPS = [
  {
    step: 1,
    title: "Try to resolve in writing first",
    body: "Send a demand letter (we'll generate one below) by email and keep a copy. Give a reasonable deadline (e.g. 7–14 days).",
  },
  {
    step: 2,
    title: "File with the Landlord and Tenant Board (LTB)",
    body: "If they don't respond or refuse, file a T1 application. Form and guide: tribunalsontario.ca/ltb.",
  },
  {
    step: 3,
    title: "Application fee",
    body: "As of 2024, the fee is $53 for most applications. You can ask the LTB to order the landlord to reimburse this if you win.",
  },
  {
    step: 4,
    title: "Attach your evidence",
    body: "Upload your MoveProof Evidence Pack PDF, your lease, any emails/texts, and photos. Evidence to all parties + LTB: 7 days before hearing. Reply evidence: 5 days before.",
  },
  {
    step: 5,
    title: "Serving documents",
    body: "Sometimes you'll be ordered to serve the other party yourself. Use approved methods (in-person, mail, courier, email in some cases). Save proof (courier slip, email receipt).",
  },
  {
    step: 6,
    title: "Hearing",
    body: "You'll get a hearing date. Many cases are resolved before then once the landlord sees you have proof. Bring printed copies of your Evidence Pack.",
  },
];

export const T1_EXPLAINER = {
  title: "Ontario: this usually maps to Form T1",
  body: "T1 is used when a landlord collected money they shouldn't have or didn't pay money they owe you.",
  links: {
    instructions: "https://tribunalsontario.ca/ltb/forms",
    formPdf: "https://tribunalsontario.ca/documents/ltb/Form_T1.pdf",
  },
};

export const FILING_OPTIONS = {
  title: "How to file (Ontario)",
  bullets: [
    "File online using the Tribunals Ontario Portal (applications, fees, status, uploading evidence).",
    "After filing, usually the LTB serves the other party—but sometimes you'll be ordered to serve documents yourself.",
    "If you're ordered to serve, use approved service methods (in-person, mail, courier, email in some cases).",
  ],
  portal: "https://tribunalsontario.ca/ltb",
};

export const SERVICE_CHECKLIST = {
  title: "Serving documents (Ontario LTB)",
  body: "Serving = delivering documents to the other party in an allowed way.",
  items: [
    "Choose service method (in-person, mail, courier, email if allowed)",
    "Record when/how you served",
    "Save proof (courier slip, email proof, etc.)",
  ],
};

export function getDemandLetterTemplate(opt: {
  tenantName: string;
  tenantEmail: string;
  landlordName: string;
  address: string;
  amountDisputed: number;
  outcome: string;
  date: string;
  deadlineDate: string;
}): string {
  const outcomePhrase =
    opt.outcome === "full_withheld"
      ? "withheld my entire security deposit"
      : opt.outcome === "deduction"
        ? "made an unfair deduction from my security deposit"
        : opt.outcome === "delay"
          ? "have not returned my security deposit within a reasonable time"
          : opt.outcome === "illegal_fee"
            ? "charged me an illegal fee or deposit"
            : "have not returned my security deposit in accordance with the law";

  return `${opt.date}

${opt.landlordName}
Re: Demand for return of security deposit – ${opt.address}

Dear ${opt.landlordName},

I am writing to formally demand the return of my security deposit (or the remaining portion) for the rental unit at ${opt.address}.

You have ${outcomePhrase}. I have documented the condition of the unit at move-in and move-out with timestamped photos and an inspection report.

I am requesting the sum of $${opt.amountDisputed.toFixed(2)} to be returned to me within 14 days of the date of this letter.

If I do not receive payment or a written response with a valid reason for withholding the deposit by ${opt.deadlineDate}, I will file an application with the Landlord and Tenant Board (LTB) to recover the deposit plus the application fee.

You can reach me at ${opt.tenantEmail}.

Sincerely,
${opt.tenantName}`;
}
