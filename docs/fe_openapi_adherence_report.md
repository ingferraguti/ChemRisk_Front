# Frontend OpenAPI Adherence Report

Contract source used: `openapi_TOBE.yaml` (copied from `../movarisch/api/openapi_TOBE.yaml`).

Reason: the TO-BE contract contains the entities and endpoints listed in the scope (Aziende/Aree/Lavoratori/Valutazioni/Codifiche/Calcoli), while `../movarisch/api/openapi.yaml` does not.

## OpenAPI operations -> FE implementation map

| Method | Path | FE file(s) |
| --- | --- | --- |
| POST | /auth/login | `app/login/page.tsx` |
| GET | /auth/me | `app/app/profile/page.tsx` |
| PATCH | /users/me | `app/app/profile/page.tsx` |
| POST | /users/me/change-password | `app/app/profile/page.tsx` |
| GET | /admin/users | `src/features/_config/entities.ts` |
| POST | /admin/users | `src/features/_config/entities.ts` |
| GET | /admin/users/{id} | `src/features/_config/entities.ts` |
| PATCH | /admin/users/{id} | `src/features/_config/entities.ts` |
| DELETE | /admin/users/{id} | `src/features/_config/entities.ts` |
| GET | /frasih | `src/features/_config/entities.ts` |
| GET | /frasih/{id} | `src/features/_config/entities.ts` |
| POST | /admin/frasih | `src/features/_config/entities.ts` |
| PATCH | /admin/frasih/{id} | `src/features/_config/entities.ts` |
| DELETE | /admin/frasih/{id} | `src/features/_config/entities.ts` |
| GET | /codifiche/stato-fisico-inal | `src/features/_config/entities.ts` |
| GET | /codifiche/stato-fisico-inal/{id} | `src/features/_config/entities.ts` |
| GET | /codifiche/tipo-uso-inal | `src/features/_config/entities.ts` |
| GET | /codifiche/tipo-uso-inal/{id} | `src/features/_config/entities.ts` |
| GET | /codifiche/tipo-controllo-inal | `src/features/_config/entities.ts` |
| GET | /codifiche/tipo-controllo-inal/{id} | `src/features/_config/entities.ts` |
| GET | /codifiche/livelli-contatto-cutaneo | `src/features/_config/entities.ts` |
| GET | /codifiche/livelli-contatto-cutaneo/{id} | `src/features/_config/entities.ts` |
| GET | /codifiche/tipo-controllo-proc | `src/features/_config/entities.ts` |
| GET | /codifiche/tipo-controllo-proc/{id} | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/stato-fisico-inal | `src/features/_config/entities.ts` |
| POST | /admin/codifiche/stato-fisico-inal | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/stato-fisico-inal/{id} | `src/features/_config/entities.ts` |
| PATCH | /admin/codifiche/stato-fisico-inal/{id} | `src/features/_config/entities.ts` |
| DELETE | /admin/codifiche/stato-fisico-inal/{id} | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/tipo-uso-inal | `src/features/_config/entities.ts` |
| POST | /admin/codifiche/tipo-uso-inal | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/tipo-uso-inal/{id} | `src/features/_config/entities.ts` |
| PATCH | /admin/codifiche/tipo-uso-inal/{id} | `src/features/_config/entities.ts` |
| DELETE | /admin/codifiche/tipo-uso-inal/{id} | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/tipo-controllo-inal | `src/features/_config/entities.ts` |
| POST | /admin/codifiche/tipo-controllo-inal | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/tipo-controllo-inal/{id} | `src/features/_config/entities.ts` |
| PATCH | /admin/codifiche/tipo-controllo-inal/{id} | `src/features/_config/entities.ts` |
| DELETE | /admin/codifiche/tipo-controllo-inal/{id} | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/livelli-contatto-cutaneo | `src/features/_config/entities.ts` |
| POST | /admin/codifiche/livelli-contatto-cutaneo | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/livelli-contatto-cutaneo/{id} | `src/features/_config/entities.ts` |
| PATCH | /admin/codifiche/livelli-contatto-cutaneo/{id} | `src/features/_config/entities.ts` |
| DELETE | /admin/codifiche/livelli-contatto-cutaneo/{id} | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/tipo-controllo-proc | `src/features/_config/entities.ts` |
| POST | /admin/codifiche/tipo-controllo-proc | `src/features/_config/entities.ts` |
| GET | /admin/codifiche/tipo-controllo-proc/{id} | `src/features/_config/entities.ts` |
| PATCH | /admin/codifiche/tipo-controllo-proc/{id} | `src/features/_config/entities.ts` |
| DELETE | /admin/codifiche/tipo-controllo-proc/{id} | `src/features/_config/entities.ts` |
| GET | /aziende | `src/features/_config/entities.ts` |
| POST | /aziende | `src/features/_config/entities.ts` |
| GET | /aziende/{id} | `src/features/_config/entities.ts` |
| PATCH | /aziende/{id} | `src/features/_config/entities.ts` |
| DELETE | /aziende/{id} | `src/features/_config/entities.ts` |
| GET | /aziende/{aziendaId}/aree | `src/features/_config/entities.ts` |
| POST | /aziende/{aziendaId}/aree | `src/features/_config/entities.ts` |
| GET | /aree/{id} | `src/features/_config/entities.ts` |
| PATCH | /aree/{id} | `src/features/_config/entities.ts` |
| DELETE | /aree/{id} | `src/features/_config/entities.ts` |
| GET | /aree/{areaId}/lavoratori | `src/features/_config/entities.ts` |
| POST | /aree/{areaId}/lavoratori | `src/features/_config/entities.ts` |
| GET | /lavoratori/{id} | `src/features/_config/entities.ts` |
| PATCH | /lavoratori/{id} | `src/features/_config/entities.ts` |
| DELETE | /lavoratori/{id} | `src/features/_config/entities.ts` |
| GET | /lavoratori/{lavoratoreId}/valutazioni | `src/features/_config/entities.ts` |
| POST | /lavoratori/{lavoratoreId}/valutazioni | `src/features/_config/entities.ts` |
| GET | /valutazioni/{id} | `src/features/_config/entities.ts` |
| PATCH | /valutazioni/{id} | `src/features/_config/entities.ts` |
| DELETE | /valutazioni/{id} | `src/features/_config/entities.ts` |
| GET | /agenti-chimici | `src/features/_config/entities.ts` |
| POST | /agenti-chimici | `src/features/_config/entities.ts` |
| GET | /agenti-chimici/{id} | `src/features/_config/entities.ts` |
| PATCH | /agenti-chimici/{id} | `src/features/_config/entities.ts` |
| DELETE | /agenti-chimici/{id} | `src/features/_config/entities.ts` |
| POST | /calcoli/valutazioni | `src/features/_crud/components/EntityDetailPage.tsx` |
| POST | /calcoli/valutazioni/{id} | `src/features/_crud/components/EntityDetailPage.tsx` |

## FE API calls not mapped to OpenAPI

None detected after refactor (all calls use generated OpenAPI clients).

## Schema mismatches found

- AgenteChimico create does not enforce `sostanzeComponentiIds` when `tipo` is `miscelaP`, `miscelaNP`, or `processo` (schema requires it for those variants).
- Valutazione `data` uses a date-only input and is converted to ISO midnight; time selection is not exposed in the UI.

## RBAC gaps

- Admin route guards are implemented client-side only (roles are stored in localStorage), so server-side blocking is not possible without adding cookie-based auth.

## Notes

- Error handling: 401 redirects to `/login`, 403 shows "Non autorizzato", 404 shows "Risorsa non trovata".
- Codifiche and FrasiH use admin endpoints for write and public endpoints for read; UI hides write actions for non-admin users.
