import * as z from 'zod';
// Define the schema for the request body
export const bettingSchema = z.object({
  creatorId : z.string().min(1, "Creator ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  resolverId: z.string().min(1, "Resolver is required"),
  endTime: z.number().min(1, "End time is required"),
  amount: z.number().min(1, "Betting amount must be greater than 0"),
});