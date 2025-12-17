import { getPacientes } from '@/lib/supabase/queries';
import PacientesClient from './PacientesClient';

export default async function PacientesPage() {
    const pacientes = await getPacientes();

    return <PacientesClient initialPacientes={pacientes || []} />;
}
