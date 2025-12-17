import Link from 'next/link';
import { getCitas, deleteCita } from '@/lib/supabase/queries';
import { deleteCitaAction } from '../actions';
import DownloadPdfButton from '@/components/DownloadPdfButton';

export default async function CitasPage() {
    const citas = await getCitas();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-100">Citas</h1>
                <div className="flex gap-4">
                    <DownloadPdfButton
                        title="Reporte de Citas"
                        fileName="citas"
                        data={citas || []}
                        columns={[
                            { header: 'Fecha', accessorKey: 'fecha' },
                            { header: 'Hora', accessorKey: 'hora' },
                            { header: 'Paciente', accessorKey: 'paciente.nombre' },
                            { header: 'Doctor', accessorKey: 'doctor.nombre' },
                            { header: 'Especialidad', accessorKey: 'doctor.especialidad' },
                            { header: 'Estado', accessorKey: 'estado' },
                        ]}
                    />
                    <Link
                        href="/dashboard/citas/nuevo"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Nueva Cita
                    </Link>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950/50 text-slate-100 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Fecha/Hora</th>
                                <th className="px-6 py-4">Paciente</th>
                                <th className="px-6 py-4">Doctor</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {citas?.map((cita) => (
                                <tr key={cita.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-100">
                                        <div className="flex flex-col">
                                            <span>{cita.fecha}</span>
                                            <span className="text-xs text-slate-400">{cita.hora}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{cita.paciente?.nombre}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span>{cita.doctor?.nombre}</span>
                                            <span className="text-xs text-slate-500">{cita.doctor?.especialidad}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize
                        ${cita.estado === 'confirmada'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : cita.estado === 'pendiente'
                                                        ? 'bg-yellow-500/10 text-yellow-400'
                                                        : cita.estado === 'cancelada'
                                                            ? 'bg-rose-500/10 text-rose-400'
                                                            : 'bg-slate-500/10 text-slate-400'
                                                }
                      `}
                                        >
                                            {cita.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/dashboard/citas/${cita.id}`}
                                                className="text-cyan-400 hover:text-cyan-300 font-medium"
                                            >
                                                Editar
                                            </Link>
                                            <form action={deleteCitaAction.bind(null, cita.id)}>
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
                            {citas?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No hay citas registradas.
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
