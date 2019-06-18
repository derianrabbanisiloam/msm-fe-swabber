export class editContactPayload {
    contactId: string;
    data: {
      phoneNumber1: string;
      genderId?: string;
    };
    userName?: string;
    userId: string;
    source: string;
  }