'use client';

import { useRouter } from 'next/navigation';
import InfluencerDiscovery from '@/components/InfluencerDiscovery';
import Image from 'next/image';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function InfluencerDiscoveryPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 text-white px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/logo.jpg"
                            alt="DigitalMEng Logo"
                            width={44}
                            height={44}
                            className="object-contain"
                            priority
                        />
                        <div>
                            <h1 className="text-xl font-bold">Influencer Discovery</h1>
                            <p className="text-sm text-white/60">Find & connect with creators</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-8 py-6">
                <InfluencerDiscovery />
            </div>
        </div>
    );
}
