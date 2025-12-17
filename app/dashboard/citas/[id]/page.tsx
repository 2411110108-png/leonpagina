import { getCitaById, getDoctors, getPacientes } from '@/lib/supabase/queries';
import CitaForm from '../form';
import { updateCitaAction } from '../../actions';
import { notFound } from 'next/navigation';

export default async function EditarCitaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [cita, doctores, pacientes] = await Promise.all([
        getCitaById(id),
        getDoctors(),
        getPacientes()
    ]);

    if (!cita) {
        notFound();
    }

    const updateAction = updateCitaAction.bind(null, id);

    return (
        <div className="max-w-2xl mx-auto">
            <CitaForm
                action={updateAction}
                initialData={cita}
                buttonText="Save Changes"
                doctores={doctores || []}
                pacientes={pacientes || []}
            />
        </div>
    );
}
