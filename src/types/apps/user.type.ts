import { User, VolunteerDetail } from '@prisma/client';

export type CreateUserVolunteerReq = Omit<User, 'id'> & {
  volunteerDetail: Omit<VolunteerDetail, 'id' | 'userId'>;
};
