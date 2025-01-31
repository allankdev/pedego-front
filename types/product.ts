export interface Product {
    id: number; // Ou UUID, ajuste conforme sua API
    name: string;
    description: string;
    price: number;
    // ... outros campos, adicione conforme seu CreateProductDto e UpdateProductDto
  }