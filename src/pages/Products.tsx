import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [showFilters, setShowFilters] = useState(false);

  const featured = searchParams.get('featured') === 'true';

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, featured, search],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        const category = categories?.find(c => c.slug === selectedCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      if (featured) {
        query = query.eq('is_featured', true);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !selectedCategory || !!categories,
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearch('');
  };

  const hasActiveFilters = selectedCategory || search || featured;

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-medium mb-2">
            {featured ? 'Featured Products' : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {featured
              ? 'Our handpicked selection of exceptional pieces.'
              : 'Explore our complete collection of curated essentials.'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className={`hidden md:block w-56 shrink-0`}>
            <div className="sticky top-24">
              <h3 className="font-medium mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`text-sm transition-colors ${
                      !selectedCategory
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All Products
                  </button>
                </li>
                {categories?.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`text-sm transition-colors ${
                        selectedCategory === category.slug
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-6"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background md:hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <h3 className="font-medium mb-4">Categories</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowFilters(false);
                      }}
                      className={`text-sm ${
                        !selectedCategory
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories?.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.slug);
                          setShowFilters(false);
                        }}
                        className={`text-sm ${
                          selectedCategory === category.slug
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearFilters();
                      setShowFilters(false);
                    }}
                    className="mt-6 w-full"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              {products?.length || 0} products
            </div>
            <ProductGrid products={products || []} loading={isLoading} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
