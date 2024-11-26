import { Bricolage_Grotesque, Kalnia } from "next/font/google";

const bricolage = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-bricolage",
});
const kalnia = Kalnia({
    subsets: ["latin"],
    variable: "--font-kalnia",
});

export { bricolage, kalnia };