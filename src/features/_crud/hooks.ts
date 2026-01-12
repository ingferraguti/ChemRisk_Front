import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEntity } from "@/features/_config/entities";
import type { EntityConfig } from "./types";
import { normalizeListResponse } from "./data/normalizeListResponse";
import type { NormalizedListResponse } from "./data/normalizeListResponse";

export function useEntityList<TList, TItem, TCreate, TUpdate>(
  entityKey: string,
  params?: { search?: string }
) {
  const entity = getEntity(entityKey) as EntityConfig<TList, TItem, TCreate, TUpdate>;
  if (!entity) {
    throw new Error(`Entity ${entityKey} not found`);
  }

  const query = useQuery<TList, Error, NormalizedListResponse<TItem>>({
    queryKey: [entityKey, "list", params],
    queryFn: async () => {
      if (params?.search && entity.serverSearch && entity.list.searchMode === "server") {
        return entity.serverSearch(params.search);
      }
      return entity.api.list();
    },
    select: (raw) =>
      normalizeListResponse(entityKey, raw, {
        debug: true,
        acceptSingleObjectAsItem: false,
      }),
  });

  return query;
}

export function useEntity<TList, TItem, TCreate, TUpdate>(entityKey: string, id: number) {
  const entity = getEntity(entityKey) as EntityConfig<TList, TItem, TCreate, TUpdate>;
  if (!entity) {
    throw new Error(`Entity ${entityKey} not found`);
  }

  return useQuery({
    queryKey: [entityKey, "detail", id],
    queryFn: () => entity.api.get(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateEntity<TList, TItem, TCreate, TUpdate>(entityKey: string) {
  const queryClient = useQueryClient();
  const entity = getEntity(entityKey) as EntityConfig<TList, TItem, TCreate, TUpdate>;
  if (!entity) {
    throw new Error(`Entity ${entityKey} not found`);
  }

  return useMutation({
    mutationFn: (payload: TCreate) => entity.api.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey, "list"] });
    },
  });
}

export function useUpdateEntity<TList, TItem, TCreate, TUpdate>(entityKey: string, id: number) {
  const queryClient = useQueryClient();
  const entity = getEntity(entityKey) as EntityConfig<TList, TItem, TCreate, TUpdate>;
  if (!entity) {
    throw new Error(`Entity ${entityKey} not found`);
  }

  return useMutation({
    mutationFn: (payload: TUpdate) => entity.api.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey, "detail", id] });
      queryClient.invalidateQueries({ queryKey: [entityKey, "list"] });
    },
  });
}

export function useDeleteEntity<TList, TItem, TCreate, TUpdate>(entityKey: string) {
  const queryClient = useQueryClient();
  const entity = getEntity(entityKey) as EntityConfig<TList, TItem, TCreate, TUpdate>;
  if (!entity) {
    throw new Error(`Entity ${entityKey} not found`);
  }

  return useMutation({
    mutationFn: (id: number) => entity.api.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey, "list"] });
    },
  });
}
