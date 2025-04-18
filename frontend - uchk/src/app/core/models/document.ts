import { User } from "./user";

export interface Document {
  id: number;
  titre: string;
  description: string;
  typeDocument?: {
    id: number;
    nomType: string;
    description?: string;
  };
  typeDocumentId: number;
  user: User;
  userId: number;
  file: File | null;
  fileName?: string;
  fileUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
