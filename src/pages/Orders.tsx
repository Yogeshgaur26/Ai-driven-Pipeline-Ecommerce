import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-primary/10 text-primary',
  shipped: 'bg-blue-500/10 text-blue-500',
  delivered: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-16 flex justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-display font-medium mb-8">My Orders</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-32" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-display font-medium mb-4">No Orders Yet</h1>
          <p className="text-muted-foreground mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link to="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl font-display font-medium mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-lg border border-border p-6 animate-fade-in"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm text-muted-foreground">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                        statusColors[order.status] || 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on{' '}
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg">
                    ${parseFloat(String(order.total)).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.order_items?.length || 0} items
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="border-t border-border pt-4">
                <div className="flex flex-wrap gap-2">
                  {order.order_items?.slice(0, 3).map((item: any) => (
                    <span
                      key={item.id}
                      className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full"
                    >
                      {item.product_name} × {item.quantity}
                    </span>
                  ))}
                  {order.order_items && order.order_items.length > 3 && (
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      +{order.order_items.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
