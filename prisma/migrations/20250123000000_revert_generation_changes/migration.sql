-- Add back the original columns if they don't exist
ALTER TABLE "Generation" ADD COLUMN IF NOT EXISTS "currentStep" TEXT;
ALTER TABLE "Generation" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'in_progress';

-- Set default value for currentStep if it's null
UPDATE "Generation" SET "currentStep" = 'settings' WHERE "currentStep" IS NULL;

-- Make currentStep NOT NULL
ALTER TABLE "Generation" ALTER COLUMN "currentStep" SET NOT NULL;

-- Revert content column type back to JSON
ALTER TABLE "Generation" ALTER COLUMN "content" TYPE JSONB USING 
  CASE 
    WHEN content IS NULL THEN NULL::jsonb
    WHEN content IS NOT NULL THEN content::jsonb
  END;

-- Re-add foreign key and index if they're missing
ALTER TABLE "Generation" DROP CONSTRAINT IF EXISTS "Generation_userId_fkey";
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP INDEX IF EXISTS "Generation_userId_idx";
CREATE INDEX "Generation_userId_idx" ON "Generation"("userId");

-- Drop the new columns (if they exist)
ALTER TABLE "Generation" DROP COLUMN IF EXISTS "step";
ALTER TABLE "Generation" DROP COLUMN IF EXISTS "title";