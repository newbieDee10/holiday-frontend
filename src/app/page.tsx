"use client";

import { useEffect, useState } from "react";
import { Plus, XCircle, X, Search } from "lucide-react";
import { Holiday } from "./_types/Holiday";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "./_services/holidayApi";
import HolidayList from "./_components/HolidayList";
import HolidayForm from "./_components/HolidayForm";
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal";

export default function HomePage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadHolidays = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHolidays();
      // Sort holidays by date
      const sorted = data.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setHolidays(sorted);
    } catch (err) {
      setError("Failed to load holidays.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  const handleCreate = async (data: Omit<Holiday, "id">) => {
    setLoading(true);
    setError(null);
    try {
      await createHoliday(data);
      await loadHolidays();
    } catch (err) {
      setError("Failed to create holiday.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: Omit<Holiday, "id">) => {
    if (!editing) return;
    setLoading(true);
    setError(null);
    try {
      await updateHoliday(editing.id, data);
      setEditing(null);
      await loadHolidays();
    } catch (err) {
      setError("Failed to update holiday.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    const holiday = holidays.find(h => h.id === id);
    if (holiday) {
      setDeleteTarget(holiday);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    setError(null);
    try {
      await deleteHoliday(deleteTarget.id);
      await loadHolidays();
      setDeleteTarget(null);
    } catch (err) {
      setError("Failed to delete holiday.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditing(holiday);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditing(null);
  };

  // Filter holidays based on search query
  const filteredHolidays = holidays.filter(holiday => {
    return holiday.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#bdff00]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Holiday Management</h1>
              <p className="mt-2 text-sm text-gray-900">
                 Holiday Calendar
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5" />
              Add Holiday
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search holidays by name..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-sm text-gray-600">Loading...</span>
          </div>
        )}

        {/* Holiday List */}
        <div className="bg-white rounded-lg shadow">
          <HolidayList
            holidays={filteredHolidays}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Modals */}
      <HolidayForm
        isOpen={isFormOpen}
        initial={editing ? { name: editing.name, date: editing.date } : undefined}
        onSubmit={editing ? handleUpdate : handleCreate}
        onClose={handleCloseForm}
        title={editing ? "Edit Holiday" : "Add New Holiday"}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        holidayName={deleteTarget?.name || ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
