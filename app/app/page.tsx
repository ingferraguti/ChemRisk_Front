import { redirect } from "next/navigation";
import { ENTITIES } from "@/features/_config/entities";

export default function AppIndexPage() {
  const first = ENTITIES.find((entity) => !entity.hideInSidebar);
  redirect(first?.routes.base ?? "/login");
}
