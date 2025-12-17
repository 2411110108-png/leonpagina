import DoctorForm from '../form';
import { createDoctorAction } from '../../actions';

export default function NuevoDoctorPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Nuevo Doctor</h1>
            <DoctorForm action={createDoctorAction} buttonText="Crear Doctor" />
        </div>
    );
}
