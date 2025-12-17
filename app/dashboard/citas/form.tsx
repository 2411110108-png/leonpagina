'use client';

import { Cita, Doctor, Paciente } from '@/lib/supabase/queries';
import Link from 'next/link';

interface CitaFormProps {
    action: React.ComponentProps<'form'>['action'];
    initialData?: Cita;
    doctores: Doctor[];
    pacientes: Paciente[];
    buttonText: string;
}

export default function CitaForm({ action, initialData, doctores, pacientes, buttonText }: CitaFormProps) {
    return (
        <form action={action} className="space-y-6 max-w-2xl bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <div className="grid gap-6 md:grid-cols-2">

                <div className="md:col-span-2">
                    <label htmlFor="paciente_id" className="block text-sm font-medium text-slate-300 mb-2">
                        Paciente
                    </label>
                    <select
                        id="paciente_id"
                        name="paciente_id"
                        defaultValue={initialData?.paciente_id}
                        required
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    >
                        <option value="">Seleccione un paciente</option>
                        {pacientes.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} ({p.dni})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="doctor_id" className="block text-sm font-medium text-slate-300 mb-2">
                        Doctor
                    </label>
                    <select
                        id="doctor_id"
                        name="doctor_id"
                        defaultValue={initialData?.doctor_id}
                        required
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    >
                        <option value="">Seleccione un doctor</option>
                        {doctores.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.nombre} - {d.especialidad}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="fecha" className="block text-sm font-medium text-slate-300 mb-2">
                        Fecha
                    </label>
                    <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        defaultValue={initialData?.fecha}
                        required
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                    />
                </div>

                <div>
                    <label htmlFor="hora" className="block text-sm font-medium text-slate-300 mb-2">
                        Hora
                    </label>
                    <input
                        type="time"
                        id="hora"
                        name="hora"
                        defaultValue={initialData?.hora}
                        required
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                    />
                </div>

                {initialData && (
                    <div className="md:col-span-2">
                        <label htmlFor="estado" className="block text-sm font-medium text-slate-300 mb-2">
                            Estado
                        </label>
                        <select
                            id="estado"
                            name="estado"
                            defaultValue={initialData.estado}
                            required
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="atendida">Atendida</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 mt-6">
                <Link
                    href="/dashboard/citas"
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold px-6 py-2 rounded-md text-sm transition-colors shadow-lg shadow-cyan-500/20"
                >
                    {buttonText}
                </button>
            </div>
        </form>
    );
}
