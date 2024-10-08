import { Router } from 'express';
import errorHandler from '../../helpers/errorHandler';
import LocationService from '../../services/location.service';
import { BaseRequest, BaseResponse } from '../../types/common';

const router = Router();

export const handler = async (
  req: BaseRequest<{ locationService: LocationService }>,
  res: BaseResponse,
) => {
  try {
    let { limit, offset } = req.query;
    const { search } = req.query;
    limit = limit ? parseInt(limit as string) : undefined;
    offset = offset ? parseInt(offset as string) : undefined;

    const {
      services: { locationService },
    } = req.app;

    const result = await locationService.getProvinces({
      limit,
      offset,
      search,
    });

    res.json({
      message: 'ok',
      data: result,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Get provinces
 *     description: Get provinces
 *     tags:
 *       - Addresses
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: limit
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         description: offset
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: search
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: object
 *                   properties:
 *                     provinces:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const getProvincesRouter = router.get('/provinces', handler as any);

export default getProvincesRouter;
