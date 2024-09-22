import { OrganizationDetail, User, VolunteerDetail } from '@prisma/client';

export type CreateUserVolunteerReq = Omit<User, 'id' | 'roleId' | 'createdAt' | 'updatedAt'> & {
  volunteerDetail: Omit<VolunteerDetail, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
  skillIds: number[];
};

export type CreateUserOrganizationReq = Omit<User, 'id' | 'roleId' | 'createdAt' | 'updatedAt'> & {
  organizationDetail: Omit<OrganizationDetail, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
};
