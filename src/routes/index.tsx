import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Info, ArrowRight } from "lucide-react";
import { MeiLogo } from "@/components/MeiLogo";
import { ServiceChoiceDialog } from "@/components/ServiceChoiceDialog";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import heroImg from "@/assets/hero-mei.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
};

const services: Service[] = [
  {
    id: "abrir",
    title: "Abrir MEI",
    short: "Comece sua empresa hoje",
    description:
      "Cadastro do CNPJ, escolha das atividades, definição do nome fantasia e emissão do Certificado MEI. Em até 24 horas você está com sua empresa aberta — pronta para emitir nota fiscal.",
  },
  {
    id: "alterar",
    title: "Mudar Dados da MEI",
    short: "Atualize endereço, atividades, nome",
    description:
      "Atualize endereço, nome fantasia, telefone, e-mail ou suas atividades (CNAEs). Mantemos seu cadastro 100% em dia para você não ter problemas com a Receita.",
  },
  {
    id: "baixar",
    title: "Baixar MEI",
    short: "Encerre sua empresa corretamente",
    description:
      "Encerramento (baixa) do CNPJ MEI feito do jeito certo, evitando dívidas futuras e cobranças indevidas. Cuidamos de toda a parte burocrática para você.",
  },
  {
    id: "declarar",
    title: "Declaração de MEI",
    short: "DASN-SIMEI sem dor de cabeça",
    description:
      "Entrega da declaração anual obrigatória (DASN-SIMEI). Sem ela, sua MEI fica irregular e pode perder o CNPJ. Fazemos por você, com revisão completa.",
  },
];

function Home() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);

  const openService = (title: string) => {
    setActiveService(title);
    setOpenDialog(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Aviso de transparência — aparece antes de tudo */}
      <div className="border-b border-border/60 bg-[color:var(--color-navy)] text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-[13px]">
          <Info className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-amarelo)]" />
          <span className="text-cream/90">
            Este é um <strong className="font-semibold">serviço privado</strong>
            , independente da Receita Federal e do gov.br.
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <MeiLogo size="sm" />
        <WhatsAppCta variant="inline" className="hidden sm:inline-flex" />
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-6 sm:pt-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Esquerda: título + 4 botões + whatsapp */}
          <div>
            <span className="risquinho mb-6" aria-hidden />
            <h1 className="font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-[64px]">
              Sua MEI,
              <br />
              sem enrolação.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              Escolha o que você precisa. A gente te explica tudo em
              português claro — e você decide se faz sozinho ou com um
              contador.
            </p>

            {/* 4 botões — o coração da home */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-lg">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openService(s.title)}
                  className="group flex flex-col items-start rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-navy)] hover:shadow-[0_12px_30px_-12px_rgba(7,27,51,0.18)]"
                >
                  <span className="font-display text-lg text-foreground sm:text-xl">
                    {s.title}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {s.short}
                  </span>
                  <ArrowRight className="mt-4 h-4 w-4 text-[color:var(--color-verde-br)] transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>

            <div className="mt-8">
              <WhatsAppCta />
            </div>
          </div>

          {/* Direita: imagem */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-cream">
              <img
                src={heroImg}
                alt="Empreendedora brasileira em sua pequena empresa"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-background p-4 shadow-lg sm:block"
              aria-hidden
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[color:var(--color-verde-br)]" />
                <div className="text-xs">
                  <div className="font-semibold text-foreground">
                    Transparente
                  </div>
                  <div className="text-muted-foreground">
                    Sem se passar pelo governo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAL — separador editorial */}
      <section className="border-y border-border bg-[color:var(--color-navy)] text-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-end">
            <div>
              <span
                className="block h-[3px] w-10 rounded-sm"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-verde-br) 0 50%, var(--color-amarelo) 50% 100%)",
                }}
                aria-hidden
              />
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-cream/60">
                Por que existimos
              </p>
            </div>
            <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">
              A maioria dos sites de MEI imita o governo. A gente não.
              Aqui, tudo é claro: o que é gratuito, o que custa, e por quê.
            </h2>
          </div>
        </div>
      </section>

      {/* DETALHES DOS SERVIÇOS — rolagem */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mb-16 max-w-2xl">
          <span className="risquinho mb-5" aria-hidden />
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            O que cada serviço resolve
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Quatro coisas. Sem termos técnicos, sem letras miúdas.
          </p>
        </div>

        <div className="space-y-px overflow-hidden rounded-3xl border border-border bg-card">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="grid gap-6 bg-card p-8 transition-colors hover:bg-secondary sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 sm:p-10"
            >
              <div className="font-display text-3xl text-[color:var(--color-verde-br)] sm:w-16">
                0{i + 1}
              </div>
              <div>
                <h3 className="font-display text-2xl text-foreground sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  {s.description}
                </p>
              </div>
              <button
                onClick={() => openService(s.title)}
                className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-[color:var(--color-navy)] hover:bg-[color:var(--color-navy)] hover:text-cream sm:self-center"
              >
                Começar
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="font-display text-2xl text-foreground sm:text-3xl">
            Ainda em dúvida?
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Fale com um contador especialista pelo WhatsApp. Sem custo,
            sem compromisso.
          </p>
          <WhatsAppCta />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-[color:var(--color-navy-deep)] text-cream/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <MeiLogo size="sm" tone="cream" />
          <p className="text-xs text-cream/60 sm:max-w-md sm:text-right">
            mei é uma assessoria privada e independente. Não somos a
            Receita Federal nem o Portal do Empreendedor (gov.br). Você
            sempre pode abrir, alterar ou baixar sua MEI gratuitamente
            pelo site oficial.
          </p>
        </div>
      </footer>

      <ServiceChoiceDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        service={activeService}
      />
    </div>
  );
}
