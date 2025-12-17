'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { deleteDoctorAction } from '../actions';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

interface Doctor {
    id: string;
    nombre: string;
    especialidad: string;
    telefono?: string;
}

interface DoctoresClientProps {
    initialDoctores: Doctor[];
}

export default function DoctoresClient({ initialDoctores }: DoctoresClientProps) {
    const [doctores, setDoctores] = useState(initialDoctores);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; doctor: Doctor | null }>({
        isOpen: false,
        doctor: null,
    });

    const filteredDoctores = useMemo(() => {
        if (!searchTerm) return doctores;

        const term = searchTerm.toLowerCase();
        return doctores.filter(
            (d) =>
                d.nombre.toLowerCase().includes(term) ||
                d.especialidad.toLowerCase().includes(term) ||
                d.telefono?.includes(term)
        );
    }, [doctores, searchTerm]);

    const handleDelete = async () => {
        if (!deleteDialog.doctor) return;

        try {
            await deleteDoctorAction(deleteDialog.doctor.id);
            setDoctores(doctores.filter((d) => d.id !== deleteDialog.doctor!.id));
            toast.success('Doctor eliminado correctamente');
        } catch (error) {
            toast.error('Error al eliminar doctor');
            console.error(error);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Doctors</h1>
                        <p className="text-gray-500 mt-1">{filteredDoctores.length} doctor{filteredDoctores.length !== 1 ? 'es' : ''} encontrado{filteredDoctores.length !== 1 ? 's' : ''}</p>
                    </div>

                    <Link
                        href="/dashboard/doctores/nuevo"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Doctor
                    </Link>
                </div>

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
                        placeholder="Buscar por nombre, especialidad o teléfono..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {filteredDoctores.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                {searchTerm ? 'No se encontraron doctores' : 'No hay doctores registrados'}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primer doctor'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialty</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredDoctores.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                                        {doctor.nombre.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="font-semibold text-gray-800">{doctor.nombre}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                                    {doctor.especialidad}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {doctor.telefono && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        {doctor.telefono}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/dashboard/doctores/${doctor.id}`}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteDialog({ isOpen: true, doctor })}
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
                onClose={() => setDeleteDialog({ isOpen: false, doctor: null })}
                onConfirm={handleDelete}
                title="Eliminar Doctor"
                message={`¿Estás seguro de que deseas eliminar al Dr. ${deleteDialog.doctor?.nombre}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
            />
        </>
    );
}
