import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Info, ArrowUpRight } from "lucide-react";
import { MeiLogo } from "@/components/MeiLogo";
import { ServiceChoiceDialog } from "@/components/ServiceChoiceDialog";
import { WhatsAppCta } from "@/components/WhatsAppCta";

export const Route = createFileRoute("/")({
  component: Home,
});

const services = [
  { id: "abrir", title: "Abrir MEI" },
  { id: "alterar", title: "Mudar Dados da MEI" },
  { id: "baixar", title: "Baixar MEI" },
  { id: "declarar", title: "Declaração de MEI" },
] as const;

function Home() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);

  const openService = (title: string) => {
    setActiveService(title);
    setOpenDialog(true);
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-navy-deep)]">
      {/* AVISO SUPERIOR — separado por margem do container principal */}
      <div className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2.5 rounded-full border border-cream/10 bg-cream/[0.04] px-5 py-2.5 text-center text-[12px] text-cream/85 backdrop-blur-sm sm:text-[13px]">
          <Info className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-amarelo)]" />
          <span>
            Este é um <strong className="font-semibold text-cream">serviço privado</strong>
            , independente da Receita Federal e do gov.br.
          </span>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL — tela inteira navy */}
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col px-6 pb-12 pt-12 sm:pt-16">
        {/* LOGO */}
        <div className="flex justify-center">
          <MeiLogo size="lg" tone="cream" />
        </div>

        {/* 4 BOTÕES — centro absoluto da página */}
        <div className="flex flex-1 flex-col items-center justify-center py-16 sm:py-20">
          <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => openService(s.title)}
                className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-cream/15 bg-cream/[0.03] px-7 py-6 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cream/40 hover:bg-cream/[0.08]"
              >
                <span className="font-display text-2xl font-medium text-cream sm:text-[26px]">
                  {s.title}
                </span>
                <ArrowUpRight className="h-5 w-5 text-cream/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--color-amarelo)]" />
                {/* faixa decorativa risquinho no hover */}
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{
                    background:
                      "linear-gradient(to right, var(--color-verde-br) 0 50%, var(--color-amarelo) 50% 100%)",
                  }}
                  aria-hidden
                />
              </button>
            ))}
          </div>

          {/* WHATSAPP — abaixo dos botões */}
          <div className="mt-12">
            <WhatsAppCta variant="ghost-cream" />
          </div>
        </div>

        {/* RODAPÉ MINIMALISTA */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-cream/40">
            mei · assessoria privada
          </p>
        </div>
      </main>

      <ServiceChoiceDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        service={activeService}
      />
    </div>
  );
}
