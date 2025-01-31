import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StoreSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações do Restaurante</h1>
      <form className="space-y-4">
        <div>
          <Label>Nome do Restaurante</Label>
          <Input name="name" required />
        </div>
        <div>
          <Label>Endereço</Label>
          <Input name="address" required />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input name="phone" required />
        </div>
        <Button type="submit">Salvar</Button>
      </form>
    </div>
  );
}