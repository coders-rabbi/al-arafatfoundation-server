import Visit from "./visit.model";
import { TTrafficStats } from "./visit.interface";

const trackVisit = async (userId?: string, path?: string, source?: string) => {
  const visit = await Visit.create({
    ...(path ? { path } : {}),
    ...(userId ? { userId } : {}),
    ...(source ? { source } : {}),
  });

  return visit;
};

const getTrafficStats = async (): Promise<TTrafficStats> => {
  const totalVisits = await Visit.countDocuments();
  const registeredVisits = await Visit.countDocuments({
    userId: { $exists: true },
  });
  const guestVisits = totalVisits - registeredVisits;

  const sourceStats = await Visit.aggregate([
    {
      $group: {
        _id: "$source",
        count: { $sum: 1 },
      },
    },
  ]);

  const bySource = sourceStats.reduce(
    (acc, item) => {
      acc[item._id || "direct"] = item.count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    totalVisits,
    registeredVisits,
    guestVisits,
    bySource,
  };
};

export const visitServices = {
  trackVisit,
  getTrafficStats,
};
