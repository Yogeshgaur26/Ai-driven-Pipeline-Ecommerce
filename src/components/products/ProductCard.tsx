import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string | null;
  category?: string;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  compareAtPrice,
  imageUrl,
  category,
}: ProductCardProps) {
  const { addItem } = useCart();
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      imageUrl: imageUrl || '',
    });
  };

  return (
    <Link
      to={`/products/${slug}`}
      className="group block animate-fade-in"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <span className="text-4xl font-display text-muted-foreground/30">
              {name.charAt(0)}
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>

        {/* Sale Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
            Sale
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        {category && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {category}
          </p>
        )}
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-medium">${price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
