import { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";
import { toast } from "sonner";

import api from "../api/axiosInstance";
import CompanyCard from "../components/company/CompanyCard";
import CompanyModal from "../components/company/CompanyModal";
import EmptyState from "../components/company/EmptyState";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activeCompanyId, setActiveCompanyId] = useState(
    localStorage.getItem("companyId")
  );

  const [form, setForm] = useState({
    name: "",
    gstNumber: "",
  });

const fetchCompanies = async () => {
  try {
    const res = await api.get("/company", {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    console.log("Companies response:", res.data);

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.companies || [];

    setCompanies(data);
  } catch (error) {
    console.log("Fetch companies error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to fetch companies");
  }
};

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/company", form);

      toast.success("Company created successfully");

      setForm({
        name: "",
        gstNumber: "",
      });

      setModalOpen(false);
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Company creation failed");
    } finally {
      setLoading(false);
    }
  };

const handleOpenCompany = (company) => {
  localStorage.setItem("companyId", company.id);
  localStorage.setItem("companyName", company.name);

  setActiveCompanyId(company.id);

  toast.success(`${company.name} selected`);

  window.location.href = "/dashboard";
};

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-400">
            <Building2 size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Company Management</h1>
            <p className="text-slate-400">
              Create and manage your business companies.
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 font-semibold text-slate-950 hover:bg-violet-400"
        >
          <Plus size={18} />
          Add Company
        </button>
      </div>

      {companies.length === 0 ? (
        <EmptyState onCreate={() => setModalOpen(true)} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              activeCompanyId={activeCompanyId}
              onOpen={handleOpenCompany}
            />
          ))}
        </div>
      )}

      <CompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleCreate}
        loading={loading}
      />
    </div>
  );
};

export default Company;