import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import errorHandler from '../../helpers/errorHandler';
import config from '../../config';
import transporter from '../../config/mailer';

const router = Router();

export const handler = async (req: BaseRequest, res: BaseResponse) => {
  try {
    const mailOptions = {
      from: config.smtpEmail,
      to: 'scmmsrijaal@gmail.com',
      subject: 'Test Notification',
      text: `Hallo scmmsrijaal,\n\nThis is a test notification.\n\nThank you for using our platform.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      message: 'ok',
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * @swagger
 * /dummy-notification:
 *   get:
 *     summary: Get dummy notification
 *     description: Get dummy notification
 *     tags:
 *       - Dummy
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
const dummyRoute = router.get('/dummy-notification', handler as any);

export default dummyRoute;
