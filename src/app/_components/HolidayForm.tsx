import { useState, FormEvent, useEffect } from 'react';
import { X } from 'lucide-react';
import { Holiday } from '../_types/Holiday';

interface Props {
  isOpen: boolean;
  initial?: Omit<Holiday, 'id'>;
  onSubmit: (data: Omit<Holiday, 'id'>) => void;
  onClose: () => void;
  title: string;
}

export default function HolidayForm({ isOpen, initial, onSubmit, onClose, title }: Readonly<Props>) {
  const [name, setName] = useState(initial?.name || '');
  const [date, setDate] = useState(initial?.date || '');

  useEffect(() => {
    setName(initial?.name || '');
    setDate(initial?.date || '');
  }, [initial]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, date });
    setName('');
    setDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-scale-in">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity z-40"
          onClick={onClose}
        ></div>

        {/* Modal */} 
        <div className="relative glass rounded-2xl shadow-2xl max-w-md w-full z-50 border-2 border-white/20">
          <div className="px-6 py-5 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold bg-sky-400 bg-clip-text text-transparent">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 transition-colors hover:rotate-90 duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">
                  Holiday Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/80 border-2 border-sky-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                  placeholder="e.g., Christmas Day"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-bold text-gray-800 mb-2">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/80 border-2 border-sky-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="px-6 py-5 bg-white/30 rounded-b-2xl flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white/80 border-2 border-gray-300 rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-bold text-white bg-sky-400 border-2 border-transparent rounded-xl hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Save Holiday
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
