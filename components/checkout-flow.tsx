'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, ChevronLeft, ChevronRight, CreditCard, Wallet, MapPin, Package, CheckCircle2, Lock, Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';
import { LocationPicker } from '@/components/location-picker';

// ── SVG logo helpers ────────────────────────────────────────────────────────

/** Mastercard two-circle logo */
function MastercardLogo() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" aria-label="Mastercard">
      <circle cx="13" cy="12" r="12" fill="#EB001B" />
      <circle cx="25" cy="12" r="12" fill="#F79E1B" />
      <path d="M19 5.27A12 12 0 0 1 24.73 12 12 12 0 0 1 19 18.73 12 12 0 0 1 13.27 12 12 12 0 0 1 19 5.27z" fill="#FF5F00" />
    </svg>
  );
}

/** Visa wordmark */
function VisaLogo() {
  return (
    <svg viewBox="0 0 60 20" className="h-5 w-auto" aria-label="Visa">
      <text x="0" y="16" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#1A1F71">VISA</text>
    </svg>
  );
}

/** Amex blue box */
function AmexLogo() {
  return (
    <span className="inline-flex items-center justify-center bg-[#2E77BC] text-white text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ letterSpacing: '0.05em' }}>
      AMEX
    </span>
  );
}

/** Apple Pay pill */
function ApplePayLogo() {
  return (
    <span className="inline-flex items-center gap-1 border border-gray-300 rounded px-2 py-0.5 text-xs font-semibold text-gray-800 bg-white">
      <svg viewBox="0 0 14 16" className="h-3.5 w-auto fill-current"><path d="M11.47 8.55c-.02-2.08 1.7-3.08 1.78-3.13-0.97-1.42-2.48-1.61-3.02-1.63-1.29-.13-2.52.76-3.17.76-.65 0-1.66-.74-2.73-.72C2.8 3.85 1.5 4.67.77 5.97-.72 8.6.38 12.5 1.84 14.63c.72 1.05 1.58 2.22 2.7 2.18 1.08-.04 1.49-.7 2.8-.7 1.3 0 1.67.7 2.81.68 1.17-.02 1.91-1.07 2.62-2.12.83-1.21 1.17-2.39 1.19-2.45-.03-.01-2.27-.87-2.29-3.47z"/><path d="M9.37 2.3C9.95 1.6 10.35.62 10.23-.4 9.36-.35 8.3.2 7.7.92 7.16 1.57 6.68 2.58 6.82 3.54c.97.07 1.96-.48 2.55-1.24z"/></svg>
      Pay
    </span>
  );
}

/** Meeza logo text */
function MeezaLogo() {
  return (
    <span className="inline-flex items-center justify-center bg-[#6B2D8B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ letterSpacing: '0.03em' }}>
      meeza
    </span>
  );
}

/** valU logo */
function ValULogo() {
  return (
    <span className="inline-flex items-center justify-center border border-[#F26522] text-[#F26522] text-[10px] font-bold px-2 py-0.5 rounded" style={{ letterSpacing: '0.05em' }}>
      valU<span className="text-[#F26522]">*</span>
    </span>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

type OnlineSubMethod = 'credit_card' | 'apple_pay' | 'paymob_wallet' | 'valu';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

interface Address {
  id: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  location_link?: string;
}

interface CheckoutFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  addresses: Address[];
  onAddAddress: (address: Omit<Address, 'id'>) => Promise<Address>;
  onPlaceOrder: (data: {
    addressId: string;
    paymentMethod: 'cash' | 'online';
    notes: string;
    cardDetails?: {
      cardholderName: string;
      lastFour: string;
      expiryMonth: string;
      expiryYear: string;
    };
  }) => Promise<{ success: boolean; orderId?: string }>;
  onUpdateQuantity?: (itemId: string, newQuantity: number) => Promise<void>;
  onRemoveItem?: (itemId: string) => Promise<void>;
}

export function CheckoutFlow({
  open,
  onOpenChange,
  cartItems,
  addresses,
  onAddAddress,
  onPlaceOrder,
  onUpdateQuantity,
  onRemoveItem,
}: CheckoutFlowProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [onlineSubMethod, setOnlineSubMethod] = useState<OnlineSubMethod | ''>('');
  const [orderNotes, setOrderNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Card / wallet details state
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [valuUsername, setValuUsername] = useState('');
  const [valuPassword, setValuPassword] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [showPaymobModal, setShowPaymobModal] = useState(false);
  const [faceIdVerified, setFaceIdVerified] = useState(false);

  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    location_link: '',
  });

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  // Validate card fields (not needed for apple_pay / valu)
  const validateCard = (): boolean => {
    const errors: Record<string, string> = {};
    const rawNumber = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardDetails.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
    if (rawNumber.length !== 16) errors.cardNumber = 'Enter a valid 16-digit card number';
    if (!cardDetails.expiryMonth || parseInt(cardDetails.expiryMonth) < 1 || parseInt(cardDetails.expiryMonth) > 12) errors.expiryMonth = 'Invalid month';
    const currentYear = new Date().getFullYear() % 100;
    if (!cardDetails.expiryYear || parseInt(cardDetails.expiryYear) < currentYear) errors.expiryYear = 'Invalid year';
    if (cardDetails.cvv.length < 3) errors.cvv = 'Enter a valid CVV';
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateValu = (): boolean => {
    const errors: Record<string, string> = {};
    if (!valuUsername.trim()) errors.valuUsername = 'Username / email is required';
    if (!valuPassword.trim()) errors.valuPassword = 'Password is required';
    // Also validate card fields for valU
    const rawNumber = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardDetails.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
    if (rawNumber.length !== 16) errors.cardNumber = 'Enter a valid 16-digit card number';
    if (!cardDetails.expiryMonth || parseInt(cardDetails.expiryMonth) < 1 || parseInt(cardDetails.expiryMonth) > 12) errors.expiryMonth = 'Invalid month';
    const currentYear = new Date().getFullYear() % 100;
    if (!cardDetails.expiryYear || parseInt(cardDetails.expiryYear) < currentYear) errors.expiryYear = 'Invalid year';
    if (cardDetails.cvv.length < 3) errors.cvv = 'Enter a valid CVV';
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const steps = [
    { number: 1, title: t('cart.checkoutFlow.step1'), icon: Package },
    { number: 2, title: t('cart.checkoutFlow.step2'), icon: MapPin },
    { number: 3, title: t('cart.checkoutFlow.step3'), icon: Wallet },
    { number: 4, title: t('cart.checkoutFlow.step4'), icon: CheckCircle2 },
  ];

  const saveNewAddress = async (): Promise<Address | null> => {
    const addressPayload = {
      address_line1: newAddress.address_line1.trim(),
      address_line2: newAddress.address_line2.trim(),
      city: newAddress.city.trim(),
      postal_code: newAddress.postal_code.trim(),
      location_link: newAddress.location_link.trim(),
    };

    if (!addressPayload.address_line1 || !addressPayload.city || !addressPayload.postal_code) {
      toast.error(t('common.required'));
      return null;
    }

    setSavingAddress(true);
    try {
      const savedAddress = await onAddAddress(addressPayload);
      setSelectedAddress(savedAddress.id);
      setShowNewAddress(false);
      setNewAddress({ address_line1: '', address_line2: '', city: '', postal_code: '', location_link: '' });
      toast.success(t('cart.checkoutFlow.saveAddress'));
      return savedAddress;
    } catch (error) {
      console.error('Checkout address save failed:', error);
      toast.error(t('cart.orderError'));
      return null;
    } finally {
      setSavingAddress(false);
    }
  };

  const handleNext = async () => {
    if (step === 2) {
      if (showNewAddress) {
        const savedAddress = await saveNewAddress();
        if (!savedAddress) return;
      } else if (!selectedAddress) {
        toast.error(t('cart.checkoutFlow.selectAddress'));
        return;
      }
    }
    if (step === 3) {
      if (paymentMethod === 'online') {
        if (!onlineSubMethod) {
          toast.error('Please select an online payment method');
          return;
        }
        // Open Paymob modal immediately
        setShowPaymobModal(true);
        return;
      }
    }
    if (step < 4) setStep(step + 1);
  };

  // Called when user clicks "Pay" inside the Paymob modal
  const handlePaymobPay = () => {
    if (!validateCard()) return;
    setShowPaymobModal(false);
    setStep(4);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveAddress = async () => {
    await saveNewAddress();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error(t('cart.checkoutFlow.selectAddress'));
      return;
    }

    setProcessing(true);
    try {
      const rawNumber = cardDetails.cardNumber.replace(/\s/g, '');
      const result = await onPlaceOrder({
        addressId: selectedAddress,
        paymentMethod,
        notes: orderNotes,
        cardDetails: paymentMethod === 'online' ? {
          cardholderName: cardDetails.cardholderName,
          lastFour: rawNumber.slice(-4),
          expiryMonth: cardDetails.expiryMonth,
          expiryYear: cardDetails.expiryYear,
        } : undefined,
      });

      if (result.success) {
        setOrderSuccess(true);
        setOrderId(result.orderId || '');
        toast.success(t('cart.checkoutFlow.orderSuccess'));
      } else {
        toast.error(t('cart.orderError'));
      }
    } catch (error) {
      toast.error(t('cart.orderError'));
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOrderSuccess(false);
    setOrderId('');
    setOrderNotes('');
    setPaymentMethod('cash');
    setOnlineSubMethod('');
    setCardDetails({ cardholderName: '', cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' });
    setValuUsername('');
    setValuPassword('');
    setCardErrors({});
    setSaveCard(false);
    setShowPaymobModal(false);
    setFaceIdVerified(false);
    onOpenChange(false);
  };

  const selectedAddressData = addresses.find((a) => a.id === selectedAddress);

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-primary">
            {t('cart.checkout')}
          </DialogTitle>
        </DialogHeader>

        {!orderSuccess ? (
          <>
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        step >= s.number
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground'
                      }`}
                    >
                      {step > s.number ? (
                        <Check className="h-4 w-4 sm:h-6 sm:w-6" />
                      ) : (
                        <s.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs mt-1 sm:mt-2 text-center hidden xs:block">{s.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 sm:mx-2 transition-colors ${
                        step > s.number ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {/* Step 1: Review Cart */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">{t('cart.checkoutFlow.reviewOrder')}</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {cartItems.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              {item.product.image_url ? (
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Package className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{item.product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.product.price)} {t('cart.each')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {onUpdateQuantity && (
                                <>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              {!onUpdateQuantity && (
                                <span className="text-sm text-muted-foreground">
                                  {t('cart.quantity')}: {item.quantity}
                                </span>
                              )}
                            </div>
                            <div className="text-right flex items-center space-x-2">
                              <div>
                                <p className="font-bold text-primary">
                                  {formatCurrency(item.product.price * item.quantity)}
                                </p>
                              </div>
                              {onRemoveItem && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => onRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card className="mt-4 bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">{t('cart.total')}:</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Delivery Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{t('cart.checkoutFlow.selectAddress')}</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowNewAddress(!showNewAddress)}
                    >
                      {showNewAddress ? t('cart.checkoutFlow.cancel') : t('cart.checkoutFlow.addNewAddress')}
                    </Button>
                  </div>

                  {showNewAddress ? (
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <Label htmlFor="address_line1">{t('maintenance.addressLine1')}</Label>
                          <Input
                            id="address_line1"
                            value={newAddress.address_line1}
                            onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                            placeholder="123 Main St"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_line2">{t('maintenance.addressLine2Optional')}</Label>
                          <Input
                            id="address_line2"
                            value={newAddress.address_line2}
                            onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                            placeholder="Apt 4B"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">{t('cart.checkoutFlow.city')}</Label>
                            <Input
                              id="city"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              placeholder={t('cart.checkoutFlow.cityPlaceholder')}
                            />
                          </div>
                          <div>
                            <Label htmlFor="postal">{t('cart.checkoutFlow.postalCode')}</Label>
                            <Input
                              id="postal"
                              value={newAddress.postal_code}
                              onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                              placeholder="12345"
                            />
                          </div>
                        </div>
                        <LocationPicker
                          value={newAddress.location_link}
                          onChange={(link) => setNewAddress({ ...newAddress, location_link: link })}
                        />
                        <Button onClick={handleSaveAddress} disabled={savingAddress} className="w-full">
                          {savingAddress ? t('common.loading') : t('cart.checkoutFlow.saveAddress')}
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                      <div className="space-y-3">
                        {addresses.map((address) => (
                          <Card
                            key={address.id}
                            className={`cursor-pointer transition-colors ${
                              selectedAddress === address.id ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setSelectedAddress(address.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <RadioGroupItem value={address.id} id={address.id} />
                                <div className="flex-1">
                                  <p className="font-medium">{address.address_line1}</p>
                                  {address.address_line2 && (
                                    <p className="text-sm text-muted-foreground">{address.address_line2}</p>
                                  )}
                                  <p className="text-sm text-muted-foreground">
                                    {address.city}, {address.postal_code}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-1">{t('cart.checkoutFlow.paymentMethod')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">All transactions are secure and encrypted.</p>

                  <RadioGroup value={paymentMethod} onValueChange={(v: any) => { setPaymentMethod(v); if (v === 'cash') setOnlineSubMethod(''); }}>

                    {/* ── Cash on Delivery ── */}
                    <Card
                      className={`cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => { setPaymentMethod('cash'); setOnlineSubMethod(''); }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="cash" id="cash" />
                          <div className="flex-1 flex items-center justify-between">
                            <Label htmlFor="cash" className="text-base font-medium cursor-pointer">
                              {t('cart.checkoutFlow.cashOnDelivery')}
                            </Label>
                            <Wallet className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                        {paymentMethod === 'cash' && (
                          <p className="text-xs text-muted-foreground mt-2 ml-7">{t('cart.checkoutFlow.cashOnDeliveryDesc')}</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* ── Online Payment ── */}
                    <Card
                      className={`cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setPaymentMethod('online')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="online" id="online" />
                          <div className="flex-1 flex items-center justify-between">
                            <Label htmlFor="online" className="text-base font-medium cursor-pointer">
                              {t('cart.checkoutFlow.onlinePayment')}
                            </Label>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Lock className="h-3 w-3" /> Secure
                            </span>
                          </div>
                        </div>

                        {/* Sub-method list — shown when online is selected */}
                        {paymentMethod === 'online' && (
                          <div className="mt-3 ml-7 space-y-2" onClick={(e) => e.stopPropagation()}>

                            {/* Pay via Debit/Credit cards */}
                            <div
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${onlineSubMethod === 'paymob_wallet' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/40'}`}
                              onClick={() => setOnlineSubMethod('paymob_wallet')}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${onlineSubMethod === 'paymob_wallet' ? 'border-primary' : 'border-muted-foreground'}`}>
                                  {onlineSubMethod === 'paymob_wallet' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <span className="text-sm font-medium leading-tight">Pay via (Debit/Credit cards)</span>
                              </div>
                              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                <MastercardLogo />
                                <VisaLogo />
                                <MeezaLogo />
                              </div>
                            </div>

                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </RadioGroup>

                  <div className="mt-6">
                    <Label htmlFor="notes">{t('cart.checkoutFlow.orderNotes')}</Label>
                    <Textarea
                      id="notes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder={t('cart.checkoutFlow.orderNotesPlaceholder')}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">{t('cart.checkoutFlow.reviewOrder')}</h3>

                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">{t('cart.checkoutFlow.deliveryAddress')}</h4>
                        {selectedAddressData && (
                          <div className="text-sm text-muted-foreground">
                            <p>{selectedAddressData.address_line1}</p>
                            {selectedAddressData.address_line2 && <p>{selectedAddressData.address_line2}</p>}
                            <p>
                              {selectedAddressData.city}, {selectedAddressData.postal_code}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t('cart.checkoutFlow.paymentMethodLabel')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {paymentMethod === 'cash'
                            ? t('cart.checkoutFlow.cashOnDelivery')
                            : t('cart.checkoutFlow.onlinePayment')}
                        </p>
                        {paymentMethod === 'online' && cardDetails.cardNumber && (
                          <p className="text-sm text-muted-foreground font-mono mt-1">
                            •••• •••• •••• {cardDetails.cardNumber.replace(/\s/g, '').slice(-4)}
                          </p>
                        )}
                      </div>

                      {orderNotes && (
                        <div>
                          <h4 className="font-semibold mb-2">{t('cart.checkoutFlow.orderNotes')}</h4>
                          <p className="text-sm text-muted-foreground">{orderNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-4">{t('cart.checkoutFlow.orderSummary')}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('cart.checkoutFlow.items')} ({cartItems.length})</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t('cart.checkoutFlow.deliveryFee')}</span>
                          <span className="text-green-600">{t('cart.checkoutFlow.free')}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-lg font-bold">
                            <span>{t('cart.checkoutFlow.grandTotal')}</span>
                            <span className="text-primary">{formatCurrency(totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t('cart.checkoutFlow.previous')}
              </Button>

              {step < 4 ? (
                <Button onClick={handleNext} disabled={savingAddress}>
                  {t('cart.checkoutFlow.next')}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handlePlaceOrder} disabled={processing} size="lg">
                  {processing ? t('cart.checkoutFlow.processing') : t('cart.checkoutFlow.confirmOrder')}
                </Button>
              )}
            </div>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t('cart.checkoutFlow.orderSuccess')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('cart.checkoutFlow.orderNumber')}: <span className="font-mono font-semibold">{orderId}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => (window.location.href = '/dashboard/orders')}>
                {t('cart.checkoutFlow.viewOrders')}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                {t('cart.checkoutFlow.continueShopping')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* ── Paymob-style payment modal ── */}
    <Dialog open={showPaymobModal} onOpenChange={(open) => { if (!open) setShowPaymobModal(false); }}>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl bg-[#f5f5f5]">
        <DialogHeader className="sr-only">
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>

        {/* Header row — title + logos */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#f5f5f5]">
          <div>
            <span className="text-base font-semibold text-gray-700">
              Pay via Cards / Wallets
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MastercardLogo />
            <VisaLogo />
            <MeezaLogo />
          </div>
        </div>

        {/* Form body */}
        <div className="px-6 pb-2 space-y-3 bg-[#f5f5f5]">

          {/* Card form */}
          <div>
            <Input
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
              maxLength={19}
              className={`bg-white border-0 rounded-xl h-12 font-mono tracking-widest text-gray-700 placeholder:text-gray-400 shadow-sm ${cardErrors.cardNumber ? 'ring-2 ring-destructive' : ''}`}
            />
            {cardErrors.cardNumber && <p className="text-xs text-destructive mt-1 px-1">{cardErrors.cardNumber}</p>}
          </div>
          <div>
            <Input
              placeholder="Card Holder Name"
              value={cardDetails.cardholderName}
              onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
              className={`bg-white border-0 rounded-xl h-12 text-gray-700 placeholder:text-gray-400 shadow-sm ${cardErrors.cardholderName ? 'ring-2 ring-destructive' : ''}`}
            />
            {cardErrors.cardholderName && <p className="text-xs text-destructive mt-1 px-1">{cardErrors.cardholderName}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="Exp. Month"
                value={cardDetails.expiryMonth}
                onChange={(e) => setCardDetails({ ...cardDetails, expiryMonth: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                maxLength={2}
                className={`bg-white border-0 rounded-xl h-12 text-center font-mono text-gray-700 placeholder:text-gray-400 shadow-sm ${cardErrors.expiryMonth ? 'ring-2 ring-destructive' : ''}`}
              />
              {cardErrors.expiryMonth && <p className="text-xs text-destructive mt-1 px-1">{cardErrors.expiryMonth}</p>}
            </div>
            <div>
              <Input
                placeholder="Exp. Year"
                value={cardDetails.expiryYear}
                onChange={(e) => setCardDetails({ ...cardDetails, expiryYear: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                maxLength={2}
                className={`bg-white border-0 rounded-xl h-12 text-center font-mono text-gray-700 placeholder:text-gray-400 shadow-sm ${cardErrors.expiryYear ? 'ring-2 ring-destructive' : ''}`}
              />
              {cardErrors.expiryYear && <p className="text-xs text-destructive mt-1 px-1">{cardErrors.expiryYear}</p>}
            </div>
          </div>
          <div>
            <Input
              placeholder="CCV"
              type="password"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              maxLength={4}
              className={`bg-white border-0 rounded-xl h-12 font-mono text-gray-700 placeholder:text-gray-400 shadow-sm ${cardErrors.cvv ? 'ring-2 ring-destructive' : ''}`}
            />
            {cardErrors.cvv && <p className="text-xs text-destructive mt-1 px-1">{cardErrors.cvv}</p>}
          </div>
          <div className="flex items-center gap-2 py-1">
            <Checkbox
              id="saveCard"
              checked={saveCard}
              onCheckedChange={(checked) => setSaveCard(checked === true)}
              className="rounded-sm"
            />
            <label htmlFor="saveCard" className="text-sm text-gray-600 cursor-pointer select-none">
              save card
            </label>
          </div>

          {/* Pay button */}
          <Button
            onClick={handlePaymobPay}
            className="w-full h-12 rounded-xl text-base font-semibold bg-[#4CAF50] hover:bg-[#43A047] text-white border-0"
          >
            Pay
          </Button>
        </div>

        {/* Paymob branding */}
        <div className="flex justify-center items-center py-4 bg-[#f5f5f5]">
          <span className="text-xl font-bold tracking-tight" style={{ color: '#0d47a1', fontFamily: 'Arial, sans-serif' }}>
            paymob<span style={{ color: '#0d47a1' }}>.</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
