import { getDoctors, getPacientes } from '@/lib/supabase/queries';
import CitaForm from '../form';
import { createCitaAction } from '../../actions';

export default async function NuevaCitaPage() {
    const [doctores, pacientes] = await Promise.all([
        getDoctors(),
        getPacientes()
    ]);

    return (
        <div className="max-w-2xl mx-auto">
            <CitaForm
                action={createCitaAction}
                buttonText="Create Appointment"
                doctores={doctores || []}
                pacientes={pacientes || []}
            />
        </div>
    );
}
