import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
   tmpFolder,
   uploadsFolder: path.resolve(tmpFolder, 'uploads'),

   // por enquanto vamos armazenar as imagens no disco.
   storage: multer.diskStorage({
      // __dirname trás o caminho completo até a pasta CONFIG.
      // Depois, perado por vírcula, adicionamos os prócximos caminhos.
      destination: tmpFolder,

      filename(request, file, callback) {
         const fileHash = crypto.randomBytes(10).toString('hex');
         const fileName = `${fileHash}-${file.originalname}`;

         return callback(null, fileName);
      },
   }),
};
