export class addScheduleBlockPayload {
    fromDate: string;
      toDate: string;
      fromTime: string;
      toTime: string;
      reason: string;
      isIncludeWaitingList: boolean;
      isRescheduleTeleconsultation: boolean;
      userId: string;
      userName: string;
      source: string;
  }
  
  export class updateScheduleBlockPayload {
    scheduleId?: string;
    fromDate: string;
    toDate: string;
    fromTime: string;
    toTime: string;
    reason: string;
    isIncludeWaitingList: boolean;
    isRescheduleTeleconsultation: boolean;
    userId: string;
    userName: string;
    source: string;
  }
  
  export class deleteScheduleBlockPayload {
      userId: string;
      userName: string;
      source: string;
  }