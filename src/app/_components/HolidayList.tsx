import { Holiday } from '../_types/Holiday';
import { Edit2, Trash2, Calendar } from 'lucide-react';

interface Props {
  holidays: Holiday[];
  onEdit: (holiday: Holiday) => void;
  onDelete: (id: number) => void;
}

export default function HolidayList({ holidays, onEdit, onDelete }: Readonly<Props>) {
  if (holidays.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No holidays</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new holiday.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Holiday Name
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Date
            </th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {holidays.map(h => (
            <tr key={h.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {h.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(h.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  onClick={() => onEdit(h)}
                  className="text-white bg-blue-600 p-1 rounded-md hover:text-indigo-900 mr-4 inline-flex items-center gap-1"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(h.id)}
                  className="text-white bg-red-600 p-1 rounded-md hover:text-red-900 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
