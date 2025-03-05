-- CreateTable
CREATE TABLE "AiAnalysisLog" (
    "id" SERIAL NOT NULL,
    "imagePath" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "message" TEXT,
    "class" INTEGER,
    "confidence" DOUBLE PRECISION,
    "requestTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysisLog_pkey" PRIMARY KEY ("id")
);
