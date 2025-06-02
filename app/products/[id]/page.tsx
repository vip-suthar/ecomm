import ProductDetailsPage from "@/components/products/ProductDetailsPage";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id);
  return <ProductDetailsPage productId={id} />;
}
