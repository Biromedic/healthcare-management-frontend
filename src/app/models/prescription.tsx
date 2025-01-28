export type Medicine = {
  medicineId: string;
  medicineName: string;
  quantity: number;
};

export type PrescriptionRequest = {
  patientTC: string;
  medicines: Medicine[];
};

export interface PrescriptionResponse {
  id: number;
  visitId: number;
  doctorUserId: string;
  pharmacyUserId: string | null;
  patientTC: string;
  medicines: {
    medicineId: string;
    medicineName: string;
    quantity: number;
    price: number;
  }[];
  status: string;
}
