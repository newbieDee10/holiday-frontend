"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, XCircle, X, Search, Calendar } from "lucide-react";
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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const loadHolidays = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching holidays with filters:', { startDate, endDate });
      const data = await getHolidays(startDate || undefined, endDate || undefined);
      console.log('Received holidays:', data);
      // Sort holidays by date
      const sorted = data.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setHolidays(sorted);
    } catch (err) {
      setError("Failed to load holidays.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);

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
    <div className="min-h-screen bg-cover bg-center bg-no-repeat px-15 sm:px-20 lg:px-30" style={{ backgroundImage: "url('/holiday background.webp')" }}>
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">Holiday Management App</h1>
            <p className="mt-3 text-lg text-white/90 drop-shadow">
              Manage Your Holidays!!
            </p>
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-6 animate-fade-in-up flex justify-end" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-400 text-sm font-bold rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            <Plus className="h-5 w-5" />
            Add Holiday
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative glass rounded-xl shadow-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-sky-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search holidays by name..."
              className="block w-full pl-12 pr-12 py-4 bg-transparent placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl text-gray-900 font-medium"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-sky-400" />
              <h3 className="text-lg font-bold text-gray-900">Filter by Date Range</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-900 font-medium"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-900 font-medium"
                />
              </div>
            </div>
            {(startDate || endDate) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-5 glass-dark rounded-xl shadow-xl animate-scale-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-300" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
            <span className="ml-4 text-lg font-medium text-white drop-shadow">Loading...</span>
          </div>
        )}

        {/* Holiday List */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
