import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GlobalSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações Globais</h1>
      <form className="space-y-4">
        <div>
          <Label>Nome da Plataforma</Label>
          <Input name="platformName" required />
        </div>
        <div>
          <Label>Email de Suporte</Label>
          <Input name="supportEmail" type="email" required />
        </div>
        <div>
          <Label>Taxa de Serviço (%)</Label>
          <Input name="serviceFee" type="number" required />
        </div>
        <Button type="submit">Salvar</Button>
      </form>
    </div>
  );
}