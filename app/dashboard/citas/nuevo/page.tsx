import { getDoctors, getPacientes } from '@/lib/supabase/queries';
import CitaForm from '../form';
import { createCitaAction } from '../../actions';

export default async function NuevaCitaPage() {
    const [doctores, pacientes] = await Promise.all([
        getDoctors(),
        getPacientes()
    ]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Nueva Cita</h1>
            <CitaForm
                action={createCitaAction}
                buttonText="Crear Cita"
                doctores={doctores || []}
                pacientes={pacientes || []}
            />
        </div>
    );
}
