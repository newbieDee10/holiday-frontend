import { Holiday } from '../_types/Holiday';
import { Edit2, Trash2, Calendar} from 'lucide-react';

interface Props {
  holidays: Holiday[];
  onEdit: (holiday: Holiday) => void;
  onDelete: (id: number) => void;
}

export default function HolidayList({ holidays, onEdit, onDelete }: Readonly<Props>) {
  if (holidays.length === 0) {
    return (
      <div className="text-center py-16 glass rounded-2xl border-2 border-dashed border-white/30 shadow-xl">
        <Calendar className="mx-auto h-16 w-16 text-white/60 animate-float" />
        <h3 className="mt-4 text-lg font-bold text-white">No holidays yet</h3>
        <p className="mt-2 text-sm text-white/80">Get started by creating your first holiday celebration!</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl shadow-xl overflow-hidden">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-white/20">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
              Holiday Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {holidays.map((h) => (
            <tr key={h.id} className="hover:bg-white/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {h.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-sky-400" />
                  {new Date(h.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onEdit(h)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(h.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
