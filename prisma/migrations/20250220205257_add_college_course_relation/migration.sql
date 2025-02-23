-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_institute_code_fkey" FOREIGN KEY ("institute_code") REFERENCES "college"("institute_code") ON DELETE RESTRICT ON UPDATE CASCADE;
