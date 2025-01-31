import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações de Tema</h1>
      <p className="mb-4">Tema atual: {theme}</p>
      <Button onClick={toggleTheme}>Alternar Tema</Button>
    </div>
  );
}