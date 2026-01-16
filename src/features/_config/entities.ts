import type { EntityConfig, FieldOption } from "@/features/_crud/types";
import {
  deleteAdminUsersId,
  deleteAgentiChimiciId,
  deleteFrasihId,
  deleteSostanzaId,
  deleteUserId,
  deleteUsersId,
  getAdminUsers,
  getAdminUsersId,
  getAgentiChimici,
  getAgentiChimiciId,
  getFrasih,
  getFrasihId,
  getSostanza,
  getSostanzaFindByFrasiHKey,
  getSostanzaFindByUserKey,
  getSostanzaFindByVLEPKey,
  getSostanzaId,
  getUser,
  getUserId,
  getUsers,
  getUsersId,
  patchAdminUsersId,
  patchAgentiChimiciId,
  postAdminUsers,
  postAgentiChimici,
  postFrasih,
  postFrasihId,
  postSostanza,
  postSostanzaId,
  postUser,
  postUserId,
  postUsers,
  postUsersId,
  AgenteChimicoTipo,
  type AgenteChimico,
  type AgenteChimicoCreate,
  type PatchAgentiChimiciIdBody,
  type FrasiH,
  type Sostanza,
  type User,
  type UserAdminCreate,
  type UserAdminUpdate,
  type UserBase,
  type UserWithRoles,
} from "@/generated/api";

const parseNumber = (value: unknown) => {
  if (value === "" || value == null) {
    return undefined;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? undefined : numeric;
};

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
    label: `${item.Nome} (${item.Identificativo})`,
    value: item.id ?? 0,
  }));
};

export const ENTITIES: Array<
  | EntityConfig<FrasiH[], FrasiH, FrasiH, FrasiH>
  | EntityConfig<Sostanza[], Sostanza, Sostanza, Sostanza>
  | EntityConfig<AgenteChimico[], AgenteChimico, AgenteChimicoCreate, PatchAgentiChimiciIdBody>
  | EntityConfig<User[], User, UserAdminCreate, UserAdminUpdate>
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
      list: () => getFrasih(),
      get: getFrasihId,
      create: postFrasih,
      update: postFrasihId,
      remove: async (id: number) => {
        await deleteFrasihId(id);
        return true;
      },
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
        { key: "User", label: "User" },
      ],
    },
    form: {
      fields: [
        { name: "Identificativo", label: "Identificativo", type: "string", required: true },
        { name: "Nome", label: "Nome", type: "string", required: true },
        { name: "Score", label: "Score", type: "number", required: true, parse: parseNumber },
        { name: "VLEP", label: "VLEP", type: "boolean", required: true },
        {
          name: "User",
          label: "User",
          type: "number",
          required: true,
          parse: parseNumber,
          description: "ID utente proprietario.",
        },
        {
          name: "FrasiH",
          label: "Frasi H",
          type: "relation",
          required: true,
          multiple: true,
          loadOptions: frasiHOptions,
        },
      ],
    },
    api: {
      list: () => getSostanza(),
      get: getSostanzaId,
      create: postSostanza,
      update: postSostanzaId,
      remove: async (id: number) => {
        await deleteSostanzaId(id);
        return true;
      },
    },
  },
  {
    key: "sostanza-by-frasih",
    label: "Sostanze (Filtro Frasi H)",
    routes: { base: "/app/sostanza-by-frasih" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "server",
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
        { name: "Score", label: "Score", type: "number", required: true, parse: parseNumber },
        { name: "VLEP", label: "VLEP", type: "boolean", required: true },
        { name: "User", label: "User", type: "number", required: true, parse: parseNumber },
        {
          name: "FrasiH",
          label: "Frasi H",
          type: "relation",
          required: true,
          multiple: true,
          loadOptions: frasiHOptions,
        },
      ],
    },
    api: {
      list: () => getSostanza(),
      get: getSostanzaId,
      create: postSostanza,
      update: postSostanzaId,
      remove: async (id: number) => {
        await deleteSostanzaId(id);
        return true;
      },
    },
    serverSearch: async (query: string) => {
      const id = Number(query);
      if (Number.isNaN(id)) {
        return [];
      }
      return getSostanzaFindByFrasiHKey(id);
    },
    readOnly: true,
  },
  {
    key: "sostanza-by-user",
    label: "Sostanze (Filtro User)",
    routes: { base: "/app/sostanza-by-user" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "server",
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
        { name: "Score", label: "Score", type: "number", required: true, parse: parseNumber },
        { name: "VLEP", label: "VLEP", type: "boolean", required: true },
        { name: "User", label: "User", type: "number", required: true, parse: parseNumber },
        {
          name: "FrasiH",
          label: "Frasi H",
          type: "relation",
          required: true,
          multiple: true,
          loadOptions: frasiHOptions,
        },
      ],
    },
    api: {
      list: () => getSostanza(),
      get: getSostanzaId,
      create: postSostanza,
      update: postSostanzaId,
      remove: async (id: number) => {
        await deleteSostanzaId(id);
        return true;
      },
    },
    serverSearch: async (query: string) => {
      const id = Number(query);
      if (Number.isNaN(id)) {
        return [];
      }
      return getSostanzaFindByUserKey(id);
    },
    readOnly: true,
  },
  {
    key: "sostanza-by-vlep",
    label: "Sostanze (Filtro VLEP)",
    routes: { base: "/app/sostanza-by-vlep" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "server",
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
        { name: "Score", label: "Score", type: "number", required: true, parse: parseNumber },
        { name: "VLEP", label: "VLEP", type: "boolean", required: true },
        { name: "User", label: "User", type: "number", required: true, parse: parseNumber },
        {
          name: "FrasiH",
          label: "Frasi H",
          type: "relation",
          required: true,
          multiple: true,
          loadOptions: frasiHOptions,
        },
      ],
    },
    api: {
      list: () => getSostanza(),
      get: getSostanzaId,
      create: postSostanza,
      update: postSostanzaId,
      remove: async (id: number) => {
        await deleteSostanzaId(id);
        return true;
      },
    },
    serverSearch: async (query: string) => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        return [];
      }
      if (normalized !== "true" && normalized !== "false") {
        return [];
      }
      return getSostanzaFindByVLEPKey(normalized === "true");
    },
    readOnly: true,
  },
  {
    key: "agenti-chimici",
    label: "Agenti chimici",
    routes: { base: "/app/agenti-chimici" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "nome", label: "Nome" },
        { key: "identificativo", label: "Identificativo" },
        { key: "tipo", label: "Tipo" },
        { key: "vlep", label: "VLEP" },
        { key: "alta_emissione", label: "Alta emissione" },
      ],
    },
    form: {
      fields: [
        { name: "nome", label: "Nome", type: "string", required: true },
        { name: "identificativo", label: "Identificativo", type: "string", required: true },
        {
          name: "tipo",
          label: "Tipo",
          type: "enum",
          required: true,
          options: Object.values(AgenteChimicoTipo).map((value) => ({
            label: value,
            value,
          })),
        },
        { name: "vlep", label: "VLEP", type: "boolean", required: true },
        { name: "alta_emissione", label: "Alta emissione", type: "boolean", required: true },
        {
          name: "frasiHIds",
          label: "Frasi H",
          type: "relation",
          multiple: true,
          required: false,
          loadOptions: frasiHOptions,
          parse: (value) => (Array.isArray(value) && value.length > 0 ? value : undefined),
        },
        {
          name: "sostanzeComponentiIds",
          label: "Sostanze componenti",
          type: "relation",
          multiple: true,
          required: false,
          loadOptions: sostanzaOptions,
          parse: (value) => (Array.isArray(value) && value.length > 0 ? value : undefined),
        },
      ],
    },
    api: {
      list: () => getAgentiChimici(),
      get: getAgentiChimiciId,
      create: postAgentiChimici,
      update: patchAgentiChimiciId,
      remove: async (id: number) => {
        await deleteAgentiChimiciId(id);
        return true;
      },
    },
  },
  {
    key: "admin-users",
    label: "Utenti (Admin)",
    routes: { base: "/app/admin-users" },
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
        { key: "isActive", label: "Attivo" },
      ],
    },
    form: {
      fields: [
        { name: "username", label: "Username", type: "string", required: true, hideOnEdit: true },
        {
          name: "password",
          label: "Password",
          type: "string",
          required: true,
          hideOnEdit: true,
          description: "Minimo 8 caratteri.",
        },
        { name: "mail", label: "Email", type: "string", required: false },
        { name: "name", label: "Nome", type: "string", required: false },
        { name: "surname", label: "Cognome", type: "string", required: false },
        {
          name: "roles",
          label: "Ruoli",
          type: "string",
          required: true,
          multiline: true,
          placeholder: "ADMIN,USER",
          parse: (value) =>
            String(value ?? "")
              .split(",")
              .map((role) => role.trim())
              .filter(Boolean),
          hideOnEdit: true,
        },
        {
          name: "roles",
          label: "Ruoli",
          type: "string",
          required: false,
          multiline: true,
          placeholder: "ADMIN,USER",
          parse: (value) => {
            const parsed = String(value ?? "")
              .split(",")
              .map((role) => role.trim())
              .filter(Boolean);
            return parsed.length > 0 ? parsed : undefined;
          },
          hideOnCreate: true,
        },
        { name: "isActive", label: "Attivo", type: "boolean", required: false, hideOnCreate: true },
      ],
    },
    api: {
      list: () => getAdminUsers(),
      get: getAdminUsersId,
      create: postAdminUsers,
      update: patchAdminUsersId,
      remove: async (id: number) => {
        await deleteAdminUsersId(id);
        return true;
      },
    },
    requiresAdmin: true,
  },
  {
    key: "users-roles",
    label: "Utenti con ruoli (Legacy)",
    routes: { base: "/app/users-roles" },
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
        { name: "username", label: "Username", type: "string", required: true, hideOnEdit: true },
        {
          name: "password",
          label: "Password",
          type: "string",
          required: true,
          hideOnEdit: true,
          description: "Minimo 8 caratteri.",
        },
        { name: "mail", label: "Email", type: "string", required: false },
        { name: "name", label: "Nome", type: "string", required: false },
        { name: "surname", label: "Cognome", type: "string", required: false },
        {
          name: "roles",
          label: "Ruoli",
          type: "string",
          required: true,
          multiline: true,
          placeholder: "ADMIN,USER",
          parse: (value) =>
            String(value ?? "")
              .split(",")
              .map((role) => role.trim())
              .filter(Boolean),
          hideOnEdit: true,
        },
        {
          name: "roles",
          label: "Ruoli",
          type: "string",
          required: false,
          multiline: true,
          placeholder: "ADMIN,USER",
          parse: (value) => {
            const parsed = String(value ?? "")
              .split(",")
              .map((role) => role.trim())
              .filter(Boolean);
            return parsed.length > 0 ? parsed : undefined;
          },
          hideOnCreate: true,
        },
      ],
    },
    api: {
      list: () => getUsers(),
      get: getUsersId,
      create: postUsers,
      update: postUsersId,
      remove: async (id: number) => {
        await deleteUsersId(id);
        return true;
      },
    },
    requiresAdmin: true,
  },
  {
    key: "user-base",
    label: "Utenti base",
    routes: { base: "/app/user-base" },
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
        { name: "mail", label: "Email", type: "string", required: false },
        { name: "name", label: "Nome", type: "string", required: false },
        { name: "surname", label: "Cognome", type: "string", required: false },
        { name: "username", label: "Username", type: "string", required: false },
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
      list: () => getUser(),
      get: getUserId,
      create: postUser,
      update: postUserId,
      remove: async (id: number) => {
        await deleteUserId(id);
        return true;
      },
    },
  },
];

export function getEntity(key: string) {
  return ENTITIES.find((entity) => entity.key === key);
}
