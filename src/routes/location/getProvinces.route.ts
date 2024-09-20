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
    let { limit, offset, search } = req.query;
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

const getProvincesRouter = router.get('/provinces', handler as any);

export default getProvincesRouter;
