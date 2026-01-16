\"use client\";

import { useEffect, useState } from \"react\";
import { useForm } from \"react-hook-form\";
import { z } from \"zod\";
import { zodResolver } from \"@hookform/resolvers/zod\";
import { getAuthMe, patchUsersMe, postUsersMeChangePassword, type User } from \"@/generated/api\";
import { Button } from \"@/components/ui/button\";
import { Input } from \"@/components/ui/input\";
import { toast } from \"sonner\";

const profileSchema = z.object({
  mail: z.string().email(\"Email non valida\").optional().or(z.literal(\"\")),
  name: z.string().optional().or(z.literal(\"\")),
  surname: z.string().optional().or(z.literal(\"\")),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, \"Password attuale obbligatoria\"),
  newPassword: z.string().min(8, \"Minimo 8 caratteri\"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { mail: \"\", name: \"\", surname: \"\" },
  });
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: \"\", newPassword: \"\" },
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getAuthMe();
        setUser(response);
        profileForm.reset({
          mail: response.mail ?? \"\",
          name: response.name ?? \"\",
          surname: response.surname ?? \"\",
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : \"Errore caricamento profilo\";
        toast.error(message);
      }
    };
    loadUser();
  }, [profileForm]);

  const submitProfile = async (values: ProfileFormValues) => {
    try {
      const payload = {
        mail: values.mail || null,
        name: values.name || null,
        surname: values.surname || null,
      };
      const updated = await patchUsersMe(payload);
      setUser(updated);
      toast.success(\"Profilo aggiornato\");
    } catch (error) {
      const message = error instanceof Error ? error.message : \"Errore aggiornamento profilo\";
      toast.error(message);
    }
  };

  const submitPassword = async (values: PasswordFormValues) => {
    try {
      await postUsersMeChangePassword(values);
      toast.success(\"Password aggiornata\");
      passwordForm.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : \"Errore cambio password\";
      toast.error(message);
    }
  };

  return (
    <div className=\"space-y-6\">
      <div>
        <h1 className=\"text-2xl font-semibold\">Profilo</h1>
        <p className=\"text-sm text-muted-foreground\">Gestisci i dati personali e la password.</p>
      </div>

      <div className=\"grid gap-6 lg:grid-cols-2\">
        <form
          onSubmit={profileForm.handleSubmit(submitProfile)}
          className=\"space-y-4 rounded-lg border bg-background p-6 shadow\"
        >
          <div>
            <h2 className=\"text-lg font-semibold\">Dati personali</h2>
            <p className=\"text-sm text-muted-foreground\">
              {user ? `Utente: ${user.username}` : \"Caricamento utente...\"}
            </p>
          </div>
          <div className=\"space-y-2\">
            <label className=\"text-sm font-medium\">Email</label>
            <Input {...profileForm.register(\"mail\")} placeholder=\"email@example.com\" />
          </div>
          <div className=\"space-y-2\">
            <label className=\"text-sm font-medium\">Nome</label>
            <Input {...profileForm.register(\"name\")} placeholder=\"Nome\" />
          </div>
          <div className=\"space-y-2\">
            <label className=\"text-sm font-medium\">Cognome</label>
            <Input {...profileForm.register(\"surname\")} placeholder=\"Cognome\" />
          </div>
          <Button type=\"submit\" disabled={profileForm.formState.isSubmitting}>
            Salva profilo
          </Button>
        </form>

        <form
          onSubmit={passwordForm.handleSubmit(submitPassword)}
          className=\"space-y-4 rounded-lg border bg-background p-6 shadow\"
        >
          <div>
            <h2 className=\"text-lg font-semibold\">Cambio password</h2>
            <p className=\"text-sm text-muted-foreground\">Minimo 8 caratteri.</p>
          </div>
          <div className=\"space-y-2\">
            <label className=\"text-sm font-medium\">Password attuale</label>
            <Input type=\"password\" {...passwordForm.register(\"oldPassword\")} />
          </div>
          <div className=\"space-y-2\">
            <label className=\"text-sm font-medium\">Nuova password</label>
            <Input type=\"password\" {...passwordForm.register(\"newPassword\")} />
          </div>
          <Button type=\"submit\" disabled={passwordForm.formState.isSubmitting}>
            Aggiorna password
          </Button>
        </form>
      </div>
    </div>
  );
}
