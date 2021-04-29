export interface TeleRescheduleRequest {
  readonly channelId: string;
  readonly appointmentDate: string;
  readonly appointmentFromTime: string;
  readonly appointmentToTime: string;
  readonly userId: string;
  readonly userName: string;
  readonly source: string;
  readonly scheduleId: string;
  readonly appointmentId: string;
}
