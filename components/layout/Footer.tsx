export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="container mx-auto px-6 text-center space-y-2">
        <p className="text-lg font-semibold">Pedgo</p>
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Pedgo. Todos os direitos reservados.</p>
        <p className="text-xs text-gray-500">Feito com ❤️ para deliverys inteligentes</p>
      </div>
    </footer>
  )
}
