import Image from "next/image";
import { bricolage, kalnia } from "@/lib/fonts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    // <div className="flex flex-col items-center justify-center h-screen">
    //   <h1 className="text-4xl font-bricolage text-clr-lightest">Hello World</h1>
    //   <button className={`${kalnia.className} bg-clr-light`}>Click me</button>
    // </div>

    <section className="flex flex-col items-center justify-evenly h-screen w-screen bg-gradient-background">
      <h3 className={`${bricolage.className} text-sm uppercase text-clr-lightest`}>Isaac DEMEERSEMAN // 2024</h3>

      <div className="flex flex-col gap-10 items-center justify-center">
        <h1 className={`${kalnia.className} text-8xl text-clr-lightest`}>Portfolio.</h1>
        <div className="w-full h-1 filter blur-md rounded-[50%] bg-black opacity-10 py-4">
        </div>
      </div>

      <Link href="/projects">
        <Button className={`${bricolage.className} bg-clr-lightest uppercase text-clr-darkest text-lg`}>DISCOVER</Button>
      </Link>
    </section >
  );
}
