import { notFound } from "next/navigation";
import { EntityListPage } from "@/features/_crud/components/EntityListPage";
import { getEntity } from "@/features/_config/entities";

export default function EntityListRoute({
  params,
}: {
  params: { entity: string };
}) {
  const entity = getEntity(params.entity);
  if (!entity) {
    notFound();
  }
  return <EntityListPage entityKey={entity.key} />;
}
