export interface IProject {
  title: string;
  duration: string;
  location: string;
  beneficiary: number;
  expense: number;
  status?: "Ongoing" | "Completed";
  isDeleted?: boolean;
}
