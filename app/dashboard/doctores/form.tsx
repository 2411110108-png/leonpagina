'use client';

import { Doctor } from '@/lib/supabase/queries';
import Link from 'next/link';

interface DoctorFormProps {
    action: React.ComponentProps<'form'>['action'];
    initialData?: Doctor;
    buttonText: string;
}

export default function DoctorForm({ action, initialData, buttonText }: DoctorFormProps) {
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
                        placeholder="Dr. Juan López"
                    />
                </div>

                <div>
                    <label htmlFor="especialidad" className="block text-sm font-medium text-slate-300 mb-2">
                        Especialidad
                    </label>
                    <input
                        type="text"
                        id="especialidad"
                        name="especialidad"
                        defaultValue={initialData?.especialidad}
                        required
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                        placeholder="Cardiología"
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
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-800 mt-6">
                <Link
                    href="/dashboard/doctores"
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
