import { TUser } from "@/App";
import api from "./axios";

// GET with query params
type GetUsersParams = {
  searchTerm?: string;
  sort?: string;
  page?: number;
  limit?: number;
  fields?: string;
  role?: string;
  status?: string;
};

const getUsers = async (params: GetUsersParams) => {
  try {
    const res = await api.get<TUser[]>("/users", { params });
    console.log(res.data);
  } catch (err) {
    console.error("GET failed:", err);
  }
};
// PATCH (partial update)
const patchUser = async (userId: string, updateData: Partial<TUser>) => {
  try {
    const res = await api.patch<TUser>(`/users/${userId}`, updateData);
    console.log("PATCH response:", res.data);
  } catch (err) {
    console.error("PATCH failed:", err);
  }
};

// PUT (full update)
const putUser = async (userId: string, userData: TUser) => {
  try {
    const res = await api.put<TUser>(`/users/${userId}`, userData);
    console.log("PUT response:", res.data);
  } catch (err) {
    console.error("PUT failed:", err);
  }
};

// DELETE
const deleteUser = async (userId: string) => {
  try {
    const res = await api.delete(`/users/${userId}`);
    console.log("DELETE response status:", res.status);
  } catch (err) {
    console.error("DELETE failed:", err);
  }
};

export { getUsers, patchUser, putUser, deleteUser };
