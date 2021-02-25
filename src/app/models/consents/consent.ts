import { ConsentDetail } from './consentDetail'
export class Consent {
  consent_id: number;
  is_new_patient: boolean;
  registration_form_id: string;
  unique_code: string;
  checkin_date: string;
  patient_name: string;
  date_of_birth: string;
  mobile_no: string;
  email_address: string;
  created_date: string;
  created_by: string;
  modified_date: string;
  modified_by: string;
  detail: ConsentDetail[];
  vaccine_no: number;
}
