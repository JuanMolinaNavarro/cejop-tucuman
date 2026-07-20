import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getEncuentro, getFormularioPublicado } from "@/lib/forms/queries";
import RenderizadorFormulario from "../../inscribite/RenderizadorFormulario";

export const metadata = {
  title: "Feedback | CEJOP Tucumán",
  description: "Contanos tu experiencia en el encuentro de CEJOP Tucumán.",
};

const LOGO =
  "https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png";

export default async function FeedbackPage({ params }) {
  const { id } = await params;
  const encuentro = await getEncuentro(id);
  const formulario =
    encuentro && encuentro.encuestas_activas
      ? await getFormularioPublicado(id, "feedback")
      : null;
  const abierto = Boolean(encuentro?.encuestas_activas && formulario);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#1a1a2e] text-white py-24 md:py-32 flex flex-col justify-center">
        <div className="section-container max-w-3xl">
          <div className="mb-10 text-center">
            <Link href="/" className="inline-block mb-6 relative w-36 h-10">
              <img
                alt="CEJOP Tucumán"
                className="object-contain w-full h-full"
                src={LOGO}
              />
            </Link>
            <h1 className="font-montserrat font-black text-3xl md:text-4xl text-white uppercase tracking-tight">
              {abierto ? formulario.titulo : "Feedback"}
            </h1>
            <p className="font-source text-white/60 mt-2">
              {encuentro?.nombre ?? "CEJOP Tucumán"}
            </p>
          </div>

          {abierto ? (
            <RenderizadorFormulario formulario={formulario} tipo="feedback" />
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-12 text-center shadow-2xl">
              <h2 className="font-montserrat font-bold text-xl text-cejop-blue-light mb-3">
                La encuesta no está disponible
              </h2>
              <p className="font-source text-white/60 leading-relaxed mb-8 max-w-md mx-auto">
                En este momento no hay una encuesta de feedback abierta para este
                encuentro.
              </p>
              <Link href="/" className="btn-primary-bw text-xs px-8 py-4 inline-flex">
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
