export type CompanyRow = {
  id: string;
  name: string;
  logo_url: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  service_booking_url: string | null;
  default_service_interval: number;
  created_at: string;
  updated_at: string;
};

export type CustomerRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerFormRow = Pick<
  CustomerRow,
  'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'address' | 'city' | 'state' | 'postal_code' | 'country'
>;

export type CompanyMemberRow = {
  id: string;
  user_id: string;
  company_id: string;
  role: 'owner' | 'admin' | 'technician';
  created_at: string;
};

export type ProfileRow = {
  id: string;
  company_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
};

export type SessionUser = {
  id: string;
  email: string | null;
};

export type Membership = {
  companyId: string;
  role: CompanyMemberRow['role'];
  company: CompanyRow;
};
