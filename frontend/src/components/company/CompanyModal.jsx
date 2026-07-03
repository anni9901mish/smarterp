import { X } from "lucide-react";
import CompanyForm from "./CompanyForm";

const CompanyModal = ({ open, onClose, form, setForm, onSubmit, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111827] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Create Company</h2>
            <p className="text-sm text-slate-400">
              Add your business company to SmartERP.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <CompanyForm
          form={form}
          setForm={setForm}
          onSubmit={onSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CompanyModal;