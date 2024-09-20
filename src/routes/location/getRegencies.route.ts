import { Router } from 'express';
import LocationService from '../../services/location.service';
import { BaseRequest, BaseResponse } from '../../types/common';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

export const handler = async (
  req: BaseRequest<{ locationService: LocationService }>,
  res: BaseResponse,
) => {
  try {
    let { provinceId, limit, offset } = req.query;
    const { search } = req.query;

    provinceId = provinceId ? parseInt(provinceId as string) : undefined;
    limit = limit ? parseInt(limit as string) : undefined;
    offset = offset ? parseInt(offset as string) : undefined;

    const {
      services: { locationService },
    } = req.app;

    const result = await locationService.getRegencies({
      provinceId,
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
 * /regencies:
 *  get:
 *    summary: Get regencies
 *    description: Get regencies
 *    tags:
 *      - Addresses
 *    parameters:
 *      - in: query
 *        name: provinceId
 *        schema:
 *          type: number
 *        required: true
 *        description: provinceId
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *        description: limit
 *      - in: query
 *        name: offset
 *        schema:
 *          type: number
 *        description: offset
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *        description: search
 *    responses:
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
 *                     regencies:
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
const getRegenciesRoute = router.get('/regencies', handler as any);

export default getRegenciesRoute;
