'use client';

import { Paciente } from '@/lib/supabase/queries';
import Link from 'next/link';

interface PacienteFormProps {
    action: React.ComponentProps<'form'>['action'];
    initialData?: Paciente;
    buttonText: string;
}

export default function PacienteForm({ action, initialData, buttonText }: PacienteFormProps) {
    return (
        <form action={action} className="space-y-6 max-w-2xl bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label htmlFor="nombre" className="block text-sm font-medium text-slate-300 mb-2">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        defaultValue={initialData?.nombre}
                        required
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                        placeholder="Juan Pérez"
                    />
                </div>

                <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-slate-300 mb-2">
                        DNI
                    </label>
                    <input
                        type="text"
                        id="dni"
                        name="dni"
                        defaultValue={initialData?.dni}
                        required
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                        placeholder="12345678"
                    />
                </div>

                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-slate-300 mb-2">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        defaultValue={initialData?.telefono}
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                        placeholder="987 654 321"
                    />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="correo" className="block text-sm font-medium text-slate-300 mb-2">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        defaultValue={initialData?.correo}
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                        placeholder="juan@ejemplo.com"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 mt-6">
                <Link
                    href="/dashboard/pacientes"
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
