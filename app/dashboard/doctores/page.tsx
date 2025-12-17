import Link from 'next/link';
import { getDoctors } from '@/lib/supabase/queries';
import { deleteDoctorAction } from '../actions';
import DownloadPdfButton from '@/components/DownloadPdfButton';

export default async function DoctoresPage() {
    const doctores = await getDoctors();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Doctores</h1>
                <div className="flex gap-4">
                    <DownloadPdfButton
                        title="Reporte de Doctores"
                        fileName="doctores"
                        data={doctores || []}
                        columns={[
                            { header: 'Nombre', accessorKey: 'nombre' },
                            { header: 'Especialidad', accessorKey: 'especialidad' },
                            { header: 'Teléfono', accessorKey: 'telefono' },
                        ]}
                    />
                    <Link
                        href="/dashboard/doctores/nuevo"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Nuevo Doctor
                    </Link>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950/50 text-slate-100 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Especialidad</th>
                                <th className="px-6 py-4">Teléfono</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {doctores?.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-100">{doctor.nombre}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-400">
                                            {doctor.especialidad}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{doctor.telefono || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/dashboard/doctores/${doctor.id}`}
                                                className="text-cyan-400 hover:text-cyan-300 font-medium"
                                            >
                                                Editar
                                            </Link>
                                            <form action={deleteDoctorAction.bind(null, doctor.id)}>
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
                            {doctores?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        No hay doctores registrados.
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
