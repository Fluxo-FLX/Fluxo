import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/server/repositories/settings-repository";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display mb-8 text-2xl sm:text-3xl">Configurações</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
