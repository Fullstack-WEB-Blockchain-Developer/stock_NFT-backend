import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

export const multerOptions = (pathToFolder: string, sizeLimit: number) => {
  return {
    limits: { fileSize: sizeLimit },
    storage: diskStorage({
      destination: pathToFolder,
      filename: (req, file, cb) => {
        const filename: string = uuidv4();
        const extension: string = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`);
      },
    }),
  };
};
