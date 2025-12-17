import { getPacienteById } from '@/lib/supabase/queries';
import PacienteForm from '../form';
import { updatePacienteAction } from '../../actions';
import { notFound } from 'next/navigation';

export default async function EditarPacientePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const paciente = await getPacienteById(id);

    if (!paciente) {
        notFound();
    }

    const updateAction = updatePacienteAction.bind(null, id);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Editar Paciente</h1>
            <PacienteForm
                action={updateAction}
                initialData={paciente}
                buttonText="Guardar Cambios"
            />
        </div>
    );
}
