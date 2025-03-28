'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white">
     
      <main className="flex-1">
        {/* HERO */}
        <section className="bg-[#f9fafb] py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-4">
              Transforme seu negócio de delivery com pedidos digitais
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Seja delivery de comida, produtos ou serviços — receba pedidos online e gerencie tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => router.push('/auth/register-as-store')}>
                Criar minha loja grátis
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push('https://demo.pedego.app')}>Ver exemplo de loja</Button>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">📱 Plataforma digital</h3>
              <p className="text-muted-foreground">Receba pedidos direto pelo celular, WhatsApp ou link personalizado.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">📦 Pedidos organizados</h3>
              <p className="text-muted-foreground">Acompanhe pedidos do início à entrega, com status atualizados em tempo real.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">📊 Relatórios automáticos</h3>
              <p className="text-muted-foreground">Tenha controle total sobre vendas, clientes e desempenho da sua operação.</p>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-8">Como funciona</h2>
            <ol className="space-y-4 text-left">
              <li><strong>1.</strong> Cadastre sua loja em poucos minutos.</li>
              <li><strong>2.</strong> Adicione seus produtos e personalize o cardápio.</li>
              <li><strong>3.</strong> Compartilhe o link com seus clientes.</li>
              <li><strong>4.</strong> Receba, acompanhe e entregue seus pedidos.</li>
            </ol>
          </div>
        </section>

        {/* PRINTS / CARROSSEL */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Veja a plataforma em ação</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Image src="/prints/dashboard.png" alt="Painel administrativo" width={400} height={250} className="rounded-xl shadow" />
              <Image src="/prints/pedido.png" alt="Pedido sendo preparado" width={400} height={250} className="rounded-xl shadow" />
              <Image src="/prints/cardapio.png" alt="Cardápio digital" width={400} height={250} className="rounded-xl shadow" />
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-8">O que estão dizendo</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow">
                <p className="italic">"A Pedego salvou meu delivery! Hoje tudo é mais organizado e vendemos o dobro."</p>
                <p className="mt-4 font-semibold">— Mariana, Lanches da Mari</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <p className="italic">"Simples, prática e rápida. Consigo ver todos os pedidos em tempo real."</p>
                <p className="mt-4 font-semibold">— João, Hortifruti do João</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gray-200">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">Pronto para turbinar seu delivery?</h2>
            <p className="mb-6 text-muted-foreground">Cadastre sua loja agora e experimente grátis por 30 dias.</p>
            <Button size="lg" onClick={() => router.push('/auth/register-as-store')}>
              Criar minha loja
            </Button>
          </div>
        </section>
      </main>

    
    </div>
  )
}