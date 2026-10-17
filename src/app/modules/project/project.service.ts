import { IProject } from "./project.interface";
import { Project } from "./project.model";

const createProjectIntoDB = async (payload: IProject) => {
  const result = await Project.create(payload);
  return result;
};

const getAllProjectsFromDB = async (query: Record<string, unknown> = {}) => {
  const filter: Record<string, unknown> = {};

  // ?status=Completed ba ?status=Ongoing diye filter
  if (query.status === "Completed" || query.status === "Ongoing") {
    filter.status = query.status;
  }

  const result = await Project.find(filter).sort({ createdAt: -1 });
  return result;
};

const getSingleProjectFromDB = async (id: string) => {
  const result = await Project.findById(id);
  return result;
};

const updateProjectInDB = async (id: string, payload: Partial<IProject>) => {
  const result = await Project.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProjectFromDB = async (id: string) => {
  const result = await Project.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ProjectServices = {
  createProjectIntoDB,
  getAllProjectsFromDB,
  getSingleProjectFromDB,
  updateProjectInDB,
  deleteProjectFromDB,
};
