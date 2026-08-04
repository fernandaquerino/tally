/** Erro de nível de formulário (ex.: credenciais inválidas vindas da API). */
export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-md border border-error-border bg-error-subtle px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}
