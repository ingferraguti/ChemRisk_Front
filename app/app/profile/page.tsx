"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuthMe, patchUsersMe, postUsersMeChangePassword, type User } from "@/generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { HttpError } from "@/lib/http";

const accountSchema = z.object({
  mail: z.string().email("Email non valida").optional().or(z.literal("")),
  oldPassword: z.string().optional().or(z.literal("")),
  newPassword: z.string().min(8, "Minimo 8 caratteri").optional().or(z.literal("")),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"email" | "password">("email");
  const [initialEmail, setInitialEmail] = useState<string>("");
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { mail: "", oldPassword: "", newPassword: "" },
    mode: "onChange",
  });

  const mailValue = form.watch("mail") ?? "";
  const oldPassword = form.watch("oldPassword") ?? "";
  const newPassword = form.watch("newPassword") ?? "";

  const emailChanged = Boolean(mailValue) && mailValue !== initialEmail;
  const passwordTouched = Boolean(oldPassword || newPassword);
  const xorViolated = emailChanged && passwordTouched;

  const emailValid = !emailChanged || !form.formState.errors.mail;
  const passwordValid =
    !passwordTouched ||
    (!form.formState.errors.oldPassword &&
      !form.formState.errors.newPassword &&
      Boolean(oldPassword) &&
      Boolean(newPassword));

  const disableEmailSave =
    !emailChanged || !emailValid || xorViolated || form.formState.isSubmitting;
  const disablePasswordSave =
    !passwordTouched || !passwordValid || xorViolated || form.formState.isSubmitting;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getAuthMe();
        setUser(response);
        const mail = response.mail ?? "";
        setInitialEmail(mail);
        form.reset({
          mail,
          oldPassword: "",
          newPassword: "",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Errore caricamento profilo";
        toast.error(message);
      }
    };
    loadUser();
  }, [form]);

  const submitEmail = async (values: AccountFormValues) => {
    if (xorViolated) {
      toast.error("Puoi modificare o l'email o la password, non entrambe insieme.");
      return;
    }
    if (!emailChanged) {
      return;
    }
    try {
      const updated = await patchUsersMe({ mail: values.mail || null });
      setUser(updated);
      const updatedMail = updated.mail ?? "";
      setInitialEmail(updatedMail);
      form.reset({ mail: updatedMail, oldPassword: "", newPassword: "" });
      toast.success("Email aggiornata");
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        toast.error("Sessione scaduta");
        return;
      }
      const message = error instanceof Error ? error.message : "Errore aggiornamento email";
      toast.error(message);
    }
  };

  const submitPassword = async (values: AccountFormValues) => {
    if (xorViolated) {
      toast.error("Puoi modificare o l'email o la password, non entrambe insieme.");
      return;
    }
    if (!passwordTouched) {
      return;
    }
    if (!values.oldPassword || !values.newPassword) {
      toast.error("Compila la password attuale e la nuova password");
      return;
    }
    try {
      await postUsersMeChangePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password aggiornata");
      form.setValue("oldPassword", "");
      form.setValue("newPassword", "");
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        toast.error("Sessione scaduta");
        return;
      }
      if (error instanceof HttpError && error.status === 400) {
        toast.error("Password attuale errata o nuova password non valida");
        return;
      }
      const message = error instanceof Error ? error.message : "Errore cambio password";
      toast.error(message);
    }
  };

  const headerLabel = useMemo(() => {
    if (!user) {
      return "Caricamento utente...";
    }
    return `Utente: ${user.username}`;
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Il mio account</h1>
        <p className="text-sm text-muted-foreground">
          Puoi aggiornare email o password, ma non entrambe nello stesso invio.
        </p>
      </div>

      <div className="rounded-lg border bg-background p-4 shadow">
        <p className="text-sm text-muted-foreground">{headerLabel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={mode === "email" ? "default" : "outline"}
            onClick={() => setMode("email")}
          >
            Modifica email
          </Button>
          <Button
            type="button"
            variant={mode === "password" ? "default" : "outline"}
            onClick={() => setMode("password")}
          >
            Modifica password
          </Button>
        </div>
        {user && (
          <div className="mt-3 text-sm text-muted-foreground">
            <span>Nome: {user.name ?? "-"}</span>
            <span className="ml-4">Cognome: {user.surname ?? "-"}</span>
          </div>
        )}
      </div>

      {xorViolated && (
        <div className="rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Puoi modificare o l'email o la password, non entrambe insieme.
        </div>
      )}

      <form className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-lg border bg-background p-6 shadow">
          <div>
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="text-sm text-muted-foreground">Aggiorna la tua email.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="email@example.com"
              disabled={mode !== "email"}
              {...form.register("mail")}
            />
            {form.formState.errors.mail && (
              <p className="text-xs text-destructive">{form.formState.errors.mail.message}</p>
            )}
          </div>
          <Button
            type="button"
            disabled={disableEmailSave}
            onClick={form.handleSubmit(submitEmail)}
          >
            Salva email
          </Button>
        </section>

        <section className="space-y-4 rounded-lg border bg-background p-6 shadow">
          <div>
            <h2 className="text-lg font-semibold">Password</h2>
            <p className="text-sm text-muted-foreground">Minimo 8 caratteri.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password attuale</label>
            <Input
              type="password"
              disabled={mode !== "password"}
              {...form.register("oldPassword")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nuova password</label>
            <Input
              type="password"
              disabled={mode !== "password"}
              {...form.register("newPassword")}
            />
            {form.formState.errors.newPassword && (
              <p className="text-xs text-destructive">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <Button
            type="button"
            disabled={disablePasswordSave}
            onClick={form.handleSubmit(submitPassword)}
          >
            Salva password
          </Button>
        </section>
      </form>
    </div>
  );
}
