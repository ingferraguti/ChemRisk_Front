import type { EntityConfig, FieldOption } from "@/features/_crud/types";
import {
  deleteFrasihById,
  deleteMiscelanonpericolosaById,
  deleteProcessoById,
  deleteSostanzaById,
  deleteUserById,
  deleteUsersById,
  getFrasih,
  getFrasihById,
  getMiscelanonpericolosa,
  getMiscelanonpericolosaById,
  getMiscelanonpericolosaFindByNome,
  getProcesso,
  getProcessoById,
  getProcessoFindByNome,
  getSostanza,
  getSostanzaById,
  getUser,
  getUserById,
  getUsers,
  getUsersById,
  postFrasih,
  postFrasihById,
  postMiscelanonpericolosa,
  postMiscelanonpericolosaById,
  postProcesso,
  postProcessoById,
  postSostanza,
  postSostanzaById,
  postUser,
  postUserById,
  postUsers,
  postUsersById,
  type FrasiH,
  type Miscelanonpericolosa,
  type Processo,
  type Sostanza,
  type UserAdminCreate,
  type UserAdminUpdate,
  type UserBase,
  type UserWithRoles,
} from "@/generated/api";

const frasiHOptions = async (): Promise<FieldOption[]> => {
  const list = await getFrasih();
  return list.map((item) => ({
    label: `${item.Codice} - ${item.Descrizione}`,
    value: item.id ?? 0,
  }));
};

const sostanzaOptions = async (): Promise<FieldOption[]> => {
  const list = await getSostanza();
  return list.map((item) => ({
    label: item.Nome,
    value: item.id ?? 0,
  }));
};

export const ENTITIES: Array<
  | EntityConfig<FrasiH[], FrasiH, FrasiH, FrasiH>
  | EntityConfig<Sostanza[], Sostanza, Sostanza, Sostanza>
  | EntityConfig<Miscelanonpericolosa[], Miscelanonpericolosa, Miscelanonpericolosa, Miscelanonpericolosa>
  | EntityConfig<Processo[], Processo, Processo, Processo>
  | EntityConfig<UserWithRoles[], UserWithRoles, UserAdminCreate, UserAdminUpdate>
  | EntityConfig<UserBase[], UserBase, UserBase, UserBase>
> = [
  {
    key: "frasih",
    label: "Frasi H",
    routes: { base: "/app/frasih" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "Codice", label: "Codice" },
        { key: "Descrizione", label: "Descrizione" },
        { key: "Punteggio", label: "Punteggio" },
      ],
    },
    form: {
      fields: [
        { name: "Codice", label: "Codice", type: "string", required: true },
        {
          name: "Descrizione",
          label: "Descrizione",
          type: "string",
          required: true,
          multiline: true,
        },
        { name: "Punteggio", label: "Punteggio", type: "number", required: true },
      ],
    },
    api: {
      list: getFrasih,
      get: getFrasihById,
      create: postFrasih,
      update: postFrasihById,
      remove: deleteFrasihById,
    },
  },
  {
    key: "sostanza",
    label: "Sostanze",
    routes: { base: "/app/sostanza" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "Identificativo", label: "Identificativo" },
        { key: "Nome", label: "Nome" },
        { key: "Score", label: "Score" },
        { key: "VLEP", label: "VLEP" },
      ],
    },
    form: {
      fields: [
        { name: "Identificativo", label: "Identificativo", type: "string", required: true },
        { name: "Nome", label: "Nome", type: "string", required: true },
        { name: "Score", label: "Score", type: "number", required: true },
        { name: "VLEP", label: "VLEP", type: "boolean", required: true },
        {
          name: "User",
          label: "User",
          type: "number",
          required: true,
          description: "ID utente proprietario (gestito dal backend).",
        },
        {
          name: "FrasiH",
          label: "Frasi H",
          type: "relation",
          required: true,
          multiple: true,
          loadOptions: frasiHOptions,
          description: "Relazione con le Frasi H associate.",
        },
      ],
    },
    api: {
      list: getSostanza,
      get: getSostanzaById,
      create: postSostanza,
      update: postSostanzaById,
      remove: deleteSostanzaById,
    },
  },
  {
    key: "miscelanonpericolosa",
    label: "Miscele non pericolose",
    routes: { base: "/app/miscelanonpericolosa" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "server",
      columns: [
        { key: "id", label: "ID" },
        { key: "Nome", label: "Nome" },
        { key: "Score", label: "Score" },
        {
          key: "Sostanza",
          label: "Sostanze",
          render: (item) => (item.Sostanza ?? []).join(", "),
        },
      ],
    },
    form: {
      fields: [
        { name: "Nome", label: "Nome", type: "string", required: true },
        { name: "Score", label: "Score", type: "number", required: true },
        {
          name: "Sostanza",
          label: "Sostanze",
          type: "relation",
          required: true,
          multiple: true,
          loadOptions: sostanzaOptions,
        },
      ],
    },
    api: {
      list: getMiscelanonpericolosa,
      get: getMiscelanonpericolosaById,
      create: postMiscelanonpericolosa,
      update: postMiscelanonpericolosaById,
      remove: deleteMiscelanonpericolosaById,
    },
    serverSearch: getMiscelanonpericolosaFindByNome,
  },
  {
    key: "processo",
    label: "Processi",
    routes: { base: "/app/processo" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "server",
      columns: [
        { key: "id", label: "ID" },
        { key: "Nome", label: "Nome" },
        { key: "AltaEmissione", label: "Alta emissione" },
      ],
    },
    form: {
      fields: [
        { name: "Nome", label: "Nome", type: "string", required: true },
        {
          name: "AltaEmissione",
          label: "Alta emissione",
          type: "boolean",
          required: true,
        },
        {
          name: "Sostanza",
          label: "Sostanze",
          type: "relation",
          required: true,
          multiple: true,
          loadOptions: sostanzaOptions,
        },
      ],
    },
    api: {
      list: getProcesso,
      get: getProcessoById,
      create: postProcesso,
      update: postProcessoById,
      remove: deleteProcessoById,
    },
    serverSearch: getProcessoFindByNome,
  },
  {
    key: "usersAdmin",
    label: "Utenti (Admin)",
    routes: { base: "/app/usersAdmin" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "username", label: "Username" },
        { key: "mail", label: "Email" },
        { key: "name", label: "Nome" },
        { key: "surname", label: "Cognome" },
      ],
    },
    form: {
      fields: [
        { name: "mail", label: "Email", type: "string", required: true },
        { name: "name", label: "Nome", type: "string", required: true },
        { name: "surname", label: "Cognome", type: "string", required: true },
        { name: "username", label: "Username", type: "string", required: true, hideOnEdit: true },
        {
          name: "password",
          label: "Password",
          type: "string",
          required: true,
          description: "Richiesta solo in creazione.",
          hideOnEdit: true,
        },
        {
          name: "roles",
          label: "Ruoli",
          type: "string",
          required: true,
          multiline: true,
          placeholder: "ADMIN,USER",
          description: "Inserisci i ruoli separati da virgola.",
          parse: (value) =>
            String(value ?? "")
              .split(",")
              .map((role) => role.trim())
              .filter(Boolean),
        },
      ],
    },
    api: {
      list: getUsers,
      get: getUsersById,
      create: postUsers,
      update: postUsersById,
      remove: deleteUsersById,
    },
  },
  {
    key: "userBase",
    label: "Utenti base",
    routes: { base: "/app/userBase" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "username", label: "Username" },
        { key: "mail", label: "Email" },
        { key: "name", label: "Nome" },
        { key: "surname", label: "Cognome" },
      ],
    },
    form: {
      fields: [
        { name: "mail", label: "Email", type: "string", required: true },
        { name: "name", label: "Nome", type: "string", required: true },
        { name: "surname", label: "Cognome", type: "string", required: true },
        { name: "username", label: "Username", type: "string", required: true },
        {
          name: "password",
          label: "Password",
          type: "string",
          required: false,
          description: "Gestito dal backend se necessario.",
        },
      ],
    },
    api: {
      list: getUser,
      get: getUserById,
      create: postUser,
      update: postUserById,
      remove: deleteUserById,
    },
  },
];

export function getEntity(key: string) {
  return ENTITIES.find((entity) => entity.key === key);
}
