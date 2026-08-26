import { Building2, FileText, Landmark, PiggyBank, User } from "lucide-react";
import { TallyLogo } from "@/components/brand";

const steps = [
  ["Perfil", User],
  ["Sua empresa", Building2],
  ["Regime fiscal", FileText],
  ["Separar para imposto", PiggyBank],
  ["Conta inicial", Landmark],
] as const;

export function OnboardingSidebar({ current }: { current: number }) {
  return (
    <aside className="hidden w-full max-w-md flex-none flex-col justify-between bg-neutral-950 p-10 lg:flex">
      <div>
        <TallyLogo className="mb-12" />
        <h2 className="mb-3.5 text-2xl font-semibold tracking-tight">
          Vamos descobrir quanto do seu faturamento é realmente seu.
        </h2>
        <p className="mb-9 text-sm text-foreground-muted">
          Cinco passos rápidos. Só o essencial para separar o dinheiro da
          empresa do seu dinheiro.
        </p>
        <ol>
          {steps.map(([label, Icon], index) => (
            <li
              key={label}
              data-sidebar-step={index + 1}
              className="flex origin-left items-center gap-3 py-2.5"
            >
              <span
                className={
                  index + 1 <= current
                    ? "flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : "flex size-6 items-center justify-center rounded-full border border-border text-foreground-muted"
                }
              >
                <Icon className="size-3" />
              </span>
              <span
                className={
                  index + 1 === current
                    ? "text-sm font-medium text-foreground"
                    : "text-sm text-foreground-subtle"
                }
              >
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <p className="text-xs leading-relaxed text-foreground-subtle">
        Seus dados ficam só com você. Nada é compartilhado com a Receita ou
        terceiros.
      </p>
    </aside>
  );
}
