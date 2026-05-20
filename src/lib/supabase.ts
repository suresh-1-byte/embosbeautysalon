import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Offer = {
  id: string;
  title: string;
  description: string;
  active: boolean;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  description: string;
  category: string;
  created_at: string;
};

export type Transformation = {
  id: string;
  before_url: string;
  after_url: string;
  description: string;
  created_at: string;
};

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  date: string;
  time_slot: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

export type Review = {
  id: string;
  name: string;
  service: string;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
};
