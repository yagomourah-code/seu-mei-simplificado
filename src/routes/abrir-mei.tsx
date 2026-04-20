import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  User,
  Building2,
  ShieldAlert,
  CreditCard,
  PartyPopper,
  Eye,
  EyeOff,
  Lock,
  MessageCircle,
  Calendar,
  FileCheck2,
  Smartphone,
} from "lucide-react";
import { MeiLogo } from "@/components/MeiLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/abrir-mei")({
  head: () => ({
    meta: [
      { title: "Abrir MEI com contador — mei" },
      {
        name: "description",
        content:
          "Abra sua MEI com a ajuda de um contador especialista. Processo guiado em 5 passos, sem complicação.",
      },
      { property: "og:title", content: "Abrir MEI com contador — mei" },
      {
        property: "og:description",
        content:
          "Cadastro guiado em 5 passos. Um contador cuida de tudo pra você abrir sua MEI sem erro.",
      },
    ],
  }),
  component: AbrirMeiPage,
});

// ============ SCHEMAS ============

const cepRegex = /^\d{5}-?\d{3}$/;
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
const phoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

const step1Schema = z.object({
  nomeCompleto: z.string().trim().min(3, "Nome completo obrigatório").max(120),
  cpf: z.string().trim().regex(cpfRegex, "CPF inválido"),
  rg: z.string().trim().min(5, "RG obrigatório").max(20),
  cep: z.string().trim().regex(cepRegex, "CEP inválido"),
  rua: z.string().trim().min(2, "Rua obrigatória").max(150),
  numero: z.string().trim().min(1, "Número obrigatório").max(10),
  complemento: z.string().trim().max(60).optional().or(z.literal("")),
  bairro: z.string().trim().min(2, "Bairro obrigatório").max(80),
  cidade: z.string().trim().min(2, "Cidade obrigatória").max(80),
  uf: z.string().trim().length(2, "UF inválida"),
  mesmoEnderecoMei: z.enum(["sim", "nao"]),
  whatsapp: z.string().trim().regex(phoneRegex, "WhatsApp inválido"),
  email: z.string().trim().email("E-mail inválido").max(120),
});
type Step1 = z.infer<typeof step1Schema>;

const step2BaseSchema = z.object({
  atividade: z
    .string()
    .trim()
    .min(30, "Descreva a atividade com pelo menos 30 caracteres")
    .max(500),
  formaAtuacao: z.enum(["loja", "casa", "online", "ambos"], {
    message: "Selecione a forma de atuação",
  }),
});
const step2WithAddressSchema = step2BaseSchema.extend({
  cep: z.string().trim().regex(cepRegex, "CEP inválido"),
  rua: z.string().trim().min(2, "Rua obrigatória").max(150),
  numero: z.string().trim().min(1, "Número obrigatório").max(10),
  complemento: z.string().trim().max(60).optional().or(z.literal("")),
  bairro: z.string().trim().min(2, "Bairro obrigatório").max(80),
  cidade: z.string().trim().min(2, "Cidade obrigatória").max(80),
  uf: z.string().trim().length(2, "UF inválida"),
});
type Step2 = z.infer<typeof step2WithAddressSchema>;

const step3Schema = z.object({
  senhaGov: z.string().min(6, "Senha gov.br obrigatória").max(80),
  confirmou2fa: z.literal(true, {
    message: "Confirme que você desativou a verificação em duas etapas",
  }),
});
type Step3 = z.infer<typeof step3Schema>;

// ============ MASKS ============
const maskCpf = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskCep = (v: string) =>
  v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
};

// ============ STEPS META ============
const steps = [
  { id: 1, title: "Sócio", short: "Seus dados", icon: User },
  { id: 2, title: "MEI", short: "Sobre a empresa", icon: Building2 },
  { id: 3, title: "gov.br", short: "Acesso", icon: ShieldAlert },
  { id: 4, title: "Pagamento", short: "Investimento", icon: CreditCard },
  { id: 5, title: "Pronto", short: "Próximos passos", icon: PartyPopper },
] as const;

// ============ MAIN ============
function AbrirMeiPage() {
  const [current, setCurrent] = useState(1);
  const [data1, setData1] = useState<Step1 | null>(null);
  const [data2, setData2] = useState<Step2 | null>(null);

  const goNext = () => setCurrent((c) => Math.min(5, c + 1));
  const goBack = () => setCurrent((c) => Math.max(1, c - 1));

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b border-border bg-[color:var(--color-navy-deep)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-cream">
            <MeiLogo size="sm" tone="cream" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-cream/60 transition-colors hover:text-cream"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para o início
          </Link>
        </div>
      </header>

      {/* STEPPER */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Stepper current={current} />
        </div>
      </div>

      {/* CONTENT */}
      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {current === 1 && (
          <Step1Form
            defaultValues={data1 ?? undefined}
            onSubmit={(v) => {
              setData1(v);
              if (v.mesmoEnderecoMei === "sim") {
                setData2((prev) => ({
                  ...(prev ?? {
                    atividade: "",
                    formaAtuacao: "casa",
                  }),
                  cep: v.cep,
                  rua: v.rua,
                  numero: v.numero,
                  complemento: v.complemento ?? "",
                  bairro: v.bairro,
                  cidade: v.cidade,
                  uf: v.uf,
                }) as Step2);
              }
              goNext();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {current === 2 && data1 && (
          <Step2Form
            requireAddress={data1.mesmoEnderecoMei === "nao"}
            defaultValues={data2 ?? undefined}
            onBack={goBack}
            onSubmit={(v) => {
              setData2(v);
              goNext();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {current === 3 && (
          <Step3Form
            onBack={goBack}
            onSubmit={() => {
              goNext();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {current === 4 && (
          <Step4Payment
            onBack={goBack}
            onPaid={() => {
              toast.success("Pagamento confirmado!");
              goNext();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {current === 5 && <Step5Final />}
      </main>
    </div>
  );
}

// ============ STEPPER ============
function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-between gap-2">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = current > s.id;
        const active = current === s.id;
        return (
          <li key={s.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  done &&
                    "border-[color:var(--color-verde-br)] bg-[color:var(--color-verde-br)] text-cream",
                  active &&
                    "border-[color:var(--color-navy)] bg-[color:var(--color-navy)] text-cream shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-navy)_15%,transparent)]",
                  !done && !active && "border-border bg-background text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-wider",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Passo {s.id}
                </p>
                <p
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-foreground" : "text-muted-foreground/80",
                  )}
                >
                  {s.short}
                </p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-1 h-[2px] flex-1 sm:mx-3">
                <div
                  className={cn(
                    "h-full w-full rounded-full transition-all",
                    current > s.id
                      ? "bg-[color:var(--color-verde-br)]"
                      : "bg-border",
                  )}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ============ STEP HEADER ============
function StepHeader({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10">
      <span className="risquinho mb-4 block" aria-hidden />
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        Passo {step} de 5
      </p>
      <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

// ============ FIELD ============
function Field({
  label,
  error,
  children,
  className,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

// ============ STEP 1 ============
function Step1Form({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Step1;
  onSubmit: (v: Step1) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: defaultValues ?? {
      mesmoEnderecoMei: "sim",
      complemento: "",
    },
  });
  const [cepLoading, setCepLoading] = useState(false);
  const cep = watch("cep");

  useEffect(() => {
    const clean = (cep ?? "").replace(/\D/g, "");
    if (clean.length !== 8) return;
    let cancelled = false;
    setCepLoading(true);
    fetch(`https://viacep.com.br/ws/${clean}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.erro) {
          toast.error("CEP não encontrado");
          return;
        }
        setValue("rua", data.logradouro ?? "", { shouldValidate: true });
        setValue("bairro", data.bairro ?? "", { shouldValidate: true });
        setValue("cidade", data.localidade ?? "", { shouldValidate: true });
        setValue("uf", (data.uf ?? "").toUpperCase(), { shouldValidate: true });
      })
      .catch(() => {
        if (!cancelled) toast.error("Erro ao buscar CEP");
      })
      .finally(() => !cancelled && setCepLoading(false));
    return () => {
      cancelled = true;
    };
  }, [cep, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        step={1}
        title="Quem é você?"
        description="Precisamos dos seus dados pessoais para abrir a MEI no seu nome."
      />

      <section className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-lg text-foreground">Dados pessoais</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Nome completo de quem está preenchendo"
            error={errors.nomeCompleto?.message}
            className="sm:col-span-2"
          >
            <Input {...register("nomeCompleto")} placeholder="Ex: João da Silva" />
          </Field>
          <Field label="CPF" error={errors.cpf?.message}>
            <Input
              {...register("cpf")}
              placeholder="000.000.000-00"
              inputMode="numeric"
              onChange={(e) => setValue("cpf", maskCpf(e.target.value), { shouldValidate: true })}
              value={watch("cpf") ?? ""}
            />
          </Field>
          <Field label="RG" error={errors.rg?.message}>
            <Input {...register("rg")} placeholder="MG-12.345.678" />
          </Field>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-lg text-foreground">Endereço residencial</h2>
        <div className="grid gap-5 sm:grid-cols-6">
          <Field label="CEP" error={errors.cep?.message} className="sm:col-span-2">
            <div className="relative">
              <Input
                {...register("cep")}
                placeholder="00000-000"
                inputMode="numeric"
                onChange={(e) => setValue("cep", maskCep(e.target.value), { shouldValidate: true })}
                value={watch("cep") ?? ""}
              />
              {cepLoading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </Field>
          <Field label="Rua" error={errors.rua?.message} className="sm:col-span-4">
            <Input {...register("rua")} placeholder="Preenchido pelo CEP" />
          </Field>
          <Field label="Número" error={errors.numero?.message} className="sm:col-span-2">
            <Input {...register("numero")} placeholder="123" />
          </Field>
          <Field label="Complemento" error={errors.complemento?.message} className="sm:col-span-4">
            <Input {...register("complemento")} placeholder="Apto, bloco, sala (opcional)" />
          </Field>
          <Field label="Bairro" error={errors.bairro?.message} className="sm:col-span-3">
            <Input {...register("bairro")} />
          </Field>
          <Field label="Cidade" error={errors.cidade?.message} className="sm:col-span-2">
            <Input {...register("cidade")} />
          </Field>
          <Field label="UF" error={errors.uf?.message} className="sm:col-span-1">
            <Input
              {...register("uf")}
              maxLength={2}
              className="uppercase"
              onChange={(e) =>
                setValue("uf", e.target.value.toUpperCase(), { shouldValidate: true })
              }
              value={watch("uf") ?? ""}
            />
          </Field>
        </div>

        <div className="rounded-xl border border-border bg-background p-5">
          <p className="text-sm font-medium text-foreground">
            Esse é o mesmo endereço da sua MEI?
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Se sim, vamos usar esse endereço também para o cadastro da empresa.
          </p>
          <RadioGroup
            value={watch("mesmoEnderecoMei")}
            onValueChange={(v) =>
              setValue("mesmoEnderecoMei", v as "sim" | "nao", { shouldValidate: true })
            }
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all",
                watch("mesmoEnderecoMei") === "sim"
                  ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)]/5"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <RadioGroupItem value="sim" />
              <span className="text-sm font-medium">Sim, é o mesmo</span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all",
                watch("mesmoEnderecoMei") === "nao"
                  ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)]/5"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <RadioGroupItem value="nao" />
              <span className="text-sm font-medium">Não, é diferente</span>
            </label>
          </RadioGroup>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-lg text-foreground">Contato</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="WhatsApp" error={errors.whatsapp?.message}>
            <Input
              {...register("whatsapp")}
              placeholder="(00) 90000-0000"
              inputMode="tel"
              onChange={(e) =>
                setValue("whatsapp", maskPhone(e.target.value), { shouldValidate: true })
              }
              value={watch("whatsapp") ?? ""}
            />
          </Field>
          <Field label="E-mail" error={errors.email?.message}>
            <Input {...register("email")} type="email" placeholder="voce@email.com" />
          </Field>
        </div>
      </section>

      <NavButtons nextLabel="Continuar" />
    </form>
  );
}

// ============ STEP 2 ============
function Step2Form({
  requireAddress,
  defaultValues,
  onBack,
  onSubmit,
}: {
  requireAddress: boolean;
  defaultValues?: Step2;
  onBack: () => void;
  onSubmit: (v: Step2) => void;
}) {
  const schema = requireAddress ? step2WithAddressSchema : step2BaseSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step2>({
    resolver: zodResolver(schema as typeof step2WithAddressSchema),
    defaultValues: defaultValues ?? {
      atividade: "",
      formaAtuacao: undefined,
      complemento: "",
    },
  });

  const [cepLoading, setCepLoading] = useState(false);
  const cep = watch("cep" as keyof Step2) as string | undefined;
  const atividade = watch("atividade") ?? "";

  useEffect(() => {
    if (!requireAddress) return;
    const clean = (cep ?? "").replace(/\D/g, "");
    if (clean.length !== 8) return;
    let cancelled = false;
    setCepLoading(true);
    fetch(`https://viacep.com.br/ws/${clean}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || data?.erro) return;
        setValue("rua" as keyof Step2, data.logradouro ?? "", { shouldValidate: true });
        setValue("bairro" as keyof Step2, data.bairro ?? "", { shouldValidate: true });
        setValue("cidade" as keyof Step2, data.localidade ?? "", { shouldValidate: true });
        setValue("uf" as keyof Step2, (data.uf ?? "").toUpperCase(), { shouldValidate: true });
      })
      .catch(() => {})
      .finally(() => !cancelled && setCepLoading(false));
    return () => {
      cancelled = true;
    };
  }, [cep, requireAddress, setValue]);

  const opcoesAtuacao = [
    { v: "casa", label: "Trabalho de casa", hint: "Sem ponto físico para clientes" },
    { v: "loja", label: "Tenho uma loja/sala", hint: "Atendo clientes no local" },
    { v: "online", label: "Só online", hint: "100% digital" },
    { v: "ambos", label: "Loja + online", hint: "Misto" },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        step={2}
        title="Sobre a sua MEI"
        description="Conta pra gente o que a empresa vai fazer e como vai funcionar."
      />

      <section className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-lg text-foreground">Atividade</h2>
        <Field
          label="O que a sua MEI vai fazer?"
          error={errors.atividade?.message}
          hint={`Mínimo de 30 caracteres • ${atividade.length}/500`}
        >
          <Textarea
            {...register("atividade")}
            rows={5}
            placeholder="Ex: Vou vender bolos caseiros e doces para festas, com entrega na cidade. Também faço encomendas para casamentos e aniversários."
            maxLength={500}
          />
        </Field>

        <Field label="Como você vai atuar?" error={errors.formaAtuacao?.message}>
          <RadioGroup
            value={watch("formaAtuacao")}
            onValueChange={(v) =>
              setValue("formaAtuacao", v as Step2["formaAtuacao"], { shouldValidate: true })
            }
            className="grid gap-3 sm:grid-cols-2"
          >
            {opcoesAtuacao.map((o) => (
              <label
                key={o.v}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all",
                  watch("formaAtuacao") === o.v
                    ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)]/5"
                    : "border-border hover:border-foreground/30",
                )}
              >
                <RadioGroupItem value={o.v} className="mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{o.label}</p>
                  <p className="text-xs text-muted-foreground">{o.hint}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </Field>
      </section>

      {requireAddress && (
        <section className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-lg text-foreground">Endereço da MEI</h2>
          <div className="grid gap-5 sm:grid-cols-6">
            <Field label="CEP" error={(errors as any).cep?.message} className="sm:col-span-2">
              <div className="relative">
                <Input
                  {...register("cep" as keyof Step2)}
                  placeholder="00000-000"
                  inputMode="numeric"
                  onChange={(e) =>
                    setValue("cep" as keyof Step2, maskCep(e.target.value), { shouldValidate: true })
                  }
                  value={(watch("cep" as keyof Step2) as string) ?? ""}
                />
                {cepLoading && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>
            </Field>
            <Field label="Rua" error={(errors as any).rua?.message} className="sm:col-span-4">
              <Input {...register("rua" as keyof Step2)} />
            </Field>
            <Field label="Número" error={(errors as any).numero?.message} className="sm:col-span-2">
              <Input {...register("numero" as keyof Step2)} placeholder="123" />
            </Field>
            <Field label="Complemento" className="sm:col-span-4">
              <Input {...register("complemento" as keyof Step2)} placeholder="Opcional" />
            </Field>
            <Field label="Bairro" error={(errors as any).bairro?.message} className="sm:col-span-3">
              <Input {...register("bairro" as keyof Step2)} />
            </Field>
            <Field label="Cidade" error={(errors as any).cidade?.message} className="sm:col-span-2">
              <Input {...register("cidade" as keyof Step2)} />
            </Field>
            <Field label="UF" error={(errors as any).uf?.message} className="sm:col-span-1">
              <Input
                {...register("uf" as keyof Step2)}
                maxLength={2}
                className="uppercase"
                onChange={(e) =>
                  setValue("uf" as keyof Step2, e.target.value.toUpperCase(), {
                    shouldValidate: true,
                  })
                }
                value={(watch("uf" as keyof Step2) as string) ?? ""}
              />
            </Field>
          </div>
        </section>
      )}

      {!requireAddress && (
        <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--color-verde-br)]/30 bg-[color:var(--color-verde-br)]/5 p-5">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-verde-br)]" />
          <p className="text-sm text-foreground/80">
            Vamos usar o mesmo endereço que você informou no passo anterior.
          </p>
        </div>
      )}

      <NavButtons onBack={onBack} nextLabel="Continuar" />
    </form>
  );
}

// ============ STEP 3 ============
function Step3Form({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    defaultValues: { senhaGov: "", confirmou2fa: undefined as unknown as true },
  });
  const [show, setShow] = useState(false);
  const confirmou = watch("confirmou2fa");

  const passos2fa = [
    "Abra o aplicativo gov.br no seu celular.",
    "Toque em Cadastro → Segurança da conta.",
    "Procure por Verificação em duas etapas.",
    "Toque em Desativar e confirme com sua senha.",
    "Pronto! Agora você pode informar sua senha abaixo.",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        step={3}
        title="Acesso ao gov.br"
        description="Para o contador conseguir abrir a MEI, ele precisa do seu acesso ao portal gov.br."
      />

      <section className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-[color:var(--color-navy)]" />
          <h2 className="font-display text-lg text-foreground">
            Antes de continuar: desative a verificação em duas etapas
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          A verificação em duas etapas envia um código toda vez que entramos na sua conta.
          Como o contador vai precisar acessar várias vezes, é mais prático desativar agora
          e reativar depois que tudo estiver pronto.
        </p>

        <ol className="space-y-3">
          {passos2fa.map((p, i) => (
            <li key={p} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-navy)] text-xs font-semibold text-cream">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm text-foreground/85">{p}</p>
            </li>
          ))}
        </ol>

        <label
          className={cn(
            "mt-2 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all",
            confirmou
              ? "border-[color:var(--color-verde-br)] bg-[color:var(--color-verde-br)]/5"
              : "border-border hover:border-foreground/30",
          )}
        >
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[color:var(--color-verde-br)]"
            checked={!!confirmou}
            onChange={(e) =>
              setValue("confirmou2fa", e.target.checked as true, { shouldValidate: true })
            }
          />
          <span className="text-sm font-medium text-foreground">
            Confirmo que desativei a verificação em duas etapas no app gov.br.
          </span>
        </label>
        {errors.confirmou2fa && (
          <p className="text-xs font-medium text-destructive">
            {errors.confirmou2fa.message}
          </p>
        )}
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-[color:var(--color-navy)]" />
          <h2 className="font-display text-lg text-foreground">Senha do gov.br</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Sua senha é usada apenas para abrir sua MEI e fica protegida. Recomendamos
          que você troque a senha após a abertura.
        </p>
        <Field label="Senha gov.br" error={errors.senhaGov?.message}>
          <div className="relative">
            <Input
              {...register("senhaGov")}
              type={show ? "text" : "password"}
              placeholder="Sua senha do gov.br"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
      </section>

      <NavButtons onBack={onBack} nextLabel="Continuar para o pagamento" />
    </form>
  );
}

// ============ STEP 4 ============
function Step4Payment({ onBack, onPaid }: { onBack: () => void; onPaid: () => void }) {
  const [method, setMethod] = useState<"pix" | "cartao" | "boleto">("pix");
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // TODO: integrar checkout Asaas aqui
    setTimeout(() => {
      setLoading(false);
      onPaid();
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <StepHeader
        step={4}
        title="Pagamento"
        description="Falta pouco. Escolha como você prefere pagar a abertura da sua MEI."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-lg text-foreground">Forma de pagamento</h2>
          <RadioGroup
            value={method}
            onValueChange={(v) => setMethod(v as typeof method)}
            className="grid gap-3"
          >
            {[
              { v: "pix", label: "PIX", hint: "Aprovação na hora" },
              { v: "cartao", label: "Cartão de crédito", hint: "Em até 3x sem juros" },
              { v: "boleto", label: "Boleto bancário", hint: "Compensação em até 2 dias úteis" },
            ].map((o) => (
              <label
                key={o.v}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 transition-all",
                  method === o.v
                    ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)]/5"
                    : "border-border hover:border-foreground/30",
                )}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={o.v} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{o.label}</p>
                    <p className="text-xs text-muted-foreground">{o.hint}</p>
                  </div>
                </div>
              </label>
            ))}
          </RadioGroup>

          <p className="text-xs text-muted-foreground">
            Ao continuar, você será redirecionado para o ambiente seguro de pagamento.
            Nenhum dado de cartão é armazenado no nosso site.
          </p>
        </div>

        <aside className="space-y-4 rounded-2xl border-2 border-[color:var(--color-navy)] bg-[color:var(--color-navy)] p-6 text-cream">
          <p className="text-xs font-semibold uppercase tracking-widest text-cream/70">
            Resumo
          </p>
          <div className="space-y-1">
            <p className="font-display text-2xl">Abertura de MEI</p>
            <p className="text-xs text-cream/70">Com contador especialista</p>
          </div>
          <div className="border-t border-cream/15 pt-4">
            <p className="text-xs uppercase tracking-wider text-cream/60">Total</p>
            <p className="font-display text-3xl">R$ 149,90</p>
            <p className="mt-1 text-xs text-cream/70">em até 3x no cartão</p>
          </div>
          <Button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-cream text-[color:var(--color-navy-deep)] hover:bg-cream/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando…
              </>
            ) : (
              <>
                Pagar agora
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </aside>
      </div>

      <div className="flex justify-start">
        <Button variant="ghost" onClick={onBack} disabled={loading}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
    </div>
  );
}

// ============ STEP 5 ============
function Step5Final() {
  const navigate = useNavigate();

  const beneficiosContador = [
    { icon: MessageCircle, text: "Contador exclusivo no WhatsApp para tirar dúvidas" },
    { icon: Calendar, text: "Envio das guias DAS todos os meses" },
    { icon: FileCheck2, text: "Entrega da DASN-SIMEI anual sem você se preocupar" },
    { icon: ShieldAlert, text: "Acompanhamento de pendências na Receita Federal" },
    { icon: User, text: "Orientação sobre limites de faturamento e nota fiscal" },
  ];

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-[color:var(--color-verde-br)]/30 bg-[color:var(--color-verde-br)]/5 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-verde-br)] text-cream">
          <Check className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-3xl text-foreground sm:text-4xl">
          Tudo certo, sua MEI está em andamento!
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Em até 24 horas, um contador entrará em contato pelo WhatsApp com seu
          Certificado MEI e o passo a passo dos próximos meses.
        </p>
      </div>

      {/* Upsell contador */}
      <section className="rounded-3xl border-2 border-[color:var(--color-navy)] bg-card p-6 sm:p-10">
        <span className="inline-block rounded-full bg-[color:var(--color-amarelo)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-navy-deep)]">
          Recomendado
        </span>
        <h2 className="mt-4 font-display text-2xl text-foreground sm:text-3xl">
          Quer um contador exclusivo cuidando da sua MEI todo mês?
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Por uma mensalidade fixa, você tem um contador especialista responsável
          pela sua MEI — sem precisar se preocupar com prazo, guia ou Receita Federal.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {beneficiosContador.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-verde-br)]" />
              <span className="text-sm text-foreground/85">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[color:var(--color-navy)] p-6 text-cream sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/70">
              Mensalidade
            </p>
            <p className="font-display text-3xl">
              R$ 99,90
              <span className="ml-1 text-sm text-cream/70">/mês</span>
            </p>
            <p className="mt-1 text-xs text-cream/70">Cancele quando quiser</p>
          </div>
          <Button className="bg-cream text-[color:var(--color-navy-deep)] hover:bg-cream/90">
            Quero contador exclusivo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Upsell maquininha */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Bônus para o seu negócio
        </p>
        <h2 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
          Maquininha do Mercado Pago com taxa especial
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Como você está abrindo sua MEI com a gente, conseguimos uma condição
          diferenciada na maquininha Mercado Pago. Receba pagamentos em débito,
          crédito e PIX direto na sua conta.
        </p>
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ul className="space-y-2 text-sm text-foreground/85">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[color:var(--color-verde-br)]" />
              Aceita débito, crédito e PIX
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[color:var(--color-verde-br)]" />
              Recebimento em 1 dia útil
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[color:var(--color-verde-br)]" />
              Sem aluguel mensal
            </li>
          </ul>
          <Button variant="outline">
            Quero saber mais
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <div className="flex justify-center pt-4">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="text-muted-foreground"
        >
          Voltar para o início
        </Button>
      </div>
    </div>
  );
}

// ============ NAV BUTTONS ============
function NavButtons({
  onBack,
  nextLabel = "Continuar",
}: {
  onBack?: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" size="lg" className="px-8">
        {nextLabel}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
