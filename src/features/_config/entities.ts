import type { EntityConfig, FieldOption } from "@/features/_crud/types";
import {
  deleteAgentiChimiciId,
  deleteFrasihId,
  deleteMiscelanonpericolosaId,
  deleteProcessoId,
  deleteSostanzaId,
  deleteUserId,
  deleteUsersId,
  getFrasih,
  getFrasihId,
  getAgentiChimici,
  getAgentiChimiciId,
  getMiscelanonpericolosa,
  getMiscelanonpericolosaId,
  getMiscelanonpericolosaFindByNomeKey,
  getProcesso,
  getProcessoId,
  getProcessoFindByNomeKey,
  getSostanza,
  getSostanzaId,
  getUser,
  getUserId,
  getUsers,
  getUsersId,
  patchAgentiChimiciId,
  postFrasih,
  postFrasihId,
  postMiscelanonpericolosa,
  postMiscelanonpericolosaId,
  postProcesso,
  postProcessoId,
  postSostanza,
  postSostanzaId,
  postUser,
  postUserId,
  postUsers,
  postUsersId,
  postAgentiChimici,
  AgenteChimicoTipo,
  type AgenteChimico,
  type AgenteChimicoCreate,
  type PatchAgentiChimiciIdBody,
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
  | EntityConfig<AgenteChimico[], AgenteChimico, AgenteChimicoCreate, PatchAgentiChimiciIdBody>
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
      get: getFrasihId,
      create: postFrasih,
      update: postFrasihId,
      remove: deleteFrasihId,
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
      get: getSostanzaId,
      create: postSostanza,
      update: postSostanzaId,
      remove: deleteSostanzaId,
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
      get: getMiscelanonpericolosaId,
      create: postMiscelanonpericolosa,
      update: postMiscelanonpericolosaId,
      remove: deleteMiscelanonpericolosaId,
    },
    serverSearch: getMiscelanonpericolosaFindByNomeKey,
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
      get: getProcessoId,
      create: postProcesso,
      update: postProcessoId,
      remove: deleteProcessoId,
    },
    serverSearch: getProcessoFindByNomeKey,
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
        {
          name: "identificativo",
          label: "Identificativo",
          type: "string",
          required: true,
        },
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
        {
          name: "vlep",
          label: "VLEP",
          type: "boolean",
          required: true,
        },
        {
          name: "alta_emissione",
          label: "Alta emissione",
          type: "boolean",
          required: true,
        },
        {
          name: "frasiHIds",
          label: "Frasi H",
          type: "relation",
          multiple: true,
          required: false,
          loadOptions: frasiHOptions,
          parse: (value) => {
            if (Array.isArray(value) && value.length > 0) {
              return value;
            }
            return undefined;
          },
        },
        {
          name: "sostanzeComponentiIds",
          label: "Sostanze componenti",
          type: "relation",
          multiple: true,
          required: false,
          loadOptions: sostanzaOptions,
          parse: (value) => {
            if (Array.isArray(value) && value.length > 0) {
              return value;
            }
            return undefined;
          },
        },
      ],
    },
    api: {
      list: getAgentiChimici,
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
        { name: "mail", label: "Email", type: "string", required: false },
        { name: "name", label: "Nome", type: "string", required: false },
        { name: "surname", label: "Cognome", type: "string", required: false },
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
          hideOnEdit: true,
        },
        {
          name: "roles",
          label: "Ruoli",
          type: "string",
          required: false,
          multiline: true,
          placeholder: "ADMIN,USER",
          description: "Inserisci i ruoli separati da virgola.",
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
      list: getUsers,
      get: getUsersId,
      create: postUsers,
      update: postUsersId,
      remove: deleteUsersId,
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
      list: getUser,
      get: getUserId,
      create: postUser,
      update: postUserId,
      remove: deleteUserId,
    },
  },
];

export function getEntity(key: string) {
  return ENTITIES.find((entity) => entity.key === key);
}
