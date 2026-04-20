import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: string | null;
};

export function ServiceChoiceDialog({ open, onOpenChange, service }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-card p-0 overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        <div className="overflow-y-auto p-6 sm:p-10">
          <DialogHeader className="space-y-3 text-left">
            <span
              className="block h-[3px] w-10 rounded-sm"
              style={{
                background:
                  "linear-gradient(to right, var(--color-verde-br) 0 50%, var(--color-amarelo) 50% 100%)",
              }}
              aria-hidden
            />
            <DialogTitle className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
              {service ?? "Escolha como prefere seguir"}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Você pode fazer sozinho pelo site oficial do governo ou deixar
              com um contador especialista em MEI, que cuida de tudo com
              segurança para nada dar errado.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* Opção 1: sozinho */}
            <div className="flex flex-col rounded-2xl border border-border bg-background p-6">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Faça você mesmo
              </span>
              <p className="mt-3 font-display text-2xl text-foreground">
                Grátis
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Te mostramos o passo a passo no site oficial gov.br. Sem custo.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-foreground/80">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-[color:var(--color-verde-br)] shrink-0 mt-0.5" />
                  Tutorial guiado
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-[color:var(--color-verde-br)] shrink-0 mt-0.5" />
                  100% no site do governo
                </li>
              </ul>
              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={() => onOpenChange(false)}
              >
                Quero fazer sozinho
              </Button>
            </div>

            {/* Opção 2: contador */}
            <div className="relative flex flex-col rounded-2xl border-2 border-[color:var(--color-navy)] bg-[color:var(--color-navy)] p-6 text-cream">
              <span className="absolute -top-3 right-4 rounded-full bg-[color:var(--color-amarelo)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-navy-deep)]">
                Recomendado
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-cream/70">
                Com contador especialista
              </span>
              <p className="mt-3 font-display text-2xl">
                R$ 149,90
                <span className="ml-1 text-sm text-cream/70">
                  em até 3x no cartão
                </span>
              </p>
              <p className="mt-2 text-sm text-cream/80">
                Um contador faz tudo certo, do início ao fim. Sem dor de cabeça.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-cream/90">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-[color:var(--color-amarelo)] shrink-0 mt-0.5" />
                  Abertura sem erros
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-[color:var(--color-amarelo)] shrink-0 mt-0.5" />
                  Suporte humano
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-[color:var(--color-amarelo)] shrink-0 mt-0.5" />
                  Pronto em até 24h
                </li>
              </ul>
              <Button
                className="mt-6 w-full bg-cream text-[color:var(--color-navy-deep)] hover:bg-cream/90"
                onClick={() => onOpenChange(false)}
              >
                Quero o contador
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Este é um serviço privado, independente da Receita Federal e do gov.br.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
