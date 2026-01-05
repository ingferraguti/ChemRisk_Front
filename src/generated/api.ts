import { customFetch } from "@/lib/http";

export type ErrorMessage = {
  message: string;
};

export type AuthFailure = {
  success: boolean;
  message: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  id?: number;
  username?: string;
  mail?: string | null;
  name?: string | null;
  surname?: string | null;
  password?: string | null;
  roles: string[];
  token: string;
};

export type VerifyTokenRequest = {
  token: string;
};

export type UserBase = {
  id?: number;
  mail?: string | null;
  name?: string | null;
  surname?: string | null;
  username?: string | null;
  password?: string | null;
  roles?: string | null;
};

export type UserWithRoles = UserBase & {
  roles?: string[];
};

export type UserAdminCreate = {
  mail: string;
  name: string;
  password: string;
  surname: string;
  username: string;
  roles: string[];
};

export type UserAdminUpdate = {
  mail: string;
  name: string;
  surname: string;
  roles: string[];
};

export type FrasiH = {
  id?: number;
  Codice: string;
  Descrizione: string;
  Punteggio: number;
};

export type Sostanza = {
  id?: number;
  Identificativo: string;
  Nome: string;
  Score: number;
  VLEP: boolean;
  User: number;
  FrasiH: number[];
};

export type Miscelanonpericolosa = {
  id?: number;
  Nome: string;
  Score: number;
  Sostanza: number[];
};

export type Processo = {
  id?: number;
  AltaEmissione: boolean;
  Nome: string;
  Sostanza: number[];
};

export const postLogin = (data: LoginRequest) =>
  customFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const postVerifyToken = (data: VerifyTokenRequest) =>
  customFetch<Record<string, unknown>>("/verifyToken", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUsers = () => customFetch<UserWithRoles[]>("/Users/", { method: "GET" });

export const postUsers = (data: UserAdminCreate) =>
  customFetch<UserAdminCreate>("/Users/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUsersById = (id: number) =>
  customFetch<UserWithRoles>(`/Users/${id}`, { method: "GET" });

export const postUsersById = (id: number, data: UserAdminUpdate) =>
  customFetch<UserAdminUpdate>(`/Users/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteUsersById = (id: number) =>
  customFetch<boolean>(`/Users/${id}`, { method: "DELETE" });

export const getFrasih = () => customFetch<FrasiH[]>("/frasih", { method: "GET" });

export const postFrasih = (data: FrasiH) =>
  customFetch<FrasiH>("/frasih", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getFrasihById = (id: number) =>
  customFetch<FrasiH>(`/frasih/${id}`, { method: "GET" });

export const postFrasihById = (id: number, data: FrasiH) =>
  customFetch<FrasiH>(`/frasih/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteFrasihById = (id: number) =>
  customFetch<boolean>(`/frasih/${id}`, { method: "DELETE" });

export const getSostanza = () => customFetch<Sostanza[]>("/sostanza", { method: "GET" });

export const postSostanza = (data: Sostanza) =>
  customFetch<Sostanza>("/sostanza", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getSostanzaById = (id: number) =>
  customFetch<Sostanza>(`/sostanza/${id}`, { method: "GET" });

export const postSostanzaById = (id: number, data: Sostanza) =>
  customFetch<Sostanza>(`/sostanza/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteSostanzaById = (id: number) =>
  customFetch<boolean>(`/sostanza/${id}`, { method: "DELETE" });

export const getSostanzaFindByFrasiH = (key: number) =>
  customFetch<Sostanza[]>(`/sostanza/findByFrasiH/${key}`, { method: "GET" });

export const getSostanzaFindByUser = (key: number) =>
  customFetch<Sostanza[]>(`/sostanza/findByUser/${key}`, { method: "GET" });

export const getSostanzaFindByVlep = (key: boolean) =>
  customFetch<Sostanza[]>(`/sostanza/findByVLEP/${key}`, { method: "GET" });

export const getMiscelanonpericolosa = () =>
  customFetch<Miscelanonpericolosa[]>("/miscelanonpericolosa", { method: "GET" });

export const postMiscelanonpericolosa = (data: Miscelanonpericolosa) =>
  customFetch<Miscelanonpericolosa>("/miscelanonpericolosa", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMiscelanonpericolosaById = (id: number) =>
  customFetch<Miscelanonpericolosa>(`/miscelanonpericolosa/${id}`, { method: "GET" });

export const postMiscelanonpericolosaById = (id: number, data: Miscelanonpericolosa) =>
  customFetch<Miscelanonpericolosa>(`/miscelanonpericolosa/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteMiscelanonpericolosaById = (id: number) =>
  customFetch<boolean>(`/miscelanonpericolosa/${id}`, { method: "DELETE" });

export const getMiscelanonpericolosaFindByNome = (key: string) =>
  customFetch<Miscelanonpericolosa[]>(`/miscelanonpericolosa/findByNome/${key}`, {
    method: "GET",
  });

export const getMiscelanonpericolosaFindBySostanza = (key: number) =>
  customFetch<Miscelanonpericolosa[]>(`/miscelanonpericolosa/findBySostanza/${key}`, {
    method: "GET",
  });

export const getProcesso = () => customFetch<Processo[]>("/processo", { method: "GET" });

export const postProcesso = (data: Processo) =>
  customFetch<Processo>("/processo", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getProcessoById = (id: number) =>
  customFetch<Processo>(`/processo/${id}`, { method: "GET" });

export const postProcessoById = (id: number, data: Processo) =>
  customFetch<Processo>(`/processo/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteProcessoById = (id: number) =>
  customFetch<boolean>(`/processo/${id}`, { method: "DELETE" });

export const getProcessoFindByNome = (key: string) =>
  customFetch<Processo[]>(`/processo/findByNome/${key}`, { method: "GET" });

export const getUser = () => customFetch<UserBase[]>("/user", { method: "GET" });

export const postUser = (data: UserBase) =>
  customFetch<UserBase>("/user", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUserById = (id: number) =>
  customFetch<UserBase>(`/user/${id}`, { method: "GET" });

export const postUserById = (id: number, data: UserBase) =>
  customFetch<UserBase>(`/user/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteUserById = (id: number) =>
  customFetch<boolean>(`/user/${id}`, { method: "DELETE" });

export const postUserChangePassword = (id: number) =>
  customFetch<string>(`/user/${id}/changePassword`, { method: "POST" });
