import { getDoctors } from '@/lib/supabase/queries';
import DoctoresClient from './DoctoresClient';

export default async function DoctoresPage() {
    const doctores = await getDoctors();

    return <DoctoresClient initialDoctores={doctores || []} />;
}
