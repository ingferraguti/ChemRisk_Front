import { notFound } from "next/navigation";
import { EntityDetailPage } from "@/features/_crud/components/EntityDetailPage";
import { getEntity } from "@/features/_config/entities";

export default function EntityDetailRoute({
  params,
}: {
  params: { entity: string; id: string };
}) {
  const entity = getEntity(params.entity);
  if (!entity) {
    notFound();
  }
  return <EntityDetailPage entityKey={entity.key} id={Number(params.id)} />;
}
