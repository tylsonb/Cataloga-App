import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/modules/profile/components/profile-form";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      <ProfileForm userId={user.id} defaultValues={profile ?? undefined} />
    </section>
  );
}
