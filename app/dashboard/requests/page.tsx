'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Calendar, MapPin, Clock, Package } from 'lucide-react';
import { format } from 'date-fns/format';
import { useTranslation } from 'react-i18next';

interface MaintenanceRequest {
  id: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  description: string;
  status: string;
  include_parts: boolean;
  created_at: string;
  address_text: string;
  address: {
    address_line1: string;
    city: string;
    postal_code: string;
  } | null;
}

export default function RequestsPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadRequests();
    }
  }, [user, authLoading, router]);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(`
        id,
        service_type,
        preferred_date,
        preferred_time,
        description,
        status,
        include_parts,
        created_at,
        address_text,
        address:addresses(address_line1, city, postal_code)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data as any);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('requests.pageTitle')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('requests.pageDescription')}</p>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Wrench className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('requests.noRequests')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('requests.noRequestsDescription')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center">
                        <Wrench className="h-5 w-5 mr-2 text-[#0d5a7d]" />
                        {request.service_type}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {t('requests.requestedOn')} {format(new Date(request.created_at), 'PPP')}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {t(`requests.statuses.${request.status}`).replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-2 text-sm">
                        <Calendar className="h-4 w-4 mt-0.5 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{t('requests.preferredDate')}</p>
                          <p className="text-slate-600 dark:text-slate-400">
                            {format(new Date(request.preferred_date), 'PPP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 text-sm">
                        <Clock className="h-4 w-4 mt-0.5 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{t('requests.preferredTime')}</p>
                          <p className="text-slate-600 dark:text-slate-400">{request.preferred_time}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{t('requests.serviceLocation')}</p>
                        <p className="text-slate-600 dark:text-slate-400">
                          {request.address_text || (request.address ? `${request.address.address_line1}, ${request.address.city} ${request.address.postal_code}` : t('requests.addressDeleted'))}
                        </p>
                      </div>
                    </div>

                    {request.description && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2 text-slate-900 dark:text-white text-sm">{t('requests.descriptionLabel')}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{request.description}</p>
                      </div>
                    )}

                    {request.include_parts && (
                      <div className="border-t pt-4">
                        <div className="flex items-center space-x-2 text-sm text-[#0d5a7d]">
                          <Package className="h-4 w-4" />
                          <span className="font-semibold">{t('requests.technicianParts')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
