export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Pagina non trovata</h1>
        <p className="text-sm text-muted-foreground">La risorsa richiesta non esiste.</p>
      </div>
    </div>
  );
}
