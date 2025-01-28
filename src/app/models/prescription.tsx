export type Medicine = {
  medicineId: string;
  medicineName: string;
  quantity: number;
};

export type PrescriptionRequest = {
  patientTC: string;
  medicines: Medicine[];
};

export type PrescriptionResponse = {
  id: number;
  doctorId: string;
  patientTC: string;
  medicines: Medicine[];
  status: 'INCOMPLETE' | 'PENDING' | 'COMPLETED';
  createdAt: string;
};