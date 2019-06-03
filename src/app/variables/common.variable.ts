export const appInfo = {
    //APPLICATION_ID: '6728f580-d2d4-4e57-ad87-17ee13389971',
    APPLICATION_ID: '4981bc49-24b4-4a31-bd44-02f675502ecc',
    ROLE_ID: '4a868d3d-63a2-408e-8fdc-6e8bcf7a2f45',
};

export const sourceApps = '::ffff:10.83.146.145';

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
  CALL_CENTER: '1'
};

export const appointmentStatusId = {
  ACTIVE: '1',
  INACTIVE: '2',
  RESCHEDULED: '3'
};
