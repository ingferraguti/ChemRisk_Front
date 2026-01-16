"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postAuthLogin, postVerifyToken } from "@/generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getRoles, getToken } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1, "Username obbligatorio"),
  password: z.string().min(1, "Password obbligatoria"),
});

const verifySchema = z.object({
  token: z.string().min(1, "Token obbligatorio"),
});

type LoginValues = z.infer<typeof loginSchema>;
type VerifyValues = z.infer<typeof verifySchema>;

export default function DebugPage() {
  const [loginResult, setLoginResult] = useState<unknown>(null);
  const [verifyResult, setVerifyResult] = useState<unknown>(null);
  const roles = getRoles();
  const isAdmin = roles.some((role) => role.toLowerCase() === "admin");

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const verifyForm = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { token: "" },
  });

  useEffect(() => {
    const token = getToken();
    if (token) {
      verifyForm.setValue("token", token);
    }
  }, [verifyForm]);

  if (!isAdmin) {
    return <div>Non autorizzato.</div>;
  }

  const handleLogin = async (values: LoginValues) => {
    try {
      const response = await postAuthLogin(values);
      setLoginResult(response);
      toast.success("Login (nuovo formato) riuscito");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore login";
      toast.error(message);
    }
  };

  const handleVerify = async (values: VerifyValues) => {
    try {
      const response = await postVerifyToken({ token: values.token });
      setVerifyResult(response);
      toast.success("Token verificato");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore verifica token";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Debug Auth</h1>
        <p className="text-sm text-muted-foreground">
          Utility di test per endpoint legacy e verifica token.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="space-y-4 rounded-lg border bg-background p-6 shadow"
        >
          <div>
            <h2 className="text-lg font-semibold">Login (nuovo formato)</h2>
            <p className="text-sm text-muted-foreground">POST /auth/login</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input {...loginForm.register("username")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" {...loginForm.register("password")} />
          </div>
          <Button type="submit" disabled={loginForm.formState.isSubmitting}>
            Esegui login
          </Button>
          {loginResult && (
            <pre className="rounded-md border bg-muted/20 p-3 text-xs">
              {JSON.stringify(loginResult, null, 2)}
            </pre>
          )}
        </form>

        <form
          onSubmit={verifyForm.handleSubmit(handleVerify)}
          className="space-y-4 rounded-lg border bg-background p-6 shadow"
        >
          <div>
            <h2 className="text-lg font-semibold">Verifica token</h2>
            <p className="text-sm text-muted-foreground">POST /verifyToken</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Token</label>
            <Input {...verifyForm.register("token")} />
          </div>
          <Button type="submit" disabled={verifyForm.formState.isSubmitting}>
            Verifica
          </Button>
          {verifyResult && (
            <pre className="rounded-md border bg-muted/20 p-3 text-xs">
              {JSON.stringify(verifyResult, null, 2)}
            </pre>
          )}
        </form>
      </div>
    </div>
  );
}
