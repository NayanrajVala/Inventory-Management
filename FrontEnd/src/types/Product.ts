export interface Product{
    id:string;
    name:string;
    price:number;
    quantity:number;
    categoryId:number
}

export interface ProductForm{
    name:string;
    price:string;
    quantity:string;
    categoryId:number | "";
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  lastPage: number;
}
