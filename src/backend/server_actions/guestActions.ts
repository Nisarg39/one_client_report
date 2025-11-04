'use server';

import connectDB from "../config/database";
import Contactus from "../models/contactus";
import { ServerActionResponse } from "../types";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(formData: FormData): Promise<ServerActionResponse> {
  try {
    // Extract form data
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!message || message.length < 10) {
      errors.message = "Message must be at least 10 characters long";
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors,
      };
    }

    // Connect to database
    await connectDB();

    // Create contact submission
    const contactSubmission = await Contactus.create({
      name,
      email,
      message,
    });

    console.log("Contact form submitted successfully:", contactSubmission._id);

    return {
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error submitting contact form:", error);

    // Return user-friendly error message
    return {
      success: false,
      message: "An error occurred while submitting your message. Please try again later.",
    };
  }
}