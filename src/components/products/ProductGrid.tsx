import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compare_at_price?: number | null;
  image_url?: string | null;
  categories?: { name: string } | null;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] rounded-lg bg-muted mb-4" />
            <div className="h-3 bg-muted rounded w-1/3 mb-2" />
            <div className="h-4 bg-muted rounded w-2/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="opacity-0 animate-slide-up"
        >
          <ProductCard
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={parseFloat(String(product.price))}
            compareAtPrice={product.compare_at_price ? parseFloat(String(product.compare_at_price)) : null}
            imageUrl={product.image_url}
            category={product.categories?.name}
          />
        </div>
      ))}
    </div>
  );
}
