import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "../Button";
import { Toaster, toast } from "./Toaster";

const meta = {
  title: "Feedbacks/Toaster",
  component: Toaster,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("Transação adicionada.", {
            action: { label: "Desfazer", onClick: () => {} },
          })
        }
      >
        Sucesso + ação
      </Button>

      <Button
        variant="secondary"
        onClick={() =>
          toast.error("Falha ao importar o arquivo.", { closeButton: true })
        }
      >
        Erro
      </Button>

      <Button
        variant="secondary"
        onClick={() => {
          const id = toast.loading("Sincronizando contas…");
          setTimeout(
            () => toast.success("Contas sincronizadas.", { id }),
            2000,
          );
        }}
      >
        Loading → sucesso
      </Button>

      <Toaster />
    </div>
  ),
};
