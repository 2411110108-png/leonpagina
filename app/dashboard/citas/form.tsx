'use client';

import { useFormStatus } from 'react-dom';
import { Cita, Doctor, Paciente } from '@/lib/supabase/queries';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface CitaFormProps {
    initialData?: Cita;
    doctores: Doctor[];
    pacientes: Paciente[];
    buttonText: string;
}

function SubmitButton({ buttonText }: { buttonText: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-teal-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {pending && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            {pending ? 'Guardando...' : buttonText}
        </button>
    );
}

export default function CitaForm({ initialData, doctores, pacientes, buttonText }: CitaFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const doctor_id = formData.get('doctor_id') as string;
            const paciente_id = formData.get('paciente_id') as string;
            const fecha = formData.get('fecha') as string;
            const hora = formData.get('hora') as string;
            const estado = formData.get('estado') as 'pendiente' | 'confirmada' | 'cancelada' | 'atendida' || 'pendiente';

            if (!doctor_id || !paciente_id || !fecha || !hora) {
                toast.error('Todos los campos son requeridos');
                return;
            }

            if (initialData) {
                // Update
                const { error } = await supabase
                    .from('citas')
                    .update({
                        doctor_id,
                        paciente_id,
                        fecha,
                        hora,
                        estado
                    })
                    .eq('id', initialData.id);

                if (error) throw error;
                toast.success('Cita actualizada correctamente');
            } else {
                // Create
                const { error } = await supabase
                    .from('citas')
                    .insert({
                        doctor_id,
                        paciente_id,
                        fecha,
                        hora,
                        estado: 'pendiente'
                    });

                if (error) throw error;
                toast.success('Cita creada correctamente');
            }

            router.push('/dashboard/citas');
            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error instanceof Error ? error.message : 'Error al guardar cita');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{initialData ? 'Edit Appointment' : 'New Appointment Information'}</h2>

            <div className="grid gap-6 md:grid-cols-2">

                <div className="md:col-span-2">
                    <label htmlFor="paciente_id" className="block text-sm font-semibold text-gray-700 mb-2">
                        Patient *
                    </label>
                    <select
                        id="paciente_id"
                        name="paciente_id"
                        defaultValue={initialData?.paciente_id}
                        required
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
                    >
                        <option value="">Select a patient</option>
                        {pacientes.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} ({p.dni})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="doctor_id" className="block text-sm font-semibold text-gray-700 mb-2">
                        Doctor *
                    </label>
                    <select
                        id="doctor_id"
                        name="doctor_id"
                        defaultValue={initialData?.doctor_id}
                        required
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
                    >
                        <option value="">Select a doctor</option>
                        {doctores.map((d) => (
                            <option key={d.id} value={d.id}>
                                Dr. {d.nombre} - {d.especialidad}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700 mb-2">
                        Date *
                    </label>
                    <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        defaultValue={initialData?.fecha}
                        required
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="hora" className="block text-sm font-semibold text-gray-700 mb-2">
                        Time *
                    </label>
                    <input
                        type="time"
                        id="hora"
                        name="hora"
                        defaultValue={initialData?.hora}
                        required
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    />
                </div>

                {initialData && (
                    <div className="md:col-span-2">
                        <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            id="estado"
                            name="estado"
                            defaultValue={initialData?.estado}
                            required
                            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none"
                        >
                            <option value="pendiente">Pending</option>
                            <option value="confirmada">Confirmed</option>
                            <option value="atendida">Completed</option>
                            <option value="cancelada">Cancelled</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                <Link
                    href="/dashboard/citas"
                    className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-teal-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    {loading ? 'Guardando...' : buttonText}
                </button>
            </div>
        </form>
    );
}
