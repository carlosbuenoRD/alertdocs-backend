import { User } from './../api/users/entities/user.entity';
export interface IActivities {
  areaId: string;
  description: string;
  hours: number;
  step: number;
  usersId: User[];
}

export interface IActivitiesDocument extends IActivities {
  startedAt: Date;
  endedAt: Date;
  documentId: string;
  state: string;
}
