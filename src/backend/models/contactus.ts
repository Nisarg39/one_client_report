import mongoose from "mongoose";

const contactusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'responded'],
    default: 'unread',
  },
  adminNotes: {
    type: String,
  },
},
{ timestamps: true }
);

// Add indexes for performance
contactusSchema.index({ createdAt: -1 }); // Sort by date
contactusSchema.index({ status: 1 }); // Filter by status
contactusSchema.index({ email: 1 }); // Search by email

export default mongoose.models.Contactus || mongoose.model("Contactus", contactusSchema, "contactus" );