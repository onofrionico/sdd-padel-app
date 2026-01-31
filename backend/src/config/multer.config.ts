import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/profile-pictures',
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `profile-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return callback(
        new BadRequestException('Only image files (JPG, JPEG, PNG, WEBP) are allowed'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
