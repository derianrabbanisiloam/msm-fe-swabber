export class rescheduleAppointmentPayload {
  appointmentId: string;
  appointmentNo: number;
  appointmentDate: string;
  appointmentFromTime: string;
  scheduleId: string;
  hospitalId: string;
  isWaitingList: boolean;
  note?: string;
  userId: string;
  source: string;
}