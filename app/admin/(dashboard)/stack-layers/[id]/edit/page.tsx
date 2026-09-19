import Link from "next/link";
import { notFound } from "next/navigation";
import { StackLayerForm } from "@/components/admin/stack-layer-form";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteStackLayer, updateStackLayer } from "../../actions";

export default async function EditStackLayerPage(
  props: PageProps<"/admin/stack-layers/[id]/edit">
) {
  const { id } = await props.params;
  const layer = await getPortfolioAdminRepository().getStackLayer(Number(id));
  if (!layer) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/stack-layers"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Stack layers
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Edit stack layer</h1>
        <p className="text-sm text-muted-foreground">{layer.title}</p>
      </div>

      <StackLayerForm layer={layer} action={updateStackLayer} deleteAction={deleteStackLayer} />
    </div>
  );
}
