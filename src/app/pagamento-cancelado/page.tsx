import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { XCircle } from "lucide-react";

export const metadata = {
  title: "Pagamento Cancelado | Allos",
  description: "O pagamento foi cancelado.",
};

export default function PagamentoCanceladoPage() {
  return (
    <>
      <NavBar />
      <main
        id="main-content"
        className="min-h-screen flex items-center justify-center bg-charcoal text-cream px-6"
      >
        <div className="max-w-lg text-center space-y-6">
          <XCircle className="mx-auto h-20 w-20 text-accent" strokeWidth={1.5} />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">
            Pagamento cancelado
          </h1>
          <p className="text-cream/70 text-lg leading-relaxed">
            O pagamento não foi concluído. Nenhum valor foi cobrado.
          </p>
          <p className="text-cream/50 text-sm">
            Se houve algum problema, entre em contato conosco pelo{" "}
            <a
              href="https://wa.me/5531999999999"
              className="underline hover:text-cream transition-colors"
            >
              WhatsApp
            </a>{" "}
            ou pelo e-mail{" "}
            <a
              href="mailto:contato@allos.org.br"
              className="underline hover:text-cream transition-colors"
            >
              contato@allos.org.br
            </a>
            .
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-8 py-3 bg-sage/20 hover:bg-sage/30 border border-sage/40 rounded-full text-cream font-medium transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
