export interface Category {
  id: number;
  name: string;
}

export interface ExtraItem {
  id?: number;
  name: string;
  price: string;
  description: string;
  available?: boolean;
}

export interface ExtraGroup {
  id?: number;
  title: string;
  required: boolean;
  maxSelection: number;
  extras: ExtraItem[];
}

interface Props {
  initialData?: ProductFormInitialData;
  onSuccess: (savedProduct?: any) => void;
  onCancel: () => void;
  onDeleteImage: () => Promise<void>; // Adicione esta linha
}


export interface ProductFormInitialData {
  id: number; // Identificador único do produto
  name: string; // Nome do produto
  description: string; // Descrição do produto
  price: string; // Preço do produto
  available: boolean; // Disponibilidade do produto
  hasStockControl?: boolean; // Indica se o produto tem controle de estoque
  stockQuantity?: number; // Quantidade de estoque (opcional)
  category?: Category; // Categoria do produto (detalhada com id e nome)
  imageId?: string; // ID da imagem associada ao produto (opcional)
  storeId?: number  // Adicionando storeId
  


}
