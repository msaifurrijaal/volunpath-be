import { Router } from 'express';
import SUPABASE_FOLDERS from '../../constant/SUPABASE_FOLDERS';
import { Error400 } from '../../errors/http.errors';
import { BaseRequest, BaseResponse } from '../../types/common';
import { SupabaseService } from '../../services/supabase.service';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

const validateSupabaseFolder = (folder: string) => {
  const folders: string[] = [];
  for (const key in SUPABASE_FOLDERS) {
    if (Object.prototype.hasOwnProperty.call(SUPABASE_FOLDERS, key)) {
      const element = SUPABASE_FOLDERS[key as keyof object];
      folders.push(element);
      if (element === folder) return;
    }
  }

  throw new Error400({
    message: 'Invalid bucketFolder. Here is the list [' + folders.join(', ') + ']',
  });
};

export const handler = async (
  req: BaseRequest<{ supabaseService: SupabaseService }>,
  res: BaseResponse,
) => {
  try {
    const { id } = req.headers.user as any;
    const { bucketFolder, fileName } = req.query;

    validateSupabaseFolder(bucketFolder);

    const {
      services: { supabaseService },
    } = req.app;
    const result = await supabaseService.getUploadUrl({
      userId: id.toString(),
      bucketFolder,
      fileName,
    });
    res.json({
      message: 'ok',
      data: result,
    });
  } catch (error: any) {
    errorHandler(error, res);
  }
};

/**
 * @swagger
 * /supabase/upload-url:
 *   get:
 *     summary: Get upload url
 *     description: Get upload url
 *     tags:
 *       - Supabase
 *     parameters:
 *       - in: header
 *         name: jwt
 *         description: user login accessToken
 *         type: string
 *         required: true
 *       - in: query
 *         name: fileName
 *         description: example -> image.jpg
 *         type: string
 *         required: true
 *       - in: query
 *         name: bucketFolder
 *         description: here is the list "users" and "events"
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: ok
 *       401:
 *         description: Unauthorized
 */
const getUploadUrlRouter = router.get('/supabase/upload-url', handler as any);

export default getUploadUrlRouter;
