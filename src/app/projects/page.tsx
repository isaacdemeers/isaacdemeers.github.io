
import SideNav from "@/components/sideNav/sideNav";

export default function Home() {
  return (
    // <div className="flex flex-col items-center justify-center h-screen">
    //   <h1 className="text-4xl font-bricolage text-clr-lightest">Hello World</h1>
    //   <button className={`${kalnia.className} bg-clr-light`}>Click me</button>
    // </div>

    <section className="flex items-center gap-4 justify-evenly p-4 h-screen w-screen ">
      <SideNav />

      <section className="w-full h-full bg-clr-dark rounded-lg">d</section>
    </section >
  );
}
