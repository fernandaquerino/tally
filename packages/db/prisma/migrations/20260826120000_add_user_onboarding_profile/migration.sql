ALTER TABLE "users"
ADD COLUMN "occupation" TEXT,
ADD COLUMN "monthly_revenue_cents" BIGINT,
ADD COLUMN "cnpj" TEXT,
ADD COLUMN "tax_regime" TEXT,
ADD COLUMN "tax_percentage" INTEGER,
ADD COLUMN "reserve_percentage" INTEGER,
ADD COLUMN "initial_account_type" TEXT,
ADD COLUMN "onboarding_completed_at" TIMESTAMPTZ(3);
