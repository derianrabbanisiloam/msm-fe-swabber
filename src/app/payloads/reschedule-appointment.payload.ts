export class rescheduleAppointmentPayload {
  appointmentId?: string;
  appointmentTemporaryId?:string;
  appointmentNo: number;
  appointmentDate: string;
  appointmentFromTime: string;
  appointmentToTime: string;
  scheduleId: string;
  hospitalId: string;
  isWaitingList: boolean;
  note?: string;
  channelId?: string;
  userId: string;
  userName?: string;
  source: string;
}