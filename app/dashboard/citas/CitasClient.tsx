'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { deleteCitaAction } from '../actions';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

interface Cita {
    id: string;
    fecha: string;
    hora: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'atendida';
    doctor?: { nombre: string };
    paciente?: { nombre: string };
}

interface CitasClientProps {
    initialCitas: Cita[];
}

export default function CitasClient({ initialCitas }: CitasClientProps) {
    const [citas, setCitas] = useState(initialCitas);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; cita: Cita | null }>({
        isOpen: false,
        cita: null,
    });

    const filteredCitas = useMemo(() => {
        let filtered = citas;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((c) => c.estado === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (c) =>
                    c.doctor?.nombre.toLowerCase().includes(term) ||
                    c.paciente?.nombre.toLowerCase().includes(term) ||
                    c.fecha.includes(term)
            );
        }

        return filtered;
    }, [citas, searchTerm, statusFilter]);

    const handleDelete = async () => {
        if (!deleteDialog.cita) return;

        try {
            await deleteCitaAction(deleteDialog.cita.id);
            setCitas(citas.filter((c) => c.id !== deleteDialog.cita!.id));
            toast.success('Cita eliminada correctamente');
        } catch (error) {
            toast.error('Error al eliminar cita');
            console.error(error);
        }
    };

    const getStatusBadge = (estado: string) => {
        const styles = {
            pendiente: 'bg-amber-100 text-amber-700 border-amber-200',
            confirmada: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            cancelada: 'bg-rose-100 text-rose-700 border-rose-200',
            atendida: 'bg-blue-100 text-blue-700 border-blue-200',
        };

        const labels = {
            pendiente: 'Pending',
            confirmada: 'Confirmed',
            cancelada: 'Cancelled',
            atendida: 'Completed',
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[estado as keyof typeof styles]}`}>
                {labels[estado as keyof typeof labels]}
            </span>
        );
    };

    const stats = {
        all: citas.length,
        pendiente: citas.filter((c) => c.estado === 'pendiente').length,
        confirmada: citas.filter((c) => c.estado === 'confirmada').length,
        atendida: citas.filter((c) => c.estado === 'atendida').length,
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
                        <p className="text-gray-500 mt-1">{filteredCitas.length} cita{filteredCitas.length !== 1 ? 's' : ''} encontrada{filteredCitas.length !== 1 ? 's' : ''}</p>
                    </div>

                    <Link
                        href="/dashboard/citas/nuevo"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Appointment
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === 'all'
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                    >
                        <div className="text-2xl font-bold text-gray-800">{stats.all}</div>
                        <div className="text-sm text-gray-500">Total</div>
                    </button>
                    <button
                        onClick={() => setStatusFilter('pendiente')}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === 'pendiente'
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                    >
                        <div className="text-2xl font-bold text-amber-600">{stats.pendiente}</div>
                        <div className="text-sm text-gray-500">Pending</div>
                    </button>
                    <button
                        onClick={() => setStatusFilter('confirmada')}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === 'confirmada'
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                    >
                        <div className="text-2xl font-bold text-emerald-600">{stats.confirmada}</div>
                        <div className="text-sm text-gray-500">Confirmed</div>
                    </button>
                    <button
                        onClick={() => setStatusFilter('atendida')}
                        className={`p-4 rounded-xl border-2 transition-all ${statusFilter === 'atendida'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                    >
                        <div className="text-2xl font-bold text-blue-600">{stats.atendida}</div>
                        <div className="text-sm text-gray-500">Completed</div>
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por doctor, paciente o fecha..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {filteredCitas.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                {searchTerm || statusFilter !== 'all' ? 'No se encontraron citas' : 'No hay citas registradas'}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {searchTerm || statusFilter !== 'all' ? 'Intenta con otros filtros' : 'Comienza agendando tu primera cita'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCitas.map((cita) => (
                                        <tr key={cita.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex flex-col items-center justify-center">
                                                        <div className="text-xs font-semibold text-teal-700">
                                                            {new Date(cita.fecha).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                                                        </div>
                                                        <div className="text-lg font-bold text-teal-900">
                                                            {new Date(cita.fecha).getDate()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{cita.hora}</div>
                                                        <div className="text-sm text-gray-500">{new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long' })}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800">{cita.paciente?.nombre || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800">{cita.doctor?.nombre || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(cita.estado)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/dashboard/citas/${cita.id}`}
                                                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteDialog({ isOpen: true, cita })}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, cita: null })}
                onConfirm={handleDelete}
                title="Eliminar Cita"
                message={`¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
            />
        </>
    );
}
