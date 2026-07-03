import { X } from "lucide-react";
import LedgerForm from "./LedgerForm";

const LedgerModal = ({
  open,
  onClose,
  form,
  setForm,
  onSubmit,
  loading,
  editMode,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0F1025] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {editMode ? "Edit Ledger" : "Create Ledger"}
            </h2>
            <p className="text-slate-400">Add customer or supplier details.</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 p-2 hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <LedgerForm
          form={form}
          setForm={setForm}
          onSubmit={onSubmit}
          loading={loading}
          editMode={editMode}
        />
      </div>
    </div>
  );
};

export default LedgerModal;