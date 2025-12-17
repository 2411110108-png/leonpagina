'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { deletePacienteAction } from '../actions';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

interface Paciente {
    id: string;
    nombre: string;
    dni: string;
    telefono?: string;
    correo?: string;
}

interface PacientesClientProps {
    initialPacientes: Paciente[];
}

export default function PacientesClient({ initialPacientes }: PacientesClientProps) {
    const [pacientes, setPacientes] = useState(initialPacientes);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; paciente: Paciente | null }>({
        isOpen: false,
        paciente: null,
    });

    // Filtered pacientes based on search
    const filteredPacientes = useMemo(() => {
        if (!searchTerm) return pacientes;

        const term = searchTerm.toLowerCase();
        return pacientes.filter(
            (p) =>
                p.nombre.toLowerCase().includes(term) ||
                p.dni.toLowerCase().includes(term) ||
                p.correo?.toLowerCase().includes(term) ||
                p.telefono?.includes(term)
        );
    }, [pacientes, searchTerm]);

    const handleDelete = async () => {
        if (!deleteDialog.paciente) return;

        try {
            await deletePacienteAction(deleteDialog.paciente.id);
            setPacientes(pacientes.filter((p) => p.id !== deleteDialog.paciente!.id));
            toast.success('Paciente eliminado correctamente');
        } catch (error) {
            toast.error('Error al eliminar paciente');
            console.error(error);
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header with search */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
                        <p className="text-gray-500 mt-1">{filteredPacientes.length} paciente{filteredPacientes.length !== 1 ? 's' : ''} encontrado{filteredPacientes.length !== 1 ? 's' : ''}</p>
                    </div>

                    <Link
                        href="/dashboard/pacientes/nuevo"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Patient
                    </Link>
                </div>

                {/* Search bar */}
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
                        placeholder="Buscar por nombre, DNI, email o teléfono..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                    {filteredPacientes.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primer paciente'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPacientes.map((paciente) => (
                                        <tr key={paciente.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                                        {paciente.nombre.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{paciente.nombre}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600 font-mono text-sm">{paciente.dni}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {paciente.correo && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            {paciente.correo}
                                                        </div>
                                                    )}
                                                    {paciente.telefono && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            {paciente.telefono}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/dashboard/pacientes/${paciente.id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteDialog({ isOpen: true, paciente })}
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
                onClose={() => setDeleteDialog({ isOpen: false, paciente: null })}
                onConfirm={handleDelete}
                title="Eliminar Paciente"
                message={`¿Estás seguro de que deseas eliminar a ${deleteDialog.paciente?.nombre}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
            />
        </>
    );
}
