import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

interface IStorageConfig {
   driver: 'disk' | 's3';

   tmpFolder: string;
   uploadsFolder: string;

   multer: {
      storage: StorageEngine;
   };

   config: {
      disk: {};
      aws: {
         bucket: string;
      };
   };
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber-crozatti',
    },
  },
} as IStorageConfig;
