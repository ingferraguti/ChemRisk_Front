"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postAuthLogin, type LoginRequest } from "@/generated/api";
import { setRoles, setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = z.object({
  username: z.string().min(1, "Username obbligatorio"),
  password: z.string().min(1, "Password obbligatoria"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: LoginRequest) => {
    try {
      const response = await postAuthLogin(values);
      setToken(response.accessToken);
      setRoles(response.user.roles ?? []);
      toast.success("Accesso effettuato");
      router.replace("/app");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login fallito";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-lg border bg-background p-6 shadow"
      >
        <div>
          <h1 className="text-2xl font-semibold">Accedi</h1>
          <p className="text-sm text-muted-foreground">Inserisci le tue credenziali.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <Input placeholder="username" {...register("username")} />
          {errors.username && (
            <p className="text-xs text-destructive">{errors.username.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" placeholder="password" {...register("password")} />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Accesso..." : "Accedi"}
        </Button>
      </form>
    </div>
  );
}
