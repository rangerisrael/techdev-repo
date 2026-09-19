import Link from "next/link";
import { StackLayerForm } from "@/components/admin/stack-layer-form";

import { createStackLayer } from "../actions";

export default function NewStackLayerPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/stack-layers"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Stack layers
        </Link>
        <h1 className="text-lg font-semibold text-foreground">New stack layer</h1>
        <p className="text-sm text-muted-foreground">
          Tags are comma-separated.
        </p>
      </div>

      <StackLayerForm action={createStackLayer} />
    </div>
  );
}
