export const SecretKey = 'janganbilangbilang';
export const Jwt = 'rahasia';
export const CHECK_IN = 'APPOINTMENT__CHECK_IN';
export const CREATE_APP = 'APPOINTMENT__CREATE';
export const CANCEL_APP = 'APPOINTMENT__CANCEL';
export const RESCHEDULE_APP = 'APPOINTMENT__RESCHEDULE';
export const QUEUE_NUMBER = 'QUEUE__CREATE_QUEUE';
export const APP_TEMP = 'APPOINTMENT_TEMPORARY__COUNT';
export const APP_TELE_AIDO = 'APPOINTMENT_AIDO__COUNT';
export const APP_RESCHEDULE = 'APPOINTMENT_RESCHEDULE__COUNT';
export const REQUEST_LIST = 'BPJS__APPOINTMENT_COUNT';
export const SCHEDULE_BLOCK = 'SCHEDULE__BLOCK';
export const USER_LOGIN__FRONT_OFFICE = 'USER_LOGIN__FRONT_OFFICE';
export const RESERVE_SLOT = 'QUEUE__RESERVED_TIME_SLOT';
export const RELEASE_SLOT = 'QUEUE__RELEASE_TIME_SLOT';

export const reqBpjs = {
  REQLIST: true,
  REQCOMPLETED: false
}

export const eligibleStatus = {
  ELIGIBLE: '1',
  NOT_ELIGIBLE: '2',
  NOT_YET_ELIGIBLE: '3'
}

export const keySocket = {
  APPOINTMENT: '/appointments',
  QUEUE: '/queues',
  SCHEDULE: '/schedules',
  USERS: '/users',
  BPJS: '/bpjs'
}

export const appInfo = {
    APPLICATION_ID: '6728f580-d2d4-4e57-ad87-17ee13389971',
    ROLE_ID: '263ebf52-9ea9-4e92-a4e9-f4a0a3366de8',
};

export const sourceApps = 'FrontOffice';

export const leaveType = [
    {
      leave_type: 'Sick Leave',
      schedule_type_id: '5'
    },
    {
      leave_type: 'Maternity',
      schedule_type_id: '4'
    },
    {
      leave_type: 'Personal Matters',
      schedule_type_id: '3'
    },
    {
      leave_type: 'Annual Leave',
      schedule_type_id: '2'
    }
];

export const queueType = {
  VIP: '1',
  REG: '2',
};

export const doctorType = {
  FCFS: 'First Come First Serve',
  HOURLY_APPOINTMENT: 'Hourly Appointment',
  FIX_APPOINTMENT: 'Fixed Appointment'
};

export const channelId = {
  CALL_CENTER: '1',
  FRONT_OFFICE: '2',
  AIDO: '18',
  BPJS: '15',
  MOBILE: '5',
  MOBILE_OTHER: '9'
};

export const appointmentStatusId = {
  ACTIVE: '1',
  INACTIVE: '2',
  RESCHEDULED: '3'
};

export const mobileStatus = {
  ACTIVE: 'ACTIVE',
  ACCESSED: 'MR-ACCESSED',
  VALIDATED: 'VALIDATED'
};

export const contactStatus = {
  MOBILE_ACTIVE: '3',
  VERIFIED: '4'
}

export const hospitalId = {
  yogyakarta: '8c09908a-2eb3-4e5e-a7d3-ab2400df0b82'
}

export const typeFile = {
  image: 'image/jpeg',
  pdf: 'application/pdf'
}

export const formatFile = {
  image: 'jpg',
  pdf: 'pdf'
}

export const consultationType = {
  REGULAR: '1',
  BPJS: '2',
  EXECUTIVE: '3',
  TELECONSULTATION: '4',
  BPJS_REGULER: '5',
  NON_BPJS_TELE: '6'
}

export const activityType = {
  LINKED_TO_MR: '1',
  OPEN_ACCESS_MR: '2',
};

export const paymentStatus = {
  PAID: '1',
  NOTPAID: '2',
  PAYMENTEXPIRED: '3',
  PAYLATER: '4'
};

export const pathImage = {
  DISCLAIMER: '/disclaimer_1/',
  BPJS_CARD: '/bpjs_identity_card'
}

export const patientStatus = {
  NOT_REGISTERED: '1',
  REGISTERED: '2',
  SCREENED: '3',
  EVALUATED: '4',
  VACCINATED: '5',
  CANCELLED_VACCINATION: '6'
};

export const vaccineType = [
  {
    form_type_name: 'Appointment Vaksin Lansia',
    form_type_id: '748234e7-c142-4786-9e64-e0f3cefc1b4d'
  },
  {
    form_type_name: 'Appointment Vaksin Gotong Royong',
    form_type_id: 'a5f94f58-6734-40b5-a98a-d6263d86defb'
  },
  {
    form_type_name: 'Appointment Vaksin Tenaga Publik',
    form_type_id: '4081e078-dfb7-4d67-8256-7fea3785d766'
  },
  {
    form_type_name: 'Appointment Vaksin',
    form_type_id: 'dc1071a7-0a9a-4dd3-a8fa-62cc7299211f'
  },
]

export const consentTypeKey = {
  DEFAULT: '',
  ELDERLY: 'Lansia',
  CORPORATE: 'Gotong Royong',
}

export const consentTypeValue = {
  DEFAULT: '1',
  ELDERLY: '2',
  CORPORATE: '3',  
}

export const checkupTypeId = {
  COV_CHECKUP: '1',
  COV_VACCINE: '2',
};