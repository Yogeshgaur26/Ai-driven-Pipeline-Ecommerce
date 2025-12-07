import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, totalPrice } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-display font-medium mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view your cart and start shopping.
          </p>
          <Link to="/auth">
            <Button size="lg">Sign In to Continue</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-display font-medium mb-8">Shopping Cart</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-muted rounded-lg">
                <div className="w-24 h-24 bg-muted-foreground/10 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-muted-foreground/10 rounded" />
                  <div className="h-4 w-1/4 bg-muted-foreground/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-display font-medium mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl font-display font-medium mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-card rounded-lg border border-border animate-fade-in"
              >
                {/* Product Image */}
                <Link to={`/products/${item.productId}`} className="shrink-0">
                  <div className="w-24 h-24 rounded-md bg-muted overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                        <span className="text-2xl font-display text-muted-foreground/30">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{totalPrice >= 100 ? 'Free' : '$10.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-border my-4" />

              <div className="flex justify-between font-medium mb-6">
                <span>Total</span>
                <span>
                  ${(totalPrice + (totalPrice >= 100 ? 0 : 10)).toFixed(2)}
                </span>
              </div>

              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Free shipping on orders over $100
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
