import type { EntityConfig, FieldOption } from "@/features/_crud/types";
import {
  deleteAdminUsersId,
  deleteAdminFrasihId,
  deleteAdminCodificheStatoFisicoInalId,
  deleteAdminCodificheTipoUsoInalId,
  deleteAdminCodificheTipoControlloInalId,
  deleteAdminCodificheLivelliContattoCutaneoId,
  deleteAdminCodificheTipoControlloProcId,
  deleteAziendeId,
  deleteAreeId,
  deleteLavoratoriId,
  deleteValutazioniId,
  deleteAgentiChimiciId,
  getAdminUsers,
  getAdminUsersId,
  patchAdminUsersId,
  postAdminUsers,
  getFrasih,
  getFrasihId,
  postAdminFrasih,
  patchAdminFrasihId,
  getCodificheStatoFisicoInal,
  getCodificheStatoFisicoInalId,
  getCodificheTipoUsoInal,
  getCodificheTipoUsoInalId,
  getCodificheTipoControlloInal,
  getCodificheTipoControlloInalId,
  getCodificheLivelliContattoCutaneo,
  getCodificheLivelliContattoCutaneoId,
  getCodificheTipoControlloProc,
  getCodificheTipoControlloProcId,
  getAdminCodificheStatoFisicoInal,
  getAdminCodificheStatoFisicoInalId,
  postAdminCodificheStatoFisicoInal,
  patchAdminCodificheStatoFisicoInalId,
  getAdminCodificheTipoUsoInal,
  getAdminCodificheTipoUsoInalId,
  postAdminCodificheTipoUsoInal,
  patchAdminCodificheTipoUsoInalId,
  getAdminCodificheTipoControlloInal,
  getAdminCodificheTipoControlloInalId,
  postAdminCodificheTipoControlloInal,
  patchAdminCodificheTipoControlloInalId,
  getAdminCodificheLivelliContattoCutaneo,
  getAdminCodificheLivelliContattoCutaneoId,
  postAdminCodificheLivelliContattoCutaneo,
  patchAdminCodificheLivelliContattoCutaneoId,
  getAdminCodificheTipoControlloProc,
  getAdminCodificheTipoControlloProcId,
  postAdminCodificheTipoControlloProc,
  patchAdminCodificheTipoControlloProcId,
  getAziende,
  getAziendeId,
  postAziende,
  patchAziendeId,
  getAziendeAziendaIdAree,
  postAziendeAziendaIdAree,
  getAreeId,
  patchAreeId,
  getAreeAreaIdLavoratori,
  postAreeAreaIdLavoratori,
  getLavoratoriId,
  patchLavoratoriId,
  getLavoratoriLavoratoreIdValutazioni,
  postLavoratoriLavoratoreIdValutazioni,
  getValutazioniId,
  patchValutazioniId,
  getAgentiChimici,
  getAgentiChimiciId,
  postAgentiChimici,
  patchAgentiChimiciId,
  AgenteChimicoTipo,
  type FrasiH,
  type FrasiHCreate,
  type FrasiHUpdate,
  type Codifica,
  type CodificaCreate,
  type CodificaUpdate,
  type User,
  type UserAdminCreate,
  type UserAdminUpdate,
  type Azienda,
  type AziendaCreate,
  type AziendaUpdate,
  type Area,
  type AreaCreate,
  type AreaUpdate,
  type Lavoratore,
  type LavoratoreCreate,
  type LavoratoreUpdate,
  type AgenteChimico,
  type AgenteChimicoCreate,
  type PatchAgentiChimiciIdBody,
  type Valutazione,
  type ValutazioneCreate,
  type ValutazioneUpdate,
} from "@/generated/api";
import { getRoles } from "@/lib/auth";

const isAdmin = () => getRoles().some((role) => role.toLowerCase() === "admin");

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
    label: `${item.codice} - ${item.descrizione}`,
    value: item.id,
  }));
};

const codificaOptions = async (loader: () => Promise<Codifica[]>): Promise<FieldOption[]> => {
  const list = await loader();
  return list.map((item) => ({
    label: `${item.codice} - ${item.descrizione}`,
    value: item.id,
  }));
};

const agentiChimiciOptions = async (): Promise<FieldOption[]> => {
  const list = await getAgentiChimici();
  return list.map((item) => ({
    label: `${item.nome} (${item.identificativo})`,
    value: item.id,
  }));
};

const sostanzeComponentiOptions = async (): Promise<FieldOption[]> => {
  const list = await getAgentiChimici();
  return list
    .filter((item) => item.tipo === "sostanza")
    .map((item) => ({
      label: `${item.nome} (${item.identificativo})`,
      value: item.id,
    }));
};

export const ENTITIES: Array<
  | EntityConfig<FrasiH[], FrasiH, FrasiHCreate, FrasiHUpdate>
  | EntityConfig<Codifica[], Codifica, CodificaCreate, CodificaUpdate>
  | EntityConfig<User[], User, UserAdminCreate, UserAdminUpdate>
  | EntityConfig<Azienda[], Azienda, AziendaCreate, AziendaUpdate>
  | EntityConfig<Area[], Area, AreaCreate, AreaUpdate>
  | EntityConfig<Lavoratore[], Lavoratore, LavoratoreCreate, LavoratoreUpdate>
  | EntityConfig<AgenteChimico[], AgenteChimico, AgenteChimicoCreate, PatchAgentiChimiciIdBody>
  | EntityConfig<Valutazione[], Valutazione, ValutazioneCreate, ValutazioneUpdate>
> = [
  {
    key: "aziende",
    label: "Aziende",
    routes: { base: "/app/aziende" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "nome", label: "Nome" },
        { key: "note", label: "Note" },
      ],
    },
    form: {
      fields: [
        { name: "nome", label: "Nome", type: "string", required: true },
        { name: "note", label: "Note", type: "string", required: false, multiline: true },
      ],
    },
    api: {
      list: () => getAziende(),
      get: getAziendeId,
      create: postAziende,
      update: patchAziendeId,
      remove: async (id: number) => {
        await deleteAziendeId(id);
        return true;
      },
    },
    children: [
      { label: "Aree", routeBase: "/app/aree", param: "aziendaId" },
    ],
  },
  {
    key: "aree",
    label: "Aree",
    routes: { base: "/app/aree" },
    idField: "id",
    parent: { param: "aziendaId", label: "Aziende", routeBase: "/app/aziende" },
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "aziendaId", label: "Azienda ID" },
        { key: "nome", label: "Nome" },
        { key: "note", label: "Note" },
      ],
    },
    form: {
      fields: [
        { name: "nome", label: "Nome", type: "string", required: true },
        { name: "note", label: "Note", type: "string", required: false, multiline: true },
      ],
    },
    api: {
      list: (context) => {
        if (!context?.parentId) {
          return Promise.resolve([] as Area[]);
        }
        return getAziendeAziendaIdAree(context.parentId);
      },
      get: getAreeId,
      create: (payload, context) => {
        if (!context?.parentId) {
          throw new Error("aziendaId obbligatorio");
        }
        return postAziendeAziendaIdAree(context.parentId, payload);
      },
      update: patchAreeId,
      remove: async (id: number) => {
        await deleteAreeId(id);
        return true;
      },
    },
    children: [
      { label: "Lavoratori", routeBase: "/app/lavoratori", param: "areaId" },
    ],
  },
  {
    key: "lavoratori",
    label: "Lavoratori",
    routes: { base: "/app/lavoratori" },
    idField: "id",
    parent: { param: "areaId", label: "Aree", routeBase: "/app/aree" },
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "areaId", label: "Area ID" },
        { key: "codice", label: "Codice" },
        { key: "mansione", label: "Mansione" },
      ],
    },
    form: {
      fields: [
        { name: "codice", label: "Codice", type: "string", required: true },
        { name: "mansione", label: "Mansione", type: "string", required: false },
        { name: "note", label: "Note", type: "string", required: false, multiline: true },
      ],
    },
    api: {
      list: (context) => {
        if (!context?.parentId) {
          return Promise.resolve([] as Lavoratore[]);
        }
        return getAreeAreaIdLavoratori(context.parentId);
      },
      get: getLavoratoriId,
      create: (payload, context) => {
        if (!context?.parentId) {
          throw new Error("areaId obbligatorio");
        }
        return postAreeAreaIdLavoratori(context.parentId, payload);
      },
      update: patchLavoratoriId,
      remove: async (id: number) => {
        await deleteLavoratoriId(id);
        return true;
      },
    },
    children: [
      { label: "Valutazioni", routeBase: "/app/valutazioni", param: "lavoratoreId" },
    ],
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
          loadOptions: sostanzeComponentiOptions,
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
    key: "valutazioni",
    label: "Valutazioni",
    routes: { base: "/app/valutazioni" },
    idField: "id",
    parent: { param: "lavoratoreId", label: "Lavoratori", routeBase: "/app/lavoratori" },
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "lavoratoreId", label: "Lavoratore ID" },
        { key: "agenteChimicoId", label: "Agente ID" },
        { key: "nome", label: "Nome" },
        { key: "data", label: "Data" },
      ],
    },
    form: {
      fields: [
        {
          name: "agenteChimicoId",
          label: "Agente chimico",
          type: "relation",
          required: true,
          loadOptions: agentiChimiciOptions,
          parse: parseNumber,
        },
        { name: "nome", label: "Nome", type: "string", required: true },
        {
          name: "data",
          label: "Data",
          type: "date",
          required: true,
          parse: (value) => {
            const stringValue = String(value ?? "");
            return stringValue ? new Date(stringValue).toISOString() : undefined;
          },
        },
        { name: "einal", label: "Einal", type: "number", required: false, parse: parseNumber },
        {
          name: "statoFisicoInal",
          label: "Stato fisico inalazione",
          type: "relation",
          required: false,
          loadOptions: () => codificaOptions(getCodificheStatoFisicoInal),
          parse: parseNumber,
        },
        {
          name: "quantitaKg",
          label: "Quantita (kg)",
          type: "number",
          required: false,
          parse: parseNumber,
          description: "Unita: kg",
        },
        {
          name: "tipoUsoInal",
          label: "Tipo uso inalazione",
          type: "relation",
          required: false,
          loadOptions: () => codificaOptions(getCodificheTipoUsoInal),
          parse: parseNumber,
        },
        {
          name: "tipoControlloInal",
          label: "Tipo controllo inalazione",
          type: "relation",
          required: false,
          loadOptions: () => codificaOptions(getCodificheTipoControlloInal),
          parse: parseNumber,
        },
        {
          name: "tempoInalMin",
          label: "Tempo inalazione (min)",
          type: "number",
          required: false,
          parse: parseNumber,
          description: "Unita: minuti",
        },
        {
          name: "distanzaM",
          label: "Distanza (m)",
          type: "number",
          required: false,
          parse: parseNumber,
          description: "Unita: metri",
        },
        { name: "ecute", label: "Ecute", type: "number", required: false, parse: parseNumber },
        {
          name: "esposizioneCutanea",
          label: "Esposizione cutanea",
          type: "boolean",
          required: false,
        },
        {
          name: "livelliContattoCutaneo",
          label: "Livelli contatto cutaneo",
          type: "relation",
          required: false,
          loadOptions: () => codificaOptions(getCodificheLivelliContattoCutaneo),
          parse: parseNumber,
        },
        {
          name: "tipoControlloProc",
          label: "Tipo controllo processo",
          type: "relation",
          required: false,
          loadOptions: () => codificaOptions(getCodificheTipoControlloProc),
          parse: parseNumber,
        },
        {
          name: "quantitaProcKg",
          label: "Quantita processo (kg)",
          type: "number",
          required: false,
          parse: parseNumber,
          description: "Unita: kg",
        },
        {
          name: "tempoProcMin",
          label: "Tempo processo (min)",
          type: "number",
          required: false,
          parse: parseNumber,
          description: "Unita: minuti",
        },
      ],
    },
    api: {
      list: (context) => {
        if (!context?.parentId) {
          return Promise.resolve([] as Valutazione[]);
        }
        return getLavoratoriLavoratoreIdValutazioni(context.parentId);
      },
      get: getValutazioniId,
      create: (payload, context) => {
        if (!context?.parentId) {
          throw new Error("lavoratoreId obbligatorio");
        }
        return postLavoratoriLavoratoreIdValutazioni(context.parentId, payload);
      },
      update: patchValutazioniId,
      remove: async (id: number) => {
        await deleteValutazioniId(id);
        return true;
      },
    },
  },
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
        { key: "codice", label: "Codice" },
        { key: "descrizione", label: "Descrizione" },
        { key: "punteggio", label: "Punteggio" },
      ],
    },
    form: {
      fields: [
        { name: "codice", label: "Codice", type: "string", required: true, hideOnEdit: true },
        {
          name: "descrizione",
          label: "Descrizione",
          type: "string",
          required: true,
          multiline: true,
        },
        { name: "punteggio", label: "Punteggio", type: "number", required: true, parse: parseNumber },
      ],
    },
    api: {
      list: () => getFrasih(),
      get: getFrasihId,
      create: postAdminFrasih,
      update: patchAdminFrasihId,
      remove: async (id: number) => {
        await deleteAdminFrasihId(id);
        return true;
      },
    },
    readOnly: (roles) => !roles.some((role) => role.toLowerCase() === "admin"),
  },
  {
    key: "admin-users",
    label: "Utenti",
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
    key: "codifiche-stato-fisico-inal",
    label: "Codifiche - Stato fisico inal",
    routes: { base: "/app/codifiche-stato-fisico-inal" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "codice", label: "Codice" },
        { key: "descrizione", label: "Descrizione" },
        { key: "ordine", label: "Ordine" },
        { key: "isActive", label: "Attivo" },
      ],
    },
    form: {
      fields: [
        { name: "codice", label: "Codice", type: "string", required: true },
        { name: "descrizione", label: "Descrizione", type: "string", required: true, multiline: true },
        { name: "ordine", label: "Ordine", type: "number", required: false, parse: parseNumber },
        { name: "isActive", label: "Attivo", type: "boolean", required: false },
      ],
    },
    api: {
      list: () => (isAdmin() ? getAdminCodificheStatoFisicoInal() : getCodificheStatoFisicoInal()),
      get: (id) =>
        isAdmin() ? getAdminCodificheStatoFisicoInalId(id) : getCodificheStatoFisicoInalId(id),
      create: (payload) => postAdminCodificheStatoFisicoInal(payload),
      update: (id, payload) => patchAdminCodificheStatoFisicoInalId(id, payload),
      remove: async (id: number) => {
        await deleteAdminCodificheStatoFisicoInalId(id);
        return true;
      },
    },
    readOnly: (roles) => !roles.some((role) => role.toLowerCase() === "admin"),
  },
  {
    key: "codifiche-tipo-uso-inal",
    label: "Codifiche - Tipo uso inal",
    routes: { base: "/app/codifiche-tipo-uso-inal" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "codice", label: "Codice" },
        { key: "descrizione", label: "Descrizione" },
        { key: "ordine", label: "Ordine" },
        { key: "isActive", label: "Attivo" },
      ],
    },
    form: {
      fields: [
        { name: "codice", label: "Codice", type: "string", required: true },
        { name: "descrizione", label: "Descrizione", type: "string", required: true, multiline: true },
        { name: "ordine", label: "Ordine", type: "number", required: false, parse: parseNumber },
        { name: "isActive", label: "Attivo", type: "boolean", required: false },
      ],
    },
    api: {
      list: () => (isAdmin() ? getAdminCodificheTipoUsoInal() : getCodificheTipoUsoInal()),
      get: (id) => (isAdmin() ? getAdminCodificheTipoUsoInalId(id) : getCodificheTipoUsoInalId(id)),
      create: (payload) => postAdminCodificheTipoUsoInal(payload),
      update: (id, payload) => patchAdminCodificheTipoUsoInalId(id, payload),
      remove: async (id: number) => {
        await deleteAdminCodificheTipoUsoInalId(id);
        return true;
      },
    },
    readOnly: (roles) => !roles.some((role) => role.toLowerCase() === "admin"),
  },
  {
    key: "codifiche-tipo-controllo-inal",
    label: "Codifiche - Tipo controllo inal",
    routes: { base: "/app/codifiche-tipo-controllo-inal" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "codice", label: "Codice" },
        { key: "descrizione", label: "Descrizione" },
        { key: "ordine", label: "Ordine" },
        { key: "isActive", label: "Attivo" },
      ],
    },
    form: {
      fields: [
        { name: "codice", label: "Codice", type: "string", required: true },
        { name: "descrizione", label: "Descrizione", type: "string", required: true, multiline: true },
        { name: "ordine", label: "Ordine", type: "number", required: false, parse: parseNumber },
        { name: "isActive", label: "Attivo", type: "boolean", required: false },
      ],
    },
    api: {
      list: () => (isAdmin() ? getAdminCodificheTipoControlloInal() : getCodificheTipoControlloInal()),
      get: (id) =>
        isAdmin() ? getAdminCodificheTipoControlloInalId(id) : getCodificheTipoControlloInalId(id),
      create: (payload) => postAdminCodificheTipoControlloInal(payload),
      update: (id, payload) => patchAdminCodificheTipoControlloInalId(id, payload),
      remove: async (id: number) => {
        await deleteAdminCodificheTipoControlloInalId(id);
        return true;
      },
    },
    readOnly: (roles) => !roles.some((role) => role.toLowerCase() === "admin"),
  },
  {
    key: "codifiche-livelli-contatto-cutaneo",
    label: "Codifiche - Livelli contatto cutaneo",
    routes: { base: "/app/codifiche-livelli-contatto-cutaneo" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "codice", label: "Codice" },
        { key: "descrizione", label: "Descrizione" },
        { key: "ordine", label: "Ordine" },
        { key: "isActive", label: "Attivo" },
      ],
    },
    form: {
      fields: [
        { name: "codice", label: "Codice", type: "string", required: true },
        { name: "descrizione", label: "Descrizione", type: "string", required: true, multiline: true },
        { name: "ordine", label: "Ordine", type: "number", required: false, parse: parseNumber },
        { name: "isActive", label: "Attivo", type: "boolean", required: false },
      ],
    },
    api: {
      list: () =>
        isAdmin() ? getAdminCodificheLivelliContattoCutaneo() : getCodificheLivelliContattoCutaneo(),
      get: (id) =>
        isAdmin()
          ? getAdminCodificheLivelliContattoCutaneoId(id)
          : getCodificheLivelliContattoCutaneoId(id),
      create: (payload) => postAdminCodificheLivelliContattoCutaneo(payload),
      update: (id, payload) => patchAdminCodificheLivelliContattoCutaneoId(id, payload),
      remove: async (id: number) => {
        await deleteAdminCodificheLivelliContattoCutaneoId(id);
        return true;
      },
    },
    readOnly: (roles) => !roles.some((role) => role.toLowerCase() === "admin"),
  },
  {
    key: "codifiche-tipo-controllo-proc",
    label: "Codifiche - Tipo controllo proc",
    routes: { base: "/app/codifiche-tipo-controllo-proc" },
    idField: "id",
    list: {
      enableSearch: true,
      searchMode: "client",
      columns: [
        { key: "id", label: "ID" },
        { key: "codice", label: "Codice" },
        { key: "descrizione", label: "Descrizione" },
        { key: "ordine", label: "Ordine" },
        { key: "isActive", label: "Attivo" },
      ],
    },
    form: {
      fields: [
        { name: "codice", label: "Codice", type: "string", required: true },
        { name: "descrizione", label: "Descrizione", type: "string", required: true, multiline: true },
        { name: "ordine", label: "Ordine", type: "number", required: false, parse: parseNumber },
        { name: "isActive", label: "Attivo", type: "boolean", required: false },
      ],
    },
    api: {
      list: () => (isAdmin() ? getAdminCodificheTipoControlloProc() : getCodificheTipoControlloProc()),
      get: (id) =>
        isAdmin() ? getAdminCodificheTipoControlloProcId(id) : getCodificheTipoControlloProcId(id),
      create: (payload) => postAdminCodificheTipoControlloProc(payload),
      update: (id, payload) => patchAdminCodificheTipoControlloProcId(id, payload),
      remove: async (id: number) => {
        await deleteAdminCodificheTipoControlloProcId(id);
        return true;
      },
    },
    readOnly: (roles) => !roles.some((role) => role.toLowerCase() === "admin"),
  },
];

export function getEntity(key: string) {
  return ENTITIES.find((entity) => entity.key === key);
}
