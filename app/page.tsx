// app/page.js
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Bem-vindo ao Pedego</h1>
        <p>
          Conectamos clientes e lojas de delivery de forma simples e eficiente.
          <br />
          Restaurantes, mercados, farmácias, padarias e muito mais!
        </p>
        <Button>Cadastre sua loja</Button>
      </section>

      <section className="testimonials">
        <h2>Depoimentos</h2>
        <Card>
          <CardHeader>
            <CardTitle>Cliente Satisfeito</CardTitle>
          </CardHeader>
          <CardContent>
            <p>"Adoro usar o Pedego para pedir comida e outros produtos!"</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}