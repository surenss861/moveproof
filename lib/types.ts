export type InspectionType = "move-in" | "move-out";

export const ROOMS = [
  "Kitchen",
  "Bathroom",
  "Bedroom",
  "Living room",
  "Hallway / Entry",
  "Other",
] as const;

export type RoomId = (typeof ROOMS)[number];

export interface PhotoRecord {
  evidenceId?: string; // Required for new uploads; absent on legacy
  url: string;
  storagePath: string;
  sha256?: string; // Required for new uploads; absent on legacy
  timestamp: string; // ISO = capturedAtDevice
  uploadedAtServer?: string;
  latitude?: number;
  longitude?: number;
  room: RoomId;
  note?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface Inspection {
  id: string;
  userId: string;
  type: InspectionType;
  address: string;
  landlordName?: string;
  startedAt: string;
  completedAt?: string;
  photos: PhotoRecord[];
  roomNotes: Partial<Record<RoomId, string>>;
  packId?: string;
  packHash?: string;
  manifestVersion?: number;
  generatedAtServer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | null;
  stripeCustomerId?: string;
}

export type DisputeOutcome =
  | "deduction"
  | "full_withheld"
  | "delay"
  | "illegal_fee"
  | "unsure";

export interface DisputeDraft {
  id: string;
  userId: string;
  inspectionId?: string;
  outcome: DisputeOutcome;
  amountDisputed?: number;
  landlordName?: string;
  address?: string;
  province: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
