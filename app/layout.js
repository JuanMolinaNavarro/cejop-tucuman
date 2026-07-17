import { Montserrat, Encode_Sans_Condensed, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const encodeSansCondensed = Encode_Sans_Condensed({
  variable: "--font-encode",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "CEJOP Tucumán | Formación política para jóvenes",
  description: "CEJOP Tucumán es el espacio de formación política e institucional que conecta jóvenes de 18 a 30 años con los espacios donde se toman las decisiones. Plural, federal y formativo.",
  keywords: "CEJOP,Tucumán,formación política,jóvenes,Argentina,escuela de política,instituciones,liderazgo joven,participación ciudadana",
  openGraph: {
    title: "CEJOP Tucumán | Formación política para jóvenes",
    description: "Un espacio serio, accesible y plural para jóvenes que quieren entender cómo funciona el Estado, la política y la sociedad.",
    url: "https://cejoptucuman.com",
    siteName: "CEJOP Tucumán",
    locale: "es_AR",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es-AR"
      className={`${montserrat.variable} ${encodeSansCondensed.variable} ${sourceSans3.variable} scroll-smooth h-full`}
    >
      <body className="antialiased bg-white text-[#1a1a2e] min-h-full flex flex-col font-source">
        {children}
      </body>
    </html>
  );
}
