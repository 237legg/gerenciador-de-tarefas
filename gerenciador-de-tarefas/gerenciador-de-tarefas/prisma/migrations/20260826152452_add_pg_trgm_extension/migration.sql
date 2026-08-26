-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project" USING GIN ("name" gin_trgm_ops);
