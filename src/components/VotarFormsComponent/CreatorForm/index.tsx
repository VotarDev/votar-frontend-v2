import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Cookies from "universal-cookie";
import {
  Check,
  Copy,
  ExternalLink,
  Inbox,
  Link2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useCurrentUserId } from "@/utils/hooks";
import { createVotarForms, toggleForm } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import InfoTip from "@/src/components/shared/form/InfoTip";

interface Item {
  id: number;
  option: string;
}

// The fields every Votar form asks voters for (the sub-group list is yours).
const PREVIEW_FIELDS = [
  { label: "ID", type: "text" },
  { label: "Name", type: "text" },
  { label: "Sub-group", type: "select" },
  { label: "Phone number", type: "tel" },
  { label: "Email address", type: "email" },
];

/** Build an election's voter registration form and share its link. */
const CreatorForm = ({ electionId }: { electionId: string }) => {
  const [subGroup, setSubGroup] = useState<Item[]>([]);
  const [newSubGroup, setNewSubGroup] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [formLink, setFormLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formActive, setFormActive] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const USER_ID = useCurrentUserId();

  const addItem = () => {
    const option = newSubGroup.trim();
    if (!option) return;
    setSubGroup((prev) => [...prev, { id: Date.now(), option }]);
    setNewSubGroup("");
  };

  const startEditing = (item: Item) => {
    setEditingItemId(item.id);
    setEditingValue(item.option);
  };

  const finishEditing = () => {
    const option = editingValue.trim();
    if (option) {
      setSubGroup((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItemId ? { ...item, option } : item,
        ),
      );
    }
    setEditingItemId(null);
  };

  const deleteItem = (itemId: number) => {
    setSubGroup((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const formHandler = async () => {
    setIsLoading(true);
    const token = new Cookies().get("user-token");
    if (token) setAuthToken(token);
    try {
      const formData = {
        election_id: electionId,
        subgroup: subGroup.map((item) => item.option),
      };
      const { data } = await createVotarForms(formData, USER_ID as string);
      if (data) {
        toast.success("Form created succesfully");
        setFormLink(data.data.votar_form_link);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Couldn't create the form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleForm = async () => {
    const newStatus = !formActive;
    setIsToggling(true);
    try {
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      await toggleForm({ electionId, status: newStatus });
      setFormActive(newStatus);
      toast.success(`Form is now ${newStatus ? "active" : "inactive"}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to update form status");
    } finally {
      setIsToggling(false);
    }
  };

  const copyLink = async () => {
    if (!formLink) return;
    try {
      await navigator.clipboard.writeText(formLink);
      toast.success("Link copied to clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy operation failed. Please try again.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      {/* What voters will see */}
      <Card className="p-5 smm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-foreground">Form preview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              What voters will fill in. Ask them to enter their details
              correctly.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            Preview
          </span>
        </div>
        <div className="mt-6 space-y-5">
          {PREVIEW_FIELDS.map((field) => (
            <div key={field.label} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                {field.label}
              </span>
              {field.type === "select" ? (
                <select
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground"
                >
                  <option>
                    {subGroup.length
                      ? `${subGroup.length} option${subGroup.length === 1 ? "" : "s"}: ${subGroup
                          .map((s) => s.option)
                          .join(", ")}`
                      : "No sub-groups yet"}
                  </option>
                </select>
              ) : (
                <Input disabled type={field.type} className="bg-muted/40" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {/* Sub-groups */}
        <Card className="p-5">
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-foreground">Sub-groups</h2>
            <InfoTip label="About sub-groups">
              The groups voters choose from on the form, such as departments,
              levels or units.
            </InfoTip>
          </div>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              addItem();
            }}
          >
            <Input
              value={newSubGroup}
              onChange={(e) => setNewSubGroup(e.target.value)}
              placeholder="e.g. Computer Science"
              aria-label="New sub-group"
            />
            <Button
              type="submit"
              variant="outline"
              disabled={!newSubGroup.trim()}
            >
              <Plus /> Add
            </Button>
          </form>

          {subGroup.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No sub-groups yet. Add the options voters can choose from.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
              {subGroup.map((item) => (
                <li key={item.id} className="flex items-center gap-2 px-3 py-2">
                  {editingItemId === item.id ? (
                    <form
                      className="flex flex-1 items-center gap-1"
                      onSubmit={(e) => {
                        e.preventDefault();
                        finishEditing();
                      }}
                    >
                      <Input
                        autoFocus
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        aria-label="Edit sub-group"
                        className="h-9"
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        aria-label="Save"
                        className="h-9 w-9"
                      >
                        <Check />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Cancel"
                        className="h-9 w-9"
                        onClick={() => setEditingItemId(null)}
                      >
                        <X />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {item.option}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${item.option}`}
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => startEditing(item)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${item.option}`}
                        className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-destructive"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Publish */}
        <Card className="space-y-5 p-5">
          <div>
            <h2 className="font-semibold text-foreground">Share the form</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create the form to get a link you can send to voters.
            </p>
          </div>

          <Button
            type="button"
            onClick={formHandler}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Link2 />}
            Create form
          </Button>

          {formLink ? (
            <div className="space-y-2">
              <div className="break-all rounded-md border border-border bg-muted/50 px-3 py-2.5 font-mono text-xs text-slate-700">
                {formLink}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyLink}
                  className="flex-1"
                >
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
                <Button asChild variant="ghost">
                  <a href={formLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink /> Open
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              The link appears here once the form is created.
            </p>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Accepting responses
              </p>
              <p className="text-xs text-muted-foreground">
                Form is {formActive ? "active" : "inactive"}
              </p>
            </div>
            <Switch
              checked={formActive}
              onCheckedChange={handleToggleForm}
              disabled={isToggling}
              aria-label="Accepting responses"
            />
          </div>
        </Card>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/votar-forms/responses/${electionId}`)}
        >
          <Inbox /> View responses
        </Button>
      </div>
    </div>
  );
};

export default CreatorForm;
