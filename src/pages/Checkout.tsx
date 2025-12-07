import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, CreditCard, Loader2, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  email: z.string().email('Valid email required'),
  firstName: z.string().min(1, 'First name required').max(50),
  lastName: z.string().min(1, 'Last name required').max(50),
  address: z.string().min(5, 'Address required').max(200),
  city: z.string().min(2, 'City required').max(100),
  state: z.string().min(2, 'State required').max(50),
  zipCode: z.string().min(5, 'Valid zip code required').max(10),
  cardNumber: z.string().regex(/^\d{16}$/, 'Enter 16-digit card number'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter 3 or 4 digit CVV'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (items.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  const shipping = totalPrice >= 100 ? 0 : 10;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const onSubmit = async (data: CheckoutForm) => {
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'confirmed',
          total: grandTotal,
          payment_status: 'paid',
          shipping_address: {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      setSuccess(true);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was an error processing your order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="container py-16 text-center max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-3xl font-display font-medium mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your order has been confirmed. We'll send you a confirmation email with tracking details shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/orders">
              <Button variant="outline">View Orders</Button>
            </Link>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Link
          to="/cart"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-display font-medium mb-8">Checkout</h1>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-medium mb-4">Contact</h2>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    className="mt-1.5"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...form.register('firstName')}
                      className="mt-1.5"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...form.register('lastName')}
                      className="mt-1.5"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...form.register('address')}
                      className="mt-1.5"
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...form.register('city')}
                      className="mt-1.5"
                    />
                    {form.formState.errors.city && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...form.register('state')}
                        className="mt-1.5"
                      />
                      {form.formState.errors.state && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.state.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        {...form.register('zipCode')}
                        className="mt-1.5"
                      />
                      {form.formState.errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment (Demo)
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a demo checkout. No real payment will be processed.
                  Use any 16-digit number.
                </p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234567890123456"
                      {...form.register('cardNumber')}
                      className="mt-1.5"
                    />
                    {form.formState.errors.cardNumber && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.cardNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        {...form.register('expiry')}
                        className="mt-1.5"
                      />
                      {form.formState.errors.expiry && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.expiry.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        {...form.register('cvv')}
                        className="mt-1.5"
                      />
                      {form.formState.errors.cvv && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.cvv.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border my-4" />

                <div className="flex justify-between font-medium text-lg mb-6">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${grandTotal.toFixed(2)}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
