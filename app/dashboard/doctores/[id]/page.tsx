import { getDoctorById } from '@/lib/supabase/queries';
import DoctorForm from '../form';
import { updateDoctorAction } from '../../actions';
import { notFound } from 'next/navigation';

export default async function EditarDoctorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const doctor = await getDoctorById(id);

    if (!doctor) {
        notFound();
    }

    const updateAction = updateDoctorAction.bind(null, id);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Editar Doctor</h1>
            <DoctorForm
                action={updateAction}
                initialData={doctor}
                buttonText="Guardar Cambios"
            />
        </div>
    );
}
