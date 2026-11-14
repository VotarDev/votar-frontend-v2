import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import AdminLayout from "@/src/components/Admin/AdminLayout";
import PageHeader from "@/src/components/shared/PageHeader";
import EmptyState from "@/src/components/shared/EmptyState";
import { Card } from "@/src/components/ui/card";

/** Purchased votes per election: not connected to live data yet. */
const PurchasedVotes = () => (
  <AdminLayout>
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-3">
        <Link
          href="/admin/free-pro-meeting"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Free Votar & credits
        </Link>
        <PageHeader title="Purchased votes" />
      </div>
      <Card>
        <EmptyState
          icon={ShoppingCart}
          title="Purchase details are coming soon"
          description="This view isn't connected to live data yet."
        />
      </Card>
    </div>
  </AdminLayout>
);

export default PurchasedVotes;
