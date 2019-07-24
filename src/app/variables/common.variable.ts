export const SecretKey = 'janganbilangbilang';
export const Jwt = 'rahasia';
export const CHECK_IN = 'APPOINTMENT__CHECK_IN';
export const CREATE_APP = 'APPOINTMENT__CREATE';
export const CANCEL_APP = 'APPOINTMENT__CANCEL';
export const RESCHEDULE_APP = 'APPOINTMENT__RESCHEDULE';
export const QUEUE_NUMBER = 'QUEUE__CREATE_QUEUE';

export const keySocket = {
  APPOINTMENT: '/appointments',
  QUEUE: '/queues'
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
};

export const appointmentStatusId = {
  ACTIVE: '1',
  INACTIVE: '2',
  RESCHEDULED: '3'
};
