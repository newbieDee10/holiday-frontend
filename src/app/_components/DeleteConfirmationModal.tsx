import { AlertTriangle } from 'lucide-react';

interface Props {
  readonly isOpen: boolean;
  readonly holidayName: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export default function DeleteConfirmationModal({ isOpen, holidayName, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-scale-in">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <button
          type="button"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onCancel}
        ></button>

        {/* Modal */}
        <div className="relative glass rounded-2xl shadow-2xl max-w-md w-full border-2 border-white/20">
          <div className="px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg animate-pulse">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Delete Holiday</h3>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-red-600">{holidayName}</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 bg-white/30 rounded-b-2xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white/80 border-2 border-gray-300 rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 border-2 border-transparent rounded-xl hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
