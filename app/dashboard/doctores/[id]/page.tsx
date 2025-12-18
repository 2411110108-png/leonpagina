import { getDoctorById } from '@/lib/supabase/queries';
import DoctorForm from '../form';
import { notFound } from 'next/navigation';

export default async function EditarDoctorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const doctor = await getDoctorById(id);

    if (!doctor) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <DoctorForm
                initialData={doctor}
                buttonText="Save Changes"
            />
        </div>
    );
}
