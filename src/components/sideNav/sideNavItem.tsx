import { bricolage } from "@/lib/fonts"

export default function SideNavItem(page: any) {
    return (
        <li className={`${bricolage.className} cursor-pointer text-clr-lightest font-medium text-base py-1 px-2 rounded-lg hover:bg-clr-medium  transition-all duration-100`}>{page.page}</li>
    )
}