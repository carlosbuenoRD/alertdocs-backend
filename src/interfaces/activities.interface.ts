export interface IActivities {
  areaId: string;
  description: string;
  hours: number;
  step: number;
  usersId: [string];
}

export interface IActivitiesDocument extends IActivities {
  startedAt: Date;
  endedAt: Date;
  documentId: string;
  state: string;
}
