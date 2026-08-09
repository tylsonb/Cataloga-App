"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { logError } from "@/lib/logger";
import { updateProfileAction } from "@/modules/profile/actions/profile.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

type Result = { success: true } | { success: false; error: string };

type DefaultValues = { full_name?: string; phone?: string | null; avatar_url?: string | null; email?: string };

export function ProfileForm({ userId, defaultValues }: { userId: string; defaultValues?: DefaultValues }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(defaultValues?.avatar_url ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setError(undefined);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(publicUrl);
    } catch (uploadError) {
      logError("profile.avatarUpload", uploadError, { userId });
      setError("No fue posible subir la imagen");
    } finally {
      setPending(false);
    }
  }

  async function submit(formData: FormData) {
    setPending(true);
    setError(undefined);
    setSuccess(false);
    try {
      const result = await updateProfileAction(userId, {
        full_name: formData.get("full_name") as string,
        phone: (formData.get("phone") as string) || null,
        avatar_url: avatarUrl || null,
      }) as Result;
      if (!result.success) setError(result.error);
      else setSuccess(true);
    } finally {
      setPending(false);
    }
  }

  const initials = (defaultValues?.full_name ?? "?").charAt(0).toUpperCase();

  return (
    <form action={submit} className="space-y-6 max-w-md">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 rounded-full bg-primary p-2 text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </div>
        <div>
          <p className="text-sm font-medium">Foto de perfil</p>
          <p className="text-xs text-muted-foreground">Click en la cámara para cambiar</p>
        </div>
      </div>

      <label className="block text-sm font-medium">Nombre
        <Input className="mt-1" name="full_name" defaultValue={defaultValues?.full_name} required />
      </label>
      <label className="block text-sm font-medium">Email
        <Input className="mt-1" value={defaultValues?.email ?? ""} disabled />
      </label>
      <label className="block text-sm font-medium">Teléfono
        <Input className="mt-1" name="phone" defaultValue={defaultValues?.phone ?? ""} placeholder="+56912345678" />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">Perfil actualizado correctamente</p>}
      <Button className="w-full" disabled={pending}>{pending ? "Guardando..." : "Guardar cambios"}</Button>
    </form>
  );
}
