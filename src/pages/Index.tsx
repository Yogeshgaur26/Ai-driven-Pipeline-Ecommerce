import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Index() {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center gradient-hero overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 animate-fade-in">
              New Collection
            </p>
            <h1 className="text-5xl md:text-7xl font-display font-medium leading-[1.1] mb-6 animate-slide-up">
              Crafted for
              <br />
              <span className="text-primary">Modern Living</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md animate-slide-up" style={{ animationDelay: '100ms' }}>
              Discover our curated collection of essentials designed with intention, 
              built to last, and made to elevate your everyday.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/products">
                <Button variant="hero" size="xl">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products?featured=true">
                <Button variant="outline" size="xl">
                  View Featured
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[120%] bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Features Bar */}
      <section className="border-y border-border bg-muted/30 py-6">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">256-bit encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Sustainable</p>
                <p className="text-xs text-muted-foreground">Eco-friendly materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked favorites from our latest collection.
              </p>
            </div>
            <Link to="/products" className="mt-4 md:mt-0">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <ProductGrid products={featuredProducts || []} loading={isLoading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-5xl font-display font-medium mb-6">
            Join the Atelier Community
          </h2>
          <p className="text-background/70 max-w-md mx-auto mb-8">
            Be the first to know about new arrivals, exclusive offers, and design inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-background/30"
            />
            <Button variant="default" size="lg" className="bg-background text-foreground hover:bg-background/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
