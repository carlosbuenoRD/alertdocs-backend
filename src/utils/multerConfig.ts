import { diskStorage } from 'multer';
import path from 'path';

export const saveFileStorage = {
  storage: diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const fileExtension: string = file.originalname.split('.')[1];
      const filename: string = Date.now() + '.' + fileExtension;
      cb(null, filename);
    },
  }),
};
