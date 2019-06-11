export class appointmentPayload {
    appointmentNo: number;
    appointmentFromTime: string;
    appointmentToTime: string;
    appointmentDate: string;
    channelId: string;
    scheduleId: string;
    hospitalId: string;
    doctorId: string;
    patientHopeId?: number;
    name?: string;
    birthDate?: string;
    phoneNumber1?: string;
    addressLine1: string;
    note?: string;
    isWaitingList: boolean;
    userId: string;
    source: string;
  }