import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Business {
  id: string;
  name: string;
  currency: string;
  industry: string | null;
  country: string | null;
}

interface BusinessContextValue {
  businesses: Business[];
  activeBusiness: Business | null;
  loading: boolean;
  setActiveBusiness: (business: Business) => Promise<void>;
  createBusiness: (name: string, currency?: string, industry?: string) => Promise<{ error: string | null }>;
  refreshBusinesses: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusiness, setActiveBusinessState] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);

  const loadBusinesses = useCallback(async () => {
    if (!user) {
      setBusinesses([]);
      setActiveBusinessState(null);
      return;
    }
    setLoading(true);
    try {
      const [{ data: bizData }, { data: profileData }] = await Promise.all([
        supabase.from('businesses').select('*').eq('owner_id', user.id).order('created_at'),
        supabase.from('profiles').select('active_business_id').eq('id', user.id).single(),
      ]);
      const list: Business[] = (bizData ?? []).map((b: Record<string, unknown>) => ({
        id: b.id as string,
        name: b.name as string,
        currency: (b.currency as string) ?? 'KES',
        industry: (b.industry as string | null) ?? null,
        country: (b.country as string | null) ?? null,
      }));
      setBusinesses(list);
      if (list.length > 0) {
        const activeId = profileData?.active_business_id;
        const active = list.find(b => b.id === activeId) ?? list[0];
        setActiveBusinessState(active);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const setActiveBusiness = async (business: Business) => {
    setActiveBusinessState(business);
    if (user) {
      await supabase
        .from('profiles')
        .update({ active_business_id: business.id })
        .eq('id', user.id);
    }
  };

  const createBusiness = async (name: string, currency = 'KES', industry?: string) => {
    if (!user) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('businesses')
      .insert({ owner_id: user.id, name, currency, industry: industry ?? null })
      .select()
      .single();
    if (error) return { error: error.message };
    const newBiz: Business = {
      id: data.id,
      name: data.name,
      currency: data.currency,
      industry: data.industry,
      country: data.country,
    };
    setBusinesses(prev => [...prev, newBiz]);
    if (!activeBusiness) {
      await setActiveBusiness(newBiz);
    }
    return { error: null };
  };

  return (
    <BusinessContext.Provider
      value={{ businesses, activeBusiness, loading, setActiveBusiness, createBusiness, refreshBusinesses: loadBusinesses }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used inside BusinessProvider');
  return ctx;
}
