import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Info,
  ArrowUpRight,
  Rocket,
  Pencil,
  XCircle,
  FileText,
  ShieldCheck,
  Clock,
  HeadphonesIcon,
  CheckCircle2,
} from "lucide-react";
import { MeiLogo } from "@/components/MeiLogo";
import { ServiceChoiceDialog } from "@/components/ServiceChoiceDialog";
import { WhatsAppCta } from "@/components/WhatsAppCta";

export const Route = createFileRoute("/")({
  component: Home,
});

const services = [
  { id: "abrir", title: "Abrir MEI" },
  { id: "alterar", title: "Mudar Dados" },
  { id: "baixar", title: "Baixar MEI" },
  { id: "declarar", title: "Declaração" },
] as const;

const serviceDetails = [
  {
    id: "abrir",
    fullTitle: "Abrir MEI",
    icon: Rocket,
    tagline: "Sua empresa pronta em até 24 horas.",
    description:
      "A abertura da MEI envolve cadastro do CNPJ, escolha das atividades (CNAEs), definição do nome fantasia e emissão do Certificado MEI. Parece simples, mas escolher a atividade errada pode te impedir de emitir nota fiscal ou pagar imposto a mais.",
    bullets: [
      "Análise das atividades certas para o seu negócio",
      "Cadastro completo no Portal do Empreendedor",
      "Emissão do Certificado MEI (CCMEI)",
      "Orientação sobre o DAS mensal",
    ],
  },
  {
    id: "alterar",
    fullTitle: "Mudar Dados da MEI",
    icon: Pencil,
    tagline: "Mantenha seu cadastro 100% em dia.",
    description:
      "Mudou de endereço? Quer adicionar uma nova atividade? Trocou de telefone? Toda alteração precisa ser feita no sistema da Receita — e qualquer dado desatualizado pode gerar multa ou bloqueio do CNPJ.",
    bullets: [
      "Alteração de endereço comercial",
      "Inclusão ou exclusão de atividades (CNAEs)",
      "Atualização de nome fantasia, telefone e e-mail",
      "Revisão completa do cadastro antes de enviar",
    ],
  },
  {
    id: "baixar",
    fullTitle: "Baixar MEI",
    icon: XCircle,
    tagline: "Encerre sem deixar dívidas para trás.",
    description:
      "Não está mais usando o CNPJ? É essencial fazer a baixa corretamente. MEI parada continua acumulando DAS, multas e podendo ir para a dívida ativa. A baixa encerra tudo de forma definitiva e regular.",
    bullets: [
      "Verificação de pendências antes da baixa",
      "Encerramento oficial do CNPJ MEI",
      "Orientação sobre a Declaração de Extinção",
      "Confirmação por escrito da baixa concluída",
    ],
  },
  {
    id: "declarar",
    fullTitle: "Declaração de MEI (DASN-SIMEI)",
    icon: FileText,
    tagline: "A obrigação anual que ninguém pode esquecer.",
    description:
      "Toda MEI precisa entregar a DASN-SIMEI uma vez por ano, declarando o faturamento do ano anterior. Sem ela, sua MEI fica irregular, gera multa e pode até perder o CNPJ. É rápido — quando feito por quem entende.",
    bullets: [
      "Cálculo do faturamento anual",
      "Envio da DASN-SIMEI dentro do prazo",
      "Comprovante oficial guardado para você",
      "Alerta para a próxima declaração",
    ],
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
    <div className="bg-[color:var(--color-navy-deep)]">
      {/* ============ HERO — TELA INTEIRA NAVY (NÃO MEXER) ============ */}
      <div className="min-h-screen">
        {/* Aviso superior em cápsula flutuante */}
        <div className="px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2.5 rounded-full border border-cream/10 bg-cream/[0.04] px-5 py-2.5 text-center text-[12px] text-cream/85 backdrop-blur-sm sm:text-[13px]">
            <Info className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-amarelo)]" />
            <span>
              Este é um{" "}
              <strong className="font-semibold text-cream">
                serviço privado
              </strong>
              , independente da Receita Federal e do gov.br.
            </span>
          </div>
        </div>

        <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col px-6 pb-12 pt-12 sm:pt-16">
          {/* LOGO */}
          <div className="flex justify-center">
            <MeiLogo size="lg" tone="cream" />
          </div>

          {/* 4 BOTÕES — HORIZONTAIS */}
          <div className="flex flex-1 flex-col items-center justify-center py-16 sm:py-20">
            <div className="grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openService(s.title)}
                  className="group relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-2xl border border-cream/15 bg-cream/[0.03] px-5 py-6 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cream/40 hover:bg-cream/[0.08] sm:min-h-[160px] sm:px-6 sm:py-7"
                >
                  <ArrowUpRight className="h-5 w-5 text-cream/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--color-amarelo)]" />
                  <span className="font-display text-[19px] font-bold leading-tight text-cream sm:text-[22px]">
                    {s.title}
                  </span>
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

            {/* WHATSAPP */}
            <div className="mt-12">
              <WhatsAppCta variant="ghost-cream" />
            </div>
          </div>

          {/* RODAPÉ HERO */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cream/40">
              role para baixo
            </p>
            <div className="mt-1 h-6 w-px bg-cream/20" aria-hidden />
          </div>
        </main>
      </div>

      {/* ============ DIFERENCIAL ============ */}
      <section className="border-t border-cream/10 bg-[color:var(--color-navy)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
            <div className="lg:max-w-[200px]">
              <span
                className="block h-[3px] w-12 rounded-sm"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-verde-br) 0 50%, var(--color-amarelo) 50% 100%)",
                }}
                aria-hidden
              />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream/50">
                Por que existimos
              </p>
            </div>
            <h2 className="font-display text-3xl font-bold leading-[1.1] text-cream sm:text-4xl lg:text-[44px]">
              Estamos aqui para você trabalhar em paz. Cuidamos da burocracia
              com transparência e honestidade — sem precisar se preocupar
              com a Receita Federal.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "100% transparente",
                text: "Não nos passamos pelo gov.br. Você sabe exatamente o que está contratando.",
              },
              {
                icon: Clock,
                title: "Tudo em até 24h",
                text: "Processo ágil, sem fila, sem burocracia desnecessária — e sem você sair de casa.",
              },
              {
                icon: HeadphonesIcon,
                title: "Contador de verdade",
                text: "Especialistas em MEI que falam direto com você pelo WhatsApp.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-7"
              >
                <Icon className="h-6 w-6 text-[color:var(--color-amarelo)]" />
                <h3 className="mt-5 font-display text-lg font-bold text-cream">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DETALHES DOS SERVIÇOS ============ */}
      <section className="bg-cream text-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mb-16 max-w-2xl">
            <span className="risquinho mb-5" aria-hidden />
            <h2 className="font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl">
              O que cada serviço resolve
            </h2>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              Quatro coisas. Sem termos técnicos, sem letras miúdas.
              Em português que qualquer pessoa entende.
            </p>
          </div>

          <div className="space-y-4">
            {serviceDetails.map((s, i) => {
              const Icon = s.icon;
              return (
                <article
                  key={s.id}
                  className="group grid gap-6 rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:border-[color:var(--color-navy)] hover:shadow-[0_20px_50px_-20px_rgba(7,27,51,0.18)] sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-10 sm:p-10"
                >
                  {/* Número + ícone */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-6">
                    <span className="font-display text-5xl font-bold text-[color:var(--color-verde-br)]/30 sm:text-6xl">
                      0{i + 1}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--color-navy)] text-cream sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground sm:text-[28px]">
                      {s.fullTitle}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[color:var(--color-verde-br)] sm:text-base">
                      {s.tagline}
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                      {s.description}
                    </p>
                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-sm text-foreground/85"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-verde-br)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => openService(s.fullTitle)}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[color:var(--color-navy)] px-6 py-3 text-sm font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-[color:var(--color-navy-deep)] sm:self-center"
                  >
                    Começar
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </article>
              );
            })}
          </div>

          {/* CTA final */}
          <div className="mt-20 flex flex-col items-center gap-5 rounded-3xl border border-border bg-background px-6 py-14 text-center">
            <span className="risquinho" aria-hidden />
            <h3 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Ainda em dúvida?
            </h3>
            <p className="max-w-md text-base text-muted-foreground">
              Fale com um contador especialista pelo WhatsApp.
              Sem custo, sem compromisso, sem robô.
            </p>
            <div className="mt-2">
              <WhatsAppCta />
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[color:var(--color-navy-deep)] text-cream/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <MeiLogo size="sm" tone="cream" />
            <p className="mt-5 max-w-xs text-xs leading-relaxed text-cream/50">
              mei é uma assessoria privada e independente. Não somos a
              Receita Federal nem o Portal do Empreendedor (gov.br).
              Você sempre pode abrir, alterar ou baixar sua MEI
              gratuitamente pelo site oficial.
            </p>
          </div>
          <div className="text-xs text-cream/40 sm:text-right">
            © {new Date().getFullYear()} mei · Todos os direitos reservados
          </div>
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
