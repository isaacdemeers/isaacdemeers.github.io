import { Bricolage_Grotesque, Kalnia, Poppins } from "next/font/google";

const bricolage = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-bricolage",
});
const kalnia = Kalnia({
    subsets: ["latin"],
    variable: "--font-kalnia",
});
const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-poppins",
    weight: ["400", "500", "600", "700"],
    style: ["italic", "normal"],
});

export { bricolage, kalnia, poppins };