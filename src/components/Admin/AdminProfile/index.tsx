import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { Loader2, Lock, Plus, ShieldCheck, Users } from "lucide-react";
import PageHeader from "@/src/components/shared/PageHeader";
import EmptyState from "@/src/components/shared/EmptyState";
import DialogShell from "@/src/components/shared/DialogShell";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Switch } from "@/src/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import setAuthToken from "@/utils/setAuthToken";
import {
  createManagedAdmin,
  deleteManagedAdmin,
  getAdminProfile,
  getManagedAdmins,
  updateManagedAdmin,
  updateManagedAdminAccess,
} from "@/utils/api";
import AddAdmin from "./AddAdmin";
import EditAdminForm from "./EditAdminForm";
import DeleteDialog from "./DeleteDialog";

interface AdminRecord {
  _id: string;
  username: string;
  hasAccess: boolean;
  sudo: boolean;
}

interface AdminProfileData {
  _id: string;
  username: string;
  hasAccess: boolean;
  sudo: boolean;
}

const AdminProfile = () => {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const closeModal = () => setShowModal(false);
  const [accessPending, setAccessPending] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadAdmins = async () => {
      const token = new Cookies().get("admin-token");
      if (!token) {
        if (mounted) {
          setLoadError("Your admin session has expired. Please sign in again.");
          setIsAuthorized(false);
          setIsLoading(false);
        }
        return;
      }
      setAuthToken(token);
      try {
        const profileResponse = await getAdminProfile();
        const currentAdmin = profileResponse.data?.data as AdminProfileData;
        if (!currentAdmin?._id) throw new Error("The admin profile was not returned.");
        if (!mounted) return;
        setProfile(currentAdmin);
        if (!currentAdmin.sudo) {
          setIsAuthorized(false);
          return;
        }
        const adminsResponse = await getManagedAdmins(currentAdmin._id);
        if (!mounted) return;
        setAdmins(adminsResponse.data?.data || []);
        setIsAuthorized(true);
      } catch (error: any) {
        if (!mounted) return;
        if (error.response?.status === 401 || error.response?.status === 403) {
          setIsAuthorized(false);
        } else {
          setLoadError("Could not load admin accounts. Please try again.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadAdmins();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateAdmin = async (values: { username: string; password: string }) => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const response = await createManagedAdmin(profile._id, {
        ...values,
        hasAccess: false,
      });
      setAdmins((current) => [...current, response.data.data]);
      toast.success("Admin account created. Enable access when it is ready to sign in.");
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not create the admin account.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateAdmin = async (
    adminId: string,
    values: { username: string; password?: string }
  ) => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const response = await updateManagedAdmin(profile._id, { adminId, ...values });
      const updated = response.data.data as AdminRecord;
      setAdmins((current) => current.map((admin) => admin._id === adminId ? updated : admin));
      toast.success("Admin account updated.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not update the admin account.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccessChange = async (target: AdminRecord, hasAccess: boolean) => {
    if (!profile) return;
    try {
      const response = await updateManagedAdminAccess(profile._id, {
        adminId: target._id,
        hasAccess,
      });
      const updated = response.data.data as AdminRecord;
      setAdmins((current) => current.map((admin) => admin._id === target._id ? updated : admin));
      toast.success(hasAccess ? "Admin access enabled." : "Admin access disabled.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not update admin access.");
    }
  };

  const handleDeleteAdmin = async (target: Pick<AdminRecord, "_id" | "username">) => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await deleteManagedAdmin(profile._id, target._id);
      setAdmins((current) => current.filter((admin) => admin._id !== target._id));
      toast.success("Admin account deleted.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not delete the admin account.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAccess = async (target: AdminRecord, hasAccess: boolean) => {
    setAccessPending(target._id);
    await handleAccessChange(target, hasAccess);
    setAccessPending(null);
  };

  const AccessSwitch = ({ admin, locked }: { admin: AdminRecord; locked: boolean }) => (
    <div className="inline-flex items-center gap-2">
      <Switch
        checked={admin.hasAccess}
        disabled={locked || accessPending === admin._id}
        onCheckedChange={(value) => toggleAccess(admin, value)}
        aria-label={`Access for ${admin.username}`}
      />
      {accessPending === admin._id && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  );

  const RoleBadge = ({ admin }: { admin: AdminRecord }) =>
    admin.sudo ? <Badge variant="secondary">Superadmin</Badge> : <Badge variant="muted">Admin</Badge>;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  if (isAuthorized !== true) {
    return (
      <AdminLayout>
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <PageHeader title="Admin profile" />
          <Card>
            <EmptyState
              icon={Lock}
              title={isAuthorized === false ? "Superadmins only" : "We couldn't check your access"}
              description={
                isAuthorized === false
                  ? "Only superadmins can manage admin accounts."
                  : loadError || "Could not verify your admin access."
              }
            />
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <PageHeader
          title="Admin profile"
          description="Your account, and the administrators who can sign in to the admin console."
          actions={
            <Button onClick={() => setShowModal(true)}>
              <Plus /> Add admin
            </Button>
          }
        />

        {profile && (
          <Card className="flex flex-col gap-4 p-5 smm:flex-row smm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Signed in as
              </p>
              <p className="truncate text-lg font-semibold text-foreground">{profile.username}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{profile.sudo ? "Superadmin" : "Admin"}</Badge>
              <Badge variant={profile.hasAccess ? "success" : "muted"}>
                {profile.hasAccess ? "Access on" : "Access off"}
              </Badge>
            </div>
          </Card>
        )}

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-foreground">Admin accounts</h2>
            <span className="text-sm text-muted-foreground">
              {admins.filter((a) => a.hasAccess).length} of {admins.length} with access
            </span>
          </div>
          {loadError && (
            <p role="alert" className="border-b border-border bg-red-50 px-4 py-2 text-sm text-red-700">
              {loadError}
            </p>
          )}

          {admins.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No admin accounts yet"
              action={
                <Button variant="outline" onClick={() => setShowModal(true)}>
                  <Plus /> Add admin
                </Button>
              }
            />
          ) : (
            <>
              <ul className="divide-y divide-border smm:hidden">
                {admins.map((admin) => {
                  const protectedAccount = admin.sudo || admin._id === profile?._id;
                  return (
                    <li key={admin._id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {admin.username}
                            {admin._id === profile?._id && (
                              <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>
                            )}
                          </p>
                        </div>
                        <RoleBadge admin={admin} />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AccessSwitch admin={admin} locked={protectedAccount} />
                          {admin.hasAccess ? "Can sign in" : "No access"}
                        </label>
                        {!protectedAccount && (
                          <div className="flex items-center gap-1">
                            <EditAdminForm selectedAdmin={admin} onSave={handleUpdateAdmin} isSaving={isSaving} />
                            <DeleteDialog selectedAdmin={admin} onDelete={handleDeleteAdmin} isDeleting={isSaving} />
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="hidden smm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => {
                      const protectedAccount = admin.sudo || admin._id === profile?._id;
                      return (
                        <TableRow key={admin._id}>
                          <TableCell className="font-medium text-foreground">
                            {admin.username}
                            {admin._id === profile?._id && (
                              <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <RoleBadge admin={admin} />
                          </TableCell>
                          <TableCell>
                            <AccessSwitch admin={admin} locked={protectedAccount} />
                          </TableCell>
                          <TableCell className="text-right">
                            {protectedAccount ? (
                              <span className="text-xs text-muted-foreground">Protected</span>
                            ) : (
                              <div className="inline-flex items-center gap-1">
                                <EditAdminForm selectedAdmin={admin} onSave={handleUpdateAdmin} isSaving={isSaving} />
                                <DeleteDialog selectedAdmin={admin} onDelete={handleDeleteAdmin} isDeleting={isSaving} />
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </Card>
        <p className="text-xs text-muted-foreground">
          Superadmin accounts and your own account are protected: their access can&apos;t be changed and they can&apos;t be edited or deleted here.
        </p>
      </div>

      <DialogShell open={showModal} onClose={closeModal} labelledBy="add-admin-title" className="max-w-md">
        <AddAdmin onSubmit={handleCreateAdmin} onCancel={closeModal} isSaving={isSaving} />
      </DialogShell>
    </AdminLayout>
  );
};

export default AdminProfile;
