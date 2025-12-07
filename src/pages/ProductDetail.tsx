import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/integrations/supabase/client';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const handleAddToCart = async () => {
    if (!product) return;

    await addItem(
      {
        id: product.id,
        name: product.name,
        price: parseFloat(String(product.price)),
        imageUrl: product.image_url || '',
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-muted rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-10 w-3/4 bg-muted rounded" />
                <div className="h-8 w-24 bg-muted rounded" />
                <div className="h-24 bg-muted rounded" />
                <div className="h-12 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const price = parseFloat(String(product.price));
  const compareAtPrice = product.compare_at_price
    ? parseFloat(String(product.compare_at_price))
    : null;
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <Layout>
      <div className="container py-8">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square rounded-lg bg-muted overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                <span className="text-8xl font-display text-muted-foreground/20">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.categories && (
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                {product.categories.name}
              </p>
            )}

            <h1 className="text-3xl md:text-4xl font-display font-medium mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-medium">${price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-sm font-medium text-destructive">
                  Save ${(compareAtPrice - price).toFixed(2)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="xl"
              onClick={handleAddToCart}
              className="w-full mb-4"
              disabled={added}
            >
              {added ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart — ${(price * quantity).toFixed(2)}
                </>
              )}
            </Button>

            {/* Stock Info */}
            {product.inventory_count !== null && product.inventory_count !== undefined && (
              <p className="text-sm text-muted-foreground text-center">
                {product.inventory_count > 0 ? (
                  product.inventory_count <= 5 ? (
                    <span className="text-warning">Only {product.inventory_count} left in stock</span>
                  ) : (
                    'In stock'
                  )
                ) : (
                  <span className="text-destructive">Out of stock</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
