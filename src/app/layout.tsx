import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"], weight: ["300","500","700"],
  style: ["normal","italic"], variable: "--font-fraunces", display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"], weight: ["400","500","600"],
  variable: "--font-dm", display: "swap",
});

export const metadata: Metadata = {
  title: "Associação Allos — Transformando Talentos em Legado",
  description: "Excelência clínica, formação profissional e projetos sociais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Ir para o conteúdo principal</a>
        {children}
      </body>
    </html>
  );
}
