-- AlterTable
ALTER TABLE "WebhookLog" ADD COLUMN     "processingTimeMs" INTEGER,
ADD COLUMN     "requestBody" TEXT,
ADD COLUMN     "requestHeaders" TEXT,
ADD COLUMN     "responseBody" TEXT,
ADD COLUMN     "responseStatus" INTEGER;

-- CreateIndex
CREATE INDEX "WebhookLog_responseStatus_idx" ON "WebhookLog"("responseStatus");
