'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createPaciente,
    updatePaciente,
    deletePaciente,
    createCita,
    updateCita,
    deleteCita,
    Doctor,
    Paciente,
    Cita,
} from '@/lib/supabase/queries';

// --- Pacientes Actions ---

export async function createPacienteAction(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const dni = formData.get('dni') as string;
    const telefono = formData.get('telefono') as string;
    const correo = formData.get('correo') as string;

    await createPaciente({ nombre, dni, telefono, correo });
    revalidatePath('/dashboard/pacientes');
    redirect('/dashboard/pacientes');
}

export async function updatePacienteAction(id: string, formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const dni = formData.get('dni') as string;
    const telefono = formData.get('telefono') as string;
    const correo = formData.get('correo') as string;

    await updatePaciente(id, { nombre, dni, telefono, correo });
    revalidatePath('/dashboard/pacientes');
    redirect('/dashboard/pacientes');
}

export async function deletePacienteAction(id: string) {
    await deletePaciente(id);
    revalidatePath('/dashboard/pacientes');
}

// --- Doctores Actions ---

export async function createDoctorAction(formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const especialidad = formData.get('especialidad') as string;
    const telefono = formData.get('telefono') as string;

    await createDoctor({ nombre, especialidad, telefono });
    revalidatePath('/dashboard/doctores');
    redirect('/dashboard/doctores');
}

export async function updateDoctorAction(id: string, formData: FormData) {
    const nombre = formData.get('nombre') as string;
    const especialidad = formData.get('especialidad') as string;
    const telefono = formData.get('telefono') as string;

    await updateDoctor(id, { nombre, especialidad, telefono });
    revalidatePath('/dashboard/doctores');
    redirect('/dashboard/doctores');
}

export async function deleteDoctorAction(id: string) {
    await deleteDoctor(id);
    revalidatePath('/dashboard/doctores');
}

// --- Citas Actions ---

export async function createCitaAction(formData: FormData) {
    const doctor_id = formData.get('doctor_id') as string;
    const paciente_id = formData.get('paciente_id') as string;
    const fecha = formData.get('fecha') as string;
    const hora = formData.get('hora') as string;
    const estado = 'pendiente';

    await createCita({ doctor_id, paciente_id, fecha, hora, estado });
    revalidatePath('/dashboard/citas');
    redirect('/dashboard/citas');
}

export async function updateCitaAction(id: string, formData: FormData) {
    const doctor_id = formData.get('doctor_id') as string;
    const paciente_id = formData.get('paciente_id') as string;
    const fecha = formData.get('fecha') as string;
    const hora = formData.get('hora') as string;
    const estado = formData.get('estado') as Cita['estado'];

    await updateCita(id, { doctor_id, paciente_id, fecha, hora, estado });
    revalidatePath('/dashboard/citas');
    redirect('/dashboard/citas');
}

export async function deleteCitaAction(id: string) {
    await deleteCita(id);
    revalidatePath('/dashboard/citas');
}
