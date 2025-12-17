import PacienteForm from '../form';

export default function NuevoPacientePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <PacienteForm buttonText="Create Patient" />
        </div>
    );
}
