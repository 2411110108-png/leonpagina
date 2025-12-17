import DoctorForm from '../form';
import { createDoctorAction } from '../../actions';

export default function NuevoDoctorPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <DoctorForm action={createDoctorAction} buttonText="Create Doctor" />
        </div>
    );
}
