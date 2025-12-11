import api from "../api/axios";

export const getProducts = () =>
  api.get("/luxuries/get_luxuries");

export const createProduct = (data: any) =>
  api.post("/luxuries/register_luxury", data);

export const updateProduct = (data: any) =>
  api.put(`/luxuries/update_luxury/${data.idProducts}`, data);

export const deleteProduct = (idProducts: number) =>
  api.delete(`/luxuries/delete_item/${idProducts}`);

export const getItem = (idProducts: number) =>
  api.get(`/luxuries/get_item/${idProducts}`);