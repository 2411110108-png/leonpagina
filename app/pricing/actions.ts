'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function subscribeToPlanAction(planId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Usuario no autenticado');
    }

    // Insert or Update the subscription
    // We use upsert based on user_id to ensure one active subscription per user (simple MVP logic)
    const { error } = await supabase
        .from('subscriptions')
        .upsert(
            {
                user_id: user.id,
                plan: planId,
                status: 'active',
                current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                created_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
        );

    if (error) {
        console.error('Error creating subscription:', error);
        throw new Error('No se pudo procesar la suscripción');
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}
