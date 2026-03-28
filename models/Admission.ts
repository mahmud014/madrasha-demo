import mongoose, { Schema, model, models } from 'mongoose';

const AdmissionSchema = new Schema({
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  department: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now }
});

const Admission = models.Admission || model('Admission', AdmissionSchema);
export default Admission;