import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Modal from "../../Modal";
import { AnimatePresence } from "framer-motion";
import { CircularProgress } from "@mui/material";
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#015ce9",
      color: theme.palette.common.white,
      fontSize: 18,
      fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      fontWeight: 600,
      border: "none",
    },
  }));

  if (isLoading) {
    return <AdminLayout><div className="text-center mt-12"><CircularProgress size={30} /></div></AdminLayout>;
  }

  if (isAuthorized !== true) {
    return (
      <AdminLayout>
        <div className="my-[60px] max-w-[1300px] mx-auto rounded-lg bg-white p-8 shadow">
          <h1 className="text-2xl font-bold">Admin Profile</h1>
          <p className="mt-4 text-slate-600">
            {isAuthorized === false
              ? "This page is limited to superadmins."
              : loadError || "Could not verify your admin access."}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="my-[60px] max-w-[1300px] mx-auto">
        <div className="pb-9 font-bold text-2xl">Admin Profile</div>
        <div className="shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] p-8">
          {loadError && <p role="alert" className="mb-4 text-red-600">{loadError}</p>}
          <TableContainer sx={{ maxHeight: 500 }} className="table-scroll">
            <Table sx={{ minWidth: 700, borderCollapse: "separate", borderSpacing: "0" }} stickyHeader aria-label="Admin accounts">
              <TableHead>
                <TableRow className="text-white font-bold">
                  {["S/N", "Username", "Role", "Access", "Edit", "Delete"].map((header) => (
                    <StyledTableCell key={header} align="center">{header}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin, index) => {
                  const protectedAccount = admin.sudo || admin._id === profile?._id;
                  return (
                    <TableRow key={admin._id}>
                      <StyledTableCell align="center">{String(index + 1).padStart(2, "0")}</StyledTableCell>
                      <StyledTableCell align="center">{admin.username}</StyledTableCell>
                      <StyledTableCell align="center">{admin.sudo ? "Superadmin" : "Admin"}</StyledTableCell>
                      <StyledTableCell align="center">
                        <input
                          aria-label={`Access for ${admin.username}`}
                          type="checkbox"
                          checked={admin.hasAccess}
                          disabled={protectedAccount}
                          onChange={(event) => handleAccessChange(admin, event.target.checked)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {!protectedAccount && <EditAdminForm selectedAdmin={admin} onSave={handleUpdateAdmin} isSaving={isSaving} />}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {!protectedAccount && <DeleteDialog selectedAdmin={admin} onDelete={handleDeleteAdmin} isDeleting={isSaving} />}
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
                {admins.length === 0 && <TableRow><StyledTableCell colSpan={6} align="center">No admin accounts found.</StyledTableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center">
            <button type="button" onClick={() => setShowModal(true)} className="w-44 h-12 mt-10 flex justify-center items-center bg-blue-700 gap-2.5 text-zinc-100 lg:text-xl text-base font-semibold outline-none rounded-lg">
              <span>+</span><span>Add Admin</span>
            </button>
          </div>
          <AnimatePresence mode="wait">
            {showModal && <Modal key="modal" handleClose={closeModal}><AddAdmin onSubmit={handleCreateAdmin} onCancel={closeModal} isSaving={isSaving} /></Modal>}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
