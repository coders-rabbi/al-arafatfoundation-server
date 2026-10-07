import mongoose from "mongoose";
import { app } from "./app";
import { seedSuperAdmin } from "./app/modules/DB";
import config from "./app/config";

async function main() {
  await mongoose.connect(config.database_url as string);
  console.log("MongoDB connected");

  await seedSuperAdmin();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
