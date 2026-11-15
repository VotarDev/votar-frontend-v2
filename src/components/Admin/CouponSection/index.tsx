import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Eye, FlaskConical, Plus, Ticket } from "lucide-react";
import FormField from "@/src/components/shared/form/FormField";
import EmptyState from "@/src/components/shared/EmptyState";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import ViewElections, { type Coupon } from "./ViewElections";

// Same options as before.
const DISCOUNTS = ["50% off", "1000", "0", "10% off", "20% off"];

const describeDiscount = (value: string) =>
  value.endsWith("% off")
    ? value
    : value === "0"
      ? "Free"
      : `₦${Number(value).toLocaleString()} off`;

// Sample coupons (there's no coupon API yet).
const SAMPLE_COUPONS: Coupon[] = [
  { id: 1, couponName: "Votar 50", couponCodeCriteria: "50% off", couponAccess: "All elections", active: true },
  { id: 2, couponName: "Votar 1k", couponCodeCriteria: "1000", couponAccess: "All elections", active: true },
  { id: 3, couponName: "Free", couponCodeCriteria: "0", couponAccess: "All elections", active: false },
];

/**
 * Coupon management. Not connected to the server yet: coupons, toggles and new
 * coupons only live on this page, so the design can be reviewed safely.
 */
const CouponSection = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(SAMPLE_COUPONS);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [viewing, setViewing] = useState<Coupon | null>(null);

  const createCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !discount) {
      toast.error("Enter a coupon name and choose a discount");
      return;
    }
    setCoupons((prev) => [
      ...prev,
      {
        id: Date.now(),
        couponName: name.trim(),
        couponCodeCriteria: discount,
        couponAccess: "All elections",
        active: true,
      },
    ]);
    setName("");
    setDiscount("");
    toast("Added for this preview only. Nothing was saved.", { icon: "🧪" });
  };

  const toggle = (id: number, active: boolean) =>
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">Preview.</span> Coupons aren&apos;t
          connected to the server yet. The coupons below are samples, and
          anything you add or switch here isn&apos;t saved.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 smm:p-6">
          <h2 className="font-semibold text-foreground">Create a coupon</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Give organisers a discount on their election.
          </p>
          <form onSubmit={createCoupon} className="mt-5 space-y-4" noValidate>
            <FormField label="Coupon name" htmlFor="coupon-name" required>
              <Input
                id="coupon-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VOTAR50"
              />
            </FormField>
            <FormField label="Discount" htmlFor="coupon-discount" required>
              <select
                id="coupon-discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
              >
                <option value="">Choose a discount</option>
                {DISCOUNTS.map((option) => (
                  <option key={option} value={option}>
                    {describeDiscount(option)}
                  </option>
                ))}
              </select>
            </FormField>
            <Button type="submit" className="h-11 w-full">
              <Plus /> Create coupon
            </Button>
          </form>
        </Card>

        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-foreground">Coupons</h2>
            <span className="text-sm text-muted-foreground">
              {coupons.filter((c) => c.active).length} of {coupons.length} active
            </span>
          </div>
          {coupons.length === 0 ? (
            <EmptyState icon={Ticket} title="No coupons yet" />
          ) : (
            <>
              <ul className="divide-y divide-border smm:hidden">
                {coupons.map((coupon) => (
                  <li key={coupon.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-mono font-semibold text-foreground">
                          {coupon.couponName}
                        </p>
                        <p className="text-xs text-muted-foreground">{coupon.couponAccess}</p>
                      </div>
                      <Badge variant="secondary">{describeDiscount(coupon.couponCodeCriteria)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Switch
                          checked={coupon.active}
                          onCheckedChange={(v) => toggle(coupon.id, v)}
                          aria-label={`${coupon.couponName} active`}
                        />
                        {coupon.active ? "Active" : "Off"}
                      </label>
                      <Button variant="ghost" size="sm" onClick={() => setViewing(coupon)}>
                        <Eye /> Elections
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="hidden smm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coupon</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Applies to</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Elections</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-semibold text-foreground">
                          {coupon.couponName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {describeDiscount(coupon.couponCodeCriteria)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{coupon.couponAccess}</TableCell>
                        <TableCell>
                          <Switch
                            checked={coupon.active}
                            onCheckedChange={(v) => toggle(coupon.id, v)}
                            aria-label={`${coupon.couponName} active`}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setViewing(coupon)}>
                            <Eye /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </Card>
      </div>

      <ViewElections coupon={viewing} onClose={() => setViewing(null)} />
    </div>
  );
};

export default CouponSection;
