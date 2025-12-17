import PacienteForm from '../form';
import { createPacienteAction } from '../../actions';

export default function NuevoPacientePage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Nuevo Paciente</h1>
            <PacienteForm action={createPacienteAction} buttonText="Crear Paciente" />
        </div>
    );
}
