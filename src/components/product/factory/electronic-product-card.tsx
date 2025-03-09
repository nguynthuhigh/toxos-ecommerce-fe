import { ElectronicProduct } from "./product-factory";

interface Props {
  product: ElectronicProduct;
}

export function ElectronicProductCard({ product }: Props) {
  return (
    <div className="border p-4 rounded-lg shadow">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-32 object-cover"
      />
      <h3 className="font-semibold mt-2">{product.title}</h3>
      <p className="text-gray-500">{product.price} VND</p>
      <p className="text-sm text-gray-400">{product.soldCount} sold</p>
    </div>
  );
}
