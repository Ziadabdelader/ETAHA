'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Wrench, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LocationPicker } from '@/components/location-picker';

interface Address {
  id: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  location_link?: string;
}

export default function MaintenancePage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const [formData, setFormData] = useState({
    address_id: '',
    service_type: '',
    preferred_date: '',
    preferred_time: '',
    description: '',
    include_parts: false,
  });

  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    location_link: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadAddresses();
    }
  }, [user, authLoading, router]);

  const loadAddresses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id)
      .order('is_default', { ascending: false });

    if (error) {
      toast.error(t('profile.error'));
    } else {
      setAddresses(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, address_id: data[0].id }));
      }
    }
    setLoading(false);
  };

  const saveNewAddress = async () => {
    if (!newAddress.address_line1 || !newAddress.city || !newAddress.postal_code) {
      toast.error(t('common.requiredFields'));
      return;
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert([{ ...newAddress, user_id: user?.id }])
      .select()
      .single();

    if (error) {
      console.error('Address save error:', error);
      toast.error(t('profile.addressError'));
    } else {
      toast.success(t('profile.addressAdded'));
      setShowNewAddress(false);
      setNewAddress({
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        location_link: '',
      });
      loadAddresses();
      if (data) {
        setFormData((prev) => ({ ...prev, address_id: data.id }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address_id || !formData.service_type || !formData.preferred_date || !formData.preferred_time) {
      toast.error(t('profile.requiredFields'));
      return;
    }

    setSubmitting(true);

    try {
      // Find the selected address to save its snapshot
      const selectedAddress = addresses.find(a => a.id === formData.address_id);
      if (!selectedAddress) {
        toast.error(t('maintenance.selectService'));
        return;
      }

      // Create address snapshot text
      const addressText = `${selectedAddress.address_line1}${selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''}, ${selectedAddress.city}, ${selectedAddress.postal_code}`;

      const { error } = await supabase
        .from('maintenance_requests')
        .insert([
          {
            user_id: user?.id,
            address_id: formData.address_id,
            address_text: addressText, // Save address snapshot
            service_type: formData.service_type,
            preferred_date: formData.preferred_date,
            preferred_time: formData.preferred_time,
            description: formData.description,
            include_parts: formData.include_parts,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      toast.success(t('maintenance.submitted'));
      router.push('/dashboard/requests');
    } catch (error: any) {
      toast.error(t('maintenance.submitError'));
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const serviceTypes = [
    { value: 'General Inspection', label: t('maintenance.services.general_inspection') },
    { value: 'Tire Replacement', label: t('maintenance.services.tire_replacement') },
    { value: 'Brake Adjustment', label: t('maintenance.services.brake_adjustment') },
    { value: 'Wheel Alignment', label: t('maintenance.services.wheel_alignment') },
    { value: 'Battery Service', label: t('maintenance.services.battery_service') },
    { value: 'Frame Repair', label: t('maintenance.services.frame_repair') },
    { value: 'Upholstery Repair', label: t('maintenance.services.upholstery_repair') },
    { value: 'Complete Overhaul', label: t('maintenance.services.complete_overhaul') },
  ];

  const timeSlots = [
    { value: '9:00 AM - 11:00 AM', label: t('maintenance.timeSlots.morning') },
    { value: '11:00 AM - 1:00 PM', label: t('maintenance.timeSlots.midday') },
    { value: '1:00 PM - 3:00 PM', label: t('maintenance.timeSlots.afternoon') },
    { value: '3:00 PM - 5:00 PM', label: t('maintenance.timeSlots.evening') },
  ];

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17a2b8]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('maintenance.pageTitle')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('maintenance.pageDescription')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-6 w-6 mr-2 text-[#0d5a7d]" />
              {t('maintenance.formTitle')}
            </CardTitle>
            <CardDescription>
              {t('maintenance.formDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>{t('maintenance.serviceLocation')}</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewAddress(!showNewAddress)}
                  >
                    {showNewAddress ? t('common.cancel') : t('profile.addNewAddress')}
                  </Button>
                </div>

                {showNewAddress ? (
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <Label htmlFor="new_address_line1">{t('maintenance.addressLine1')}</Label>
                        <Input
                          id="new_address_line1"
                          value={newAddress.address_line1}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                          placeholder="123 Main St"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new_address_line2">{t('maintenance.addressLine2Optional')}</Label>
                        <Input
                          id="new_address_line2"
                          value={newAddress.address_line2}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                          placeholder="Apt 4B"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new_city">{t('cart.checkoutFlow.city')}</Label>
                          <Input
                            id="new_city"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new_postal_code">{t('cart.checkoutFlow.postalCode')}</Label>
                          <Input
                            id="new_postal_code"
                            value={newAddress.postal_code}
                            onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                            placeholder="10001"
                          />
                        </div>
                      </div>
                      <LocationPicker
                        value={newAddress.location_link}
                        onChange={(link) => setNewAddress({ ...newAddress, location_link: link })}
                      />
                      <Button type="button" onClick={saveNewAddress} className="w-full">
                        {t('cart.checkoutFlow.saveAddress')}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Select value={formData.address_id} onValueChange={(value) => setFormData({ ...formData, address_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('maintenance.selectService')} />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.address_line1}, {address.city} {address.postal_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label htmlFor="service_type">{t('maintenance.serviceType')}</Label>
                <Select value={formData.service_type} onValueChange={(value) => setFormData({ ...formData, service_type: value })}>
                  <SelectTrigger id="service_type">
                    <SelectValue placeholder={t('maintenance.selectService')} />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred_date">{t('maintenance.date')}</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="preferred_date"
                      type="date"
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="preferred_time">{t('maintenance.time')}</Label>
                  <Select value={formData.preferred_time} onValueChange={(value) => setFormData({ ...formData, preferred_time: value })}>
                    <SelectTrigger id="preferred_time">
                      <SelectValue placeholder={t('maintenance.selectTime')} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t('maintenance.descriptionLabel')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('maintenance.descriptionPlaceholder')}
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                <div>
                  <Label htmlFor="include_parts" className="text-base font-semibold">{t('maintenance.includeParts')}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('maintenance.includePartsDescription')}
                  </p>
                </div>
                <Switch
                  id="include_parts"
                  checked={formData.include_parts}
                  onCheckedChange={(checked) => setFormData({ ...formData, include_parts: checked })}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 text-lg"
              >
                {submitting ? t('maintenance.submitting') : t('maintenance.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
