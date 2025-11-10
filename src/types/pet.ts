export type PetType = "dog" | "cat" | "bird" | "rabbit" | "other";
export type PetSize = "small" | "medium" | "large";
export type PetStatus = "available" | "pending" | "adopted";
export type AdoptionStatus = "pending" | "under_review" | "approved" | "rejected";

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  size: PetSize;
  gender: "male" | "female";
  description: string;
  image: string;
  status: PetStatus;
  vaccinated: boolean;
  neutered: boolean;
  medicalHistory: MedicalRecord[];
  specialNeeds?: string;
  adoptionFee: number;
  location: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: "vaccination" | "checkup" | "treatment" | "surgery";
  description: string;
  vet: string;
  nextDue?: string;
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  motivation: string;
  livingSpace: string;
  hasExperience: boolean;
  status: AdoptionStatus;
  submittedDate: string;
  lastUpdated: string;
}

export interface VetAppointment {
  id: string;
  petId: string;
  petName: string;
  vetName: string;
  date: string;
  time: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface PetFeedback {
  id: string;
  petId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  comment: string;
  adoptionDate: string;
  submittedDate: string;
  isVerifiedAdopter: boolean;
}
