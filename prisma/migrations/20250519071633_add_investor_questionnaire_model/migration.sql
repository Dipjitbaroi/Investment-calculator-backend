-- CreateTable
CREATE TABLE "InvestorQuestionnaire" (
    "id" TEXT NOT NULL,
    "isAccreditedInvestor" BOOLEAN NOT NULL,
    "hasInvestedBefore" BOOLEAN NOT NULL,
    "lookingTimeframe" TEXT NOT NULL,
    "primaryInvestmentGoal" TEXT NOT NULL,
    "investmentTimeline" TEXT NOT NULL,
    "capitalToInvest" TEXT NOT NULL,
    "useFinancing" TEXT NOT NULL,
    "marketsInterested" TEXT[],
    "propertyTypesInterested" TEXT[],
    "investmentTimeframe" TEXT NOT NULL,
    "notes" TEXT,
    "contactId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestorQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvestorQuestionnaire" ADD CONSTRAINT "InvestorQuestionnaire_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorQuestionnaire" ADD CONSTRAINT "InvestorQuestionnaire_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
