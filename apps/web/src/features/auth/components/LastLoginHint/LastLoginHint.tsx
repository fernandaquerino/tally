export function LastLoginHint({ method }: { method: string }) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      Você usou {method} para entrar da última vez
    </p>
  );
}
