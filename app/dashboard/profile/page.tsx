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
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { LocationPicker } from '@/components/location-picker';

interface Profile {
  full_name: string;
  phone: string;
}

interface Address {
  id: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  location_link?: string;
  is_default: boolean;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ full_name: '', phone: '' });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    location_link: '',
    is_default: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadProfile();
      loadAddresses();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const loadAddresses = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id)
      .order('is_default', { ascending: false });

    if (!error && data) {
      setAddresses(data);
    }
  };

  const saveProfile = async () => {
    if (!profile.full_name) {
      toast.error(t('profile.fullNameRequired'));
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id);

    if (error) {
      toast.error(t('profile.error'));
    } else {
      toast.success(t('profile.success'));
    }
    setSaving(false);
  };

  const addAddress = async () => {
    if (!newAddress.address_line1 || !newAddress.city || !newAddress.postal_code) {
      toast.error(t('profile.requiredFields'));
      return;
    }

    const { error } = await supabase
      .from('addresses')
      .insert([{ ...newAddress, user_id: user?.id }]);

    if (error) {
      toast.error(t('profile.addressError'));
    } else {
      toast.success(t('profile.addressAdded'));
      setNewAddress({
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        location_link: '',
        is_default: false,
      });
      loadAddresses();
    }
  };

  const deleteAddress = async (addressId: string) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      toast.error(t('profile.deleteError'));
    } else {
      toast.success(t('profile.addressDeleted'));
      loadAddresses();
    }
  };

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('profile.settingsTitle')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('profile.settingsDescription')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-[#0d5a7d]" />
              {t('profile.personalInfo')}
            </CardTitle>
            <CardDescription>{t('profile.updateDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">{t('profile.email')}</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="full_name">{t('profile.fullName')}</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder={t('profile.fullNamePlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="phone">{t('profile.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder={t('profile.phonePlaceholder')}
              />
            </div>
            <Button
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? t('profile.saving') : t('profile.save')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-[#0d5a7d]" />
              {t('profile.savedAddresses')}
            </CardTitle>
            <CardDescription>{t('profile.manageAddresses')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {addresses.length > 0 && (
              <>
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {address.address_line1}
                          {address.is_default && (
                            <span className="ml-2 text-xs bg-[#17a2b8] text-white px-2 py-1 rounded">
                              {t('profile.default')}
                            </span>
                          )}
                        </p>
                        {address.address_line2 && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">{address.address_line2}</p>
                        )}
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {address.city}, {address.postal_code}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteAddress(address.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Separator />
              </>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">{t('profile.addNewAddress')}</h4>
              <div className="grid gap-4">
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
                <div className="grid md:grid-cols-2 gap-4">
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
                <Button onClick={addAddress}>
                  {t('profile.addNewAddress')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
