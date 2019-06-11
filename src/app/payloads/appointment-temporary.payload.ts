export class appointmentTemporaryPayload {
    appointmentTemporaryId: number;
    appointmentNo: number;
    appointmentFromTime: string;
    appointmentToTime: string;
    appointmentDate: string;
    channelId: string;
    scheduleId: string;
    hospitalId: string;
    doctorId: string;
    patientHopeId?: number;
    contactId?: number;
    name?: string;
    birthDate?: string;
    phoneNumber1?: string;
    addressLine1: string;
    note?: string;
    isWaitingList: boolean;
    userId: string;
    userName: string;
    source: string;
  }