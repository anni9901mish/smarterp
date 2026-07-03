import { X } from "lucide-react";
import ItemForm from "./ItemForm";

const ItemModal = ({
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
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0F1025] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {editMode ? "Edit Item" : "Create Item"}
            </h2>
            <p className="text-slate-400">Add inventory item details.</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 p-2 hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <ItemForm
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

export default ItemModal;