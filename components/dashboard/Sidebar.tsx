'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Sidebar() {
    const pathname = usePathname();
    const supabase = createClient();
    const [subscription, setSubscription] = useState<{ plan: string; current_period_end: string } | null>(null);

    useEffect(() => {
        const fetchSub = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('subscriptions')
                    .select('plan, current_period_end')
                    .eq('user_id', user.id)
                    .eq('status', 'active')
                    .single();
                setSubscription(data);
            }
        };
        fetchSub();
    }, [supabase]);

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    const menuItems = [
        {
            name: 'Panel de Control',
            href: '/dashboard',
            icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
        },
        {
            name: 'Citas',
            href: '/dashboard/citas',
            createHref: '/dashboard/citas/nuevo',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        },
        {
            name: 'Pacientes',
            href: '/dashboard/pacientes',
            createHref: '/dashboard/pacientes/nuevo',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
        },
        {
            name: 'Doctores',
            href: '/dashboard/doctores',
            createHref: '/dashboard/doctores/nuevo',
            icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
        },
    ];

    const reportItems = [
        { name: 'Indicadores', href: '#', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', locked: true },
        { name: 'Facturación', href: '#', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', locked: true },
    ];

    const hasAccess = subscription && (subscription.plan === 'professional' || subscription.plan === 'enterprise');

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-[2px_0_20px_rgba(0,0,0,0.02)] z-20">
            {/* Brand */}
            <div className="h-16 flex items-center px-8 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 mr-3 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-teal-200/50">
                    G
                </div>
                <span className="text-gray-800 font-bold text-lg tracking-tight">Gemgloo</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</p>
                {menuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <div
                            key={item.href}
                            className={`group flex items-center justify-between rounded-xl px-2 transition-all duration-200 ${active ? 'bg-teal-50/80' : 'hover:bg-gray-50'
                                }`}
                        >
                            <Link
                                href={item.href}
                                className={`flex flex-1 items-center gap-3 px-2 py-3 ${active ? 'text-teal-600 font-medium' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <svg
                                    className={`w-5 h-5 transition-colors ${active ? 'text-teal-500' : 'text-gray-400 group-hover:text-gray-600'
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.name}
                            </Link>

                            {item.createHref && (
                                <Link
                                    href={item.createHref}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${active
                                            ? 'text-teal-600 hover:bg-teal-100'
                                            : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-teal-600 hover:shadow-sm'
                                        }`}
                                    title={`Crear ${item.name}`}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    );
                })}

                <div className="mt-8 mb-2 px-4 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reports</p>
                    {!hasAccess && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">PRO</span>}
                </div>

                {reportItems.map((item) => (
                    <div
                        key={item.name}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${hasAccess
                            ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-pointer'
                            : 'text-gray-300 cursor-not-allowed opacity-70'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        <span>{item.name}</span>
                        {!hasAccess && (
                            <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        )}
                    </div>
                ))}
            </nav>

            {/* Subscription Status */}
            <div className="p-4 border-t border-gray-50">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100/50">
                    {subscription ? (
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-teal-800 uppercase">{subscription.plan} Plan</span>
                                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            </div>
                            <p className="text-[10px] text-teal-600/80">
                                Renews: {new Date(subscription.current_period_end).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-xs text-gray-600 mb-2">Free Plan</p>
                            <Link href="/pricing" className="block w-full py-1.5 bg-teal-500 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-teal-600 transition-colors">
                                Upgrade Pro
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
