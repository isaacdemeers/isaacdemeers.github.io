import { bricolage } from "@/lib/fonts";
import SideNavItem from "./sideNavItem";

export default function SideNavList(page: any) {
    let data = page.page;
    return (
        data.map((page: any) => (
            <section key={page.title} className="flex flex-col items-start justify-center w-full mb-2 gap- ">
                <div className="flex flex-row items-center justify-center gap-4">
                    {/* Render the icon as a React element */}
                    <page.icon className="w-6 h-6 text-clr-lightest" />
                    <h1 className={`${bricolage.className} font-semibold h-full  uppercase text-clr-lightest text-xl text-ellipsis w-full`}>
                        {page.title}
                    </h1>
                </div>

                <ul className="flex flex-col items-start justify-center w-full gap-4  p-2">
                    {page.pages.map((subPage: string) => (
                        <SideNavItem key={subPage} page={subPage} />

                    ))}
                </ul>
            </section>
        ))
    );
}