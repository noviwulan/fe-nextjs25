export interface ProductVariantType {
    id?: number;
    product_id: number;
    name: string;  // Tablet, Sirup, dsb
    price: number;
    stock: number;
}