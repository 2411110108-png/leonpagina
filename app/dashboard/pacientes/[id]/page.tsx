import { getPacienteById } from '@/lib/supabase/queries';
import PacienteForm from '../form';
import { notFound } from 'next/navigation';

export default async function EditarPacientePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const paciente = await getPacienteById(id);

    if (!paciente) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <PacienteForm
                initialData={paciente}
                buttonText="Save Changes"
            />
        </div>
    );
}
