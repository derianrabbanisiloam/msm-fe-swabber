export class addScheduleBlockPayload {
    fromDate: string;
      toDate: string;
      fromTime: string;
      toTime: string;
      reason: string;
      isIncludeWaitingList: boolean;
      userId: string;
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
      source: string;
  }
  
  export class deleteScheduleBlockPayload {
      userId: string;
      source: string;
  }