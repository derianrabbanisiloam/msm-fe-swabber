export class rescheduleAppointmentPayload {
  appointmentId: string;
  appointmentNo: number;
  appointmentDate: string;
  appointmentFromTime: string;
  scheduleId: string;
  hospitalId: string;
  isWaitingList: boolean;
  note?: string;
  channelId?: string;
  userId: string;
  userName?: string;
  source: string;
}