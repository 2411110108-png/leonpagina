'use client';

import { useFormStatus } from 'react-dom';
import { Doctor } from '@/lib/supabase/queries';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DoctorFormProps {
    initialData?: Doctor;
    buttonText: string;
}

function SubmitButton({ buttonText }: { buttonText: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {pending && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            {pending ? 'Guardando...' : buttonText}
        </button>
    );
}

export default function DoctorForm({ initialData, buttonText }: DoctorFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const nombre = formData.get('nombre') as string;
            const especialidad = formData.get('especialidad') as string;
            const telefono = formData.get('telefono') as string | null;

            if (!nombre || !especialidad) {
                toast.error('Nombre y especialidad son requeridos');
                return;
            }

            if (initialData) {
                // Update
                const { error } = await supabase
                    .from('doctor')
                    .update({
                        nombre,
                        especialidad,
                        telefono: telefono || null
                    })
                    .eq('id', initialData.id);

                if (error) throw error;
                toast.success('Doctor actualizado correctamente');
            } else {
                // Create
                const { error } = await supabase
                    .from('doctor')
                    .insert({
                        nombre,
                        especialidad,
                        telefono: telefono || null
                    });

                if (error) throw error;
                toast.success('Doctor creado correctamente');
            }

            router.push('/dashboard/doctores');
            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error instanceof Error ? error.message : 'Error al guardar doctor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{initialData ? 'Edit Doctor' : 'New Doctor Information'}</h2>

            <div className="grid gap-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        defaultValue={initialData?.nombre}
                        required
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                        placeholder="e.g. Dr. María García"
                    />
                </div>

                <div>
                    <label htmlFor="especialidad" className="block text-sm font-semibold text-gray-700 mb-2">
                        Specialty *
                    </label>
                    <input
                        type="text"
                        id="especialidad"
                        name="especialidad"
                        defaultValue={initialData?.especialidad}
                        required
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                        placeholder="e.g. Cardiología"
                    />
                </div>

                <div>
                    <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        defaultValue={initialData?.telefono}
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                        placeholder="987 654 321"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                <Link
                    href="/dashboard/doctores"
                    className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
