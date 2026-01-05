import { notFound } from "next/navigation";
import { EntityFormPage } from "@/features/_crud/components/EntityFormPage";
import { getEntity } from "@/features/_config/entities";

export default function EntityCreateRoute({
  params,
}: {
  params: { entity: string };
}) {
  const entity = getEntity(params.entity);
  if (!entity) {
    notFound();
  }
  return <EntityFormPage entityKey={entity.key} mode="create" />;
}
