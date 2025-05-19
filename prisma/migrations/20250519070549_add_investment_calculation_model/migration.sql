-- CreateTable
CREATE TABLE "InvestmentCalculation" (
    "id" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "marketArea" TEXT NOT NULL,
    "investmentAmount" DOUBLE PRECISION NOT NULL,
    "holdPeriod" INTEGER NOT NULL,
    "annualReturnRate" DOUBLE PRECISION NOT NULL,
    "propertyManagementFee" DOUBLE PRECISION NOT NULL,
    "vacancyRate" DOUBLE PRECISION NOT NULL,
    "monthlyCashFlow" DOUBLE PRECISION NOT NULL,
    "annualCashFlow" DOUBLE PRECISION NOT NULL,
    "totalReturn" DOUBLE PRECISION NOT NULL,
    "roi" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "contactId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentCalculation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvestmentCalculation" ADD CONSTRAINT "InvestmentCalculation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentCalculation" ADD CONSTRAINT "InvestmentCalculation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
