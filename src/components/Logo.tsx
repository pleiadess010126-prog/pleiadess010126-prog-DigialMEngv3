'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    showTagline?: boolean;
    linkToHome?: boolean;
    className?: string;
    darkMode?: boolean;
}

const sizeMap = {
    sm: { logo: 32, text: 'text-lg' },
    md: { logo: 40, text: 'text-xl' },
    lg: { logo: 56, text: 'text-2xl' },
    xl: { logo: 80, text: 'text-3xl' },
};

export default function Logo({
    size = 'md',
    showText = true,
    showTagline = false,
    linkToHome = true,
    className = '',
    darkMode = false,
}: LogoProps) {
    const dimensions = sizeMap[size];

    const content = (
        <div className={`flex items-center gap-3 ${className}`}>
            <Image
                src="/logo.jpg"
                alt="DigitalMEng Logo"
                width={dimensions.logo}
                height={dimensions.logo}
                className="object-contain rounded-lg"
                priority
            />
            {showText && !darkMode && (
                <div className="flex flex-col">
                    <span className={`font-bold ${dimensions.text} ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        Digital<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">MEng</span>
                    </span>
                    {showTagline && (
                        <span className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                            Organic Digital Marketing Engine
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    if (linkToHome) {
        return (
            <Link href="/" className="inline-flex">
                {content}
            </Link>
        );
    }

    return content;
}
