export class editContactPayload {
    contactId: string;
    data: {
      phoneNumber1: string;
      genderId?: string;
    };
    userId: string;
    source: string;
  }