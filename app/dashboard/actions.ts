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
} from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';

// --- Pacientes Actions ---

export async function createPacienteAction(prevState: any, formData: FormData) {
    try {
        // Verificar autenticación
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Auth error:', authError);
            return { error: 'No estás autenticado. Por favor inicia sesión nuevamente.' };
        }

        console.log('✅ User authenticated:', user.email);

        const nombre = formData.get('nombre') as string;
        const dni = formData.get('dni') as string;
        const telefono = formData.get('telefono') as string | null;
        const correo = formData.get('correo') as string | null;

        console.log('📝 Creating paciente:', { nombre, dni });

        if (!nombre || !dni) {
            return { error: 'Nombre y DNI son requeridos' };
        }

        const result = await createPaciente({
            nombre,
            dni,
            telefono: telefono || undefined,
            correo: correo || undefined
        });

        console.log('✅ Paciente created:', result);

        revalidatePath('/dashboard/pacientes');
        redirect('/dashboard/pacientes');
    } catch (error) {
        console.error('❌ Error creating paciente:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al crear paciente';
        return { error: errorMessage };
    }
}

export async function updatePacienteAction(id: string, prevState: any, formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { error: 'No estás autenticado. Por favor inicia sesión nuevamente.' };
        }

        const nombre = formData.get('nombre') as string;
        const dni = formData.get('dni') as string;
        const telefono = formData.get('telefono') as string | null;
        const correo = formData.get('correo') as string | null;

        if (!nombre || !dni) {
            return { error: 'Nombre y DNI son requeridos' };
        }

        await updatePaciente(id, {
            nombre,
            dni,
            telefono: telefono || undefined,
            correo: correo || undefined
        });

        revalidatePath('/dashboard/pacientes');
        redirect('/dashboard/pacientes');
    } catch (error) {
        console.error('Error updating paciente:', error);
        return { error: error instanceof Error ? error.message : 'Error al actualizar paciente' };
    }
}

export async function deletePacienteAction(id: string) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error('No estás autenticado');
        }

        await deletePaciente(id);
        revalidatePath('/dashboard/pacientes');
    } catch (error) {
        console.error('Error deleting paciente:', error);
        throw new Error(error instanceof Error ? error.message : 'Error al eliminar paciente');
    }
}

// --- Doctores Actions ---

export async function createDoctorAction(prevState: any, formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { error: 'No estás autenticado. Por favor inicia sesión nuevamente.' };
        }

        const nombre = formData.get('nombre') as string;
        const especialidad = formData.get('especialidad') as string;
        const telefono = formData.get('telefono') as string | null;

        console.log('📝 Creating doctor:', { nombre, especialidad });

        if (!nombre || !especialidad) {
            return { error: 'Nombre y especialidad son requeridos' };
        }

        await createDoctor({
            nombre,
            especialidad,
            telefono: telefono || undefined
        });

        revalidatePath('/dashboard/doctores');
        redirect('/dashboard/doctores');
    } catch (error) {
        console.error('❌ Error creating doctor:', error);
        return { error: error instanceof Error ? error.message : 'Error al crear doctor' };
    }
}

export async function updateDoctorAction(id: string, prevState: any, formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { error: 'No estás autenticado. Por favor inicia sesión nuevamente.' };
        }

        const nombre = formData.get('nombre') as string;
        const especialidad = formData.get('especialidad') as string;
        const telefono = formData.get('telefono') as string | null;

        if (!nombre || !especialidad) {
            return { error: 'Nombre y especialidad son requeridos' };
        }

        await updateDoctor(id, {
            nombre,
            especialidad,
            telefono: telefono || undefined
        });

        revalidatePath('/dashboard/doctores');
        redirect('/dashboard/doctores');
    } catch (error) {
        console.error('Error updating doctor:', error);
        return { error: error instanceof Error ? error.message : 'Error al actualizar doctor' };
    }
}

export async function deleteDoctorAction(id: string) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error('No estás autenticado');
        }

        await deleteDoctor(id);
        revalidatePath('/dashboard/doctores');
    } catch (error) {
        console.error('Error deleting doctor:', error);
        throw new Error(error instanceof Error ? error.message : 'Error al eliminar doctor');
    }
}

// --- Citas Actions ---

export async function createCitaAction(prevState: any, formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { error: 'No estás autenticado. Por favor inicia sesión nuevamente.' };
        }

        const doctor_id = formData.get('doctor_id') as string;
        const paciente_id = formData.get('paciente_id') as string;
        const fecha = formData.get('fecha') as string;
        const hora = formData.get('hora') as string;
        const estado = 'pendiente';

        console.log('📝 Creating cita:', { doctor_id, paciente_id, fecha, hora });

        if (!doctor_id || !paciente_id || !fecha || !hora) {
            return { error: 'Todos los campos son requeridos' };
        }

        await createCita({ doctor_id, paciente_id, fecha, hora, estado });
        revalidatePath('/dashboard/citas');
        redirect('/dashboard/citas');
    } catch (error) {
        console.error('❌ Error creating cita:', error);
        return { error: error instanceof Error ? error.message : 'Error al crear cita' };
    }
}

export async function updateCitaAction(id: string, prevState: any, formData: FormData) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { error: 'No estás autenticado. Por favor inicia sesión nuevamente.' };
        }

        const doctor_id = formData.get('doctor_id') as string;
        const paciente_id = formData.get('paciente_id') as string;
        const fecha = formData.get('fecha') as string;
        const hora = formData.get('hora') as string;
        const estado = formData.get('estado') as 'pendiente' | 'confirmada' | 'cancelada' | 'atendida';

        if (!doctor_id || !paciente_id || !fecha || !hora || !estado) {
            return { error: 'Todos los campos son requeridos' };
        }

        await updateCita(id, { doctor_id, paciente_id, fecha, hora, estado });
        revalidatePath('/dashboard/citas');
        redirect('/dashboard/citas');
    } catch (error) {
        console.error('Error updating cita:', error);
        return { error: error instanceof Error ? error.message : 'Error al actualizar cita' };
    }
}

export async function deleteCitaAction(id: string) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error('No estás autenticado');
        }

        await deleteCita(id);
        revalidatePath('/dashboard/citas');
    } catch (error) {
        console.error('Error deleting cita:', error);
        throw new Error(error instanceof Error ? error.message : 'Error al eliminar cita');
    }
}
