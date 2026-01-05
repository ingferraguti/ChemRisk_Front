import { notFound } from "next/navigation";
import { EntityFormPage } from "@/features/_crud/components/EntityFormPage";
import { getEntity } from "@/features/_config/entities";

export default function EntityEditRoute({
  params,
}: {
  params: { entity: string; id: string };
}) {
  const entity = getEntity(params.entity);
  if (!entity) {
    notFound();
  }
  return <EntityFormPage entityKey={entity.key} mode="edit" id={Number(params.id)} />;
}
