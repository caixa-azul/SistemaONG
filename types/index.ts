// Enums definidos manualmente para compatibilidade com SQLite
export const UserRole = {
  ADMIN: 'ADMIN',
  VOLUNTEER: 'VOLUNTEER',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const BeneficiaryStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;
export type BeneficiaryStatus = (typeof BeneficiaryStatus)[keyof typeof BeneficiaryStatus];

export const BeneficiaryCategory = {
  FAMILY: 'FAMILY',
  INDIVIDUAL: 'INDIVIDUAL',
  ELDERLY: 'ELDERLY',
  CHILD: 'CHILD',
  OTHER: 'OTHER',
} as const;
export type BeneficiaryCategory = (typeof BeneficiaryCategory)[keyof typeof BeneficiaryCategory];

export const DonationType = {
  FINANCIAL: 'FINANCIAL',
  MATERIAL: 'MATERIAL',
} as const;
export type DonationType = (typeof DonationType)[keyof typeof DonationType];

export const FinancialMethod = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD',
  PIX: 'PIX',
  OTHER: 'OTHER',
} as const;
export type FinancialMethod = (typeof FinancialMethod)[keyof typeof FinancialMethod];

export const UnitOfMeasure = {
  KG: 'KG',
  LITER: 'LITER',
  UNIT: 'UNIT',
  BOX: 'BOX',
  BAG: 'BAG',
  OTHER: 'OTHER',
} as const;
export type UnitOfMeasure = (typeof UnitOfMeasure)[keyof typeof UnitOfMeasure];

export const HousingStatus = {
  OWNED: 'OWNED',
  RENTED: 'RENTED',
  CEDED: 'CEDED',
  OTHER: 'OTHER',
} as const;
export type HousingStatus = (typeof HousingStatus)[keyof typeof HousingStatus];

export type SafeUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image: string | null;
};

export interface DashboardStats {
  totalBeneficiaries: number;
  activeBeneficiaries: number;
  totalDonationsValue: number;
  lowStockItems: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export type State = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};
