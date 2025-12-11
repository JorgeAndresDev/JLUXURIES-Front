import api from "../api/axios";

export const registerUser = async (nombre: string, email: string, password: string) => {
  const res = await api.post("/auth/register", {
    nombre,
    email,
    password,
  });
  return res.data;
};
