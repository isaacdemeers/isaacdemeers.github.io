
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { bricolage, poppins } from '@/lib/fonts'
import Link from 'next/link'

export default function SideNavBack() {
    return (
        <Link href="/" className=" group rounded-lg py-1 pr-3 flex flex-row h-fit items-center justify-center gap-4 mb-4">
            <ArrowLeft className=" w-6 h-6 text-clr-lightest group-hover:translate-x-1 transition-transform duration-300" />
            <div className="flex flex-col items-start text-clr-lightest  py-1 justify-center">
                <h1 className={`${bricolage.className} text-base uppercase`}>Back</h1>
                <h1 className={`${poppins.className} italic text-xs font-light uppercase`}>Accueil</h1>

            </div>
        </Link>
    )
}