import Link from 'next/link';
import { getPacientes, deletePaciente } from '@/lib/supabase/queries';
import { deletePacienteAction } from '../actions';
import DownloadPdfButton from '@/components/DownloadPdfButton';

export default async function PacientesPage() {
    const pacientes = await getPacientes();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Pacientes</h1>
                <div className="flex gap-4">
                    <DownloadPdfButton
                        title="Reporte de Pacientes"
                        fileName="pacientes"
                        data={pacientes || []}
                        columns={[
                            { header: 'Nombre', accessorKey: 'nombre' },
                            { header: 'DNI', accessorKey: 'dni' },
                            { header: 'Teléfono', accessorKey: 'telefono' },
                            { header: 'Correo', accessorKey: 'correo' },
                        ]}
                    />
                    <Link
                        href="/dashboard/pacientes/nuevo"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Nuevo Paciente
                    </Link>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950/50 text-slate-100 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">DNI</th>
                                <th className="px-6 py-4">Teléfono</th>
                                <th className="px-6 py-4">Correo</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {pacientes?.map((paciente) => (
                                <tr key={paciente.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-100">{paciente.nombre}</td>
                                    <td className="px-6 py-4">{paciente.dni}</td>
                                    <td className="px-6 py-4">{paciente.telefono || '-'}</td>
                                    <td className="px-6 py-4">{paciente.correo || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/dashboard/pacientes/${paciente.id}`}
                                                className="text-cyan-400 hover:text-cyan-300 font-medium"
                                            >
                                                Editar
                                            </Link>
                                            <form action={deletePacienteAction.bind(null, paciente.id)}>
                                                <button
                                                    type="submit"
                                                    className="text-rose-400 hover:text-rose-300 font-medium"
                                                >
                                                    Eliminar
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pacientes?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No hay pacientes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
