import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ProductForm = ({ onSubmit, initialData }: any) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input
          name="name"
          defaultValue={initialData?.name || ""}
          required
        />
      </div>
      <div>
        <Label>Preço</Label>
        <Input
          name="price"
          type="number"
          defaultValue={initialData?.price || ""}
          required
        />
      </div>
      <div>
        <Label>Estoque</Label>
        <Input
          name="stock"
          type="number"
          defaultValue={initialData?.stock || ""}
          required
        />
      </div>
      <Button type="submit">Salvar</Button>
    </form>
  );
};