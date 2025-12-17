import { getCitas } from '@/lib/supabase/queries';
import CitasClient from './CitasClient';

export default async function CitasPage() {
    const citas = await getCitas();

    return <CitasClient initialCitas={citas || []} />;
}
