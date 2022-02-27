import { Document, model, Schema } from "mongoose";

const VerificationSchema = new Schema({
  serverId: String,
  question: String,
  answerOne: String,
  answerTwo: String,
  answerThree: String,
  verificationRole: String,
});

export interface Verification extends Document {
  serverId: string;
  question: string;
  answerOne: string;
  answerTwo: string;
  answerThree: string;
  verificationRole: string;
}

export default model<Verification>("Verification", VerificationSchema);
