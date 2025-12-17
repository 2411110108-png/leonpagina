'use client';

import LogoutButton from '@/components/LogoutButton';

export default function Header() {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 transition-all">
            {/* Left: Title/Breadcrumbs */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search patients..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-teal-100 focus:bg-white transition-all outline-none text-gray-600 placeholder-gray-400"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Notifications */}
                <button className="relative w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-100"></div>

                {/* User Profile / Logout */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-700">Dr. User</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase">Admin</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm">
                        DR
                    </div>
                    <div className="ml-2">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
