export class addScheduleBlockPayload {
    fromDate: string;
      toDate: string;
      fromTime: string;
      toTime: string;
      reason: string;
      isIncludeWaitingList: boolean;
      userId: string;
      userName: string;
      source: string;
  }
  
  export class updateScheduleBlockPayload {
    fromDate: string;
      toDate: string;
      fromTime: string;
      toTime: string;
      reason: string;
      isIncludeWaitingList: boolean;
      userId: string;
      userName: string;
      source: string;
  }
  
  export class deleteScheduleBlockPayload {
      userId: string;
      userName: string;
      source: string;
  }