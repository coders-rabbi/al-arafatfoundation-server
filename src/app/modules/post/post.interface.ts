export interface IPost {
  title: string;
  content: string;
  imageUrl: string[];
  videoUrl: string;
  projectAim: string;
  benificiary: string;
  expense_details: string;
  projectLocation: string;
  duration: string;
  status?: "pending" | "approved" | "rejected" | "deleted" | "draft";
}
