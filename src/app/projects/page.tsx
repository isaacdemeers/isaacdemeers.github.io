
import SideNav from "@/components/sideNav/sideNav";

export default function Home() {
  return (
    // <div className="flex flex-col items-center justify-center h-screen">
    //   <h1 className="text-4xl font-bricolage text-clr-lightest">Hello World</h1>
    //   <button className={`${kalnia.className} bg-clr-light`}>Click me</button>
    // </div>
    <section className="flex p-4 items-center justify-center w-screen h-screen">


      <div className="flex items-center bg-clr-dark  justify-evenly rounded-3xl h-full w-full ">
        <SideNav />

        <section className="w-full flex flex-col items-end  bg-clr-darker justify-center  h-full rounded-3xl">
          <div className=" h-20  w-[calc(100%+4rem)] bg-clr-dark rounded-l-3xl">

            <div className="h-full w-full bg-clr-darker rounded-3xl">

            </div>

          </div>
          <main className="w-full h-full bg-clr-dark rounded-tl-3xl pt-3 pl-3">
            <div className="w-full h-full bg-clr-darker rounded-3xl rounded-tl-2xl ">

            </div>
          </main>
        </section>


      </div >
    </section>
  );
}
