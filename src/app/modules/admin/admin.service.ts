import { TAdmin } from "./admin.interface";
import { Admin } from "./admin.model";

const createAdminIntoBd = async (payload: TAdmin) => {
  const result = await Admin.create(payload);
  return result;
};

const getAdminfromBD = async () => {
  const response = await Admin.find();
  return response;
};

const getSingleAdminUserFromDB = async (id: string) => {
  const response = await Admin.findById(id);
  return response;
};

const updateAdminInfoFromDB = async (id: string, payload: Partial<TAdmin>) => {
  const response = await Admin.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
  return response;
};

const deleteAdminUserFromDB = async (id: string) => {
  const response = await Admin.findByIdAndDelete(id, {
    isDeleted: true,
  });
  return response;
};

export const adminService = {
  getSingleAdminUserFromDB,
  updateAdminInfoFromDB,
  deleteAdminUserFromDB,
  createAdminIntoBd,
  getAdminfromBD,
};
