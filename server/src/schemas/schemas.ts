import { z } from 'zod';

// Enums
export const RoleEnum = z.enum(['COLLEGE', 'CONTRACTOR', 'CORPORATE', 'ADMIN', 'OTHER']);

export const SecurityQuestionEnum = z.enum([
  'MOTHERS_MAIDEN_NAME', 
  'FIRST_PET_NAME', 
  'FAVORITE_CHILDHOOD_MEMORY', 
  'FAVORITE_TEACHER_NAME', 
  'BIRTH_TOWN_NAME'
]);

export const ServiceTypeEnum = z.enum([
  'HOSTELS', 
  'CORPORATE_EVENTS', 
  'CORPORATE_OFFICES', 
  'WEDDINGS', 
  'PARTIES', 
  'OTHER'
]);

export const MenuTypeEnum = z.enum(['VEG', 'NON_VEG', 'BOTH']);

// Base Schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  address: z.string(),
  contactNumber: z.string(),
  role: RoleEnum,
  securityQuestion: SecurityQuestionEnum,
  securityAnswer: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const MenuSchema = z.object({
  id: z.string().uuid(),
  contractorId: z.string().uuid(),
  name: z.string(),
  items: z.array(z.string()),
  pricePerHead: z.number().positive(),
  type: MenuTypeEnum,
});

export const MessContractorSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  numberOfPeople: z.number().int().positive().optional(),
  services: z.array(ServiceTypeEnum),
  ratings: z.number().min(0).max(5).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Relations
  user: UserSchema,
  menus: z.array(MenuSchema),
});

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  contractorId: z.string().uuid(),
  reviewerId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date(),
  
  // Relations
  reviewer: UserSchema,
  contractor: MessContractorSchema,
});

export const AuctionSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Relations
  creator: UserSchema,
});

export const BidSchema = z.object({
  id: z.string().uuid(),
  auctionId: z.string().uuid(),
  bidderId: z.string().uuid(),
  amount: z.number().positive(),
  createdAt: z.date(),
  
  // Relations
  auction: AuctionSchema,
  bidder: UserSchema,
});

export const ChatSchema = z.object({
  id: z.string().uuid(),
  user1Id: z.string().uuid(),
  user2Id: z.string().uuid(),
  createdAt: z.date(),
  
  // Relations
  user1: UserSchema,
  user2: UserSchema,
});

export const MessageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string(),
  createdAt: z.date(),
  
  // Relations
  chat: ChatSchema,
  sender: UserSchema,
});

export const VideoConferenceSchema = z.object({
  id: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Relations
  participants: z.array(UserSchema),
});

// Input Schemas (for creation)
export const CreateUserSchema = UserSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
// For Login Schema
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateMenuSchema = MenuSchema.omit({ 
  id: true 
});

export const CreateMessContractorSchema = MessContractorSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const CreateReviewSchema = ReviewSchema.omit({ 
  id: true, 
  createdAt: true 
});

export const CreateAuctionSchema = AuctionSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const CreateBidSchema = BidSchema.omit({ 
  id: true, 
  createdAt: true 
});

export const CreateChatSchema = ChatSchema.omit({ 
  id: true, 
  createdAt: true 
});

export const CreateMessageSchema = MessageSchema.omit({ 
  id: true, 
  createdAt: true 
});

export const CreateVideoConferenceSchema = VideoConferenceSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Inference Types
export type User = z.infer<typeof UserSchema>;
export type Menu = z.infer<typeof MenuSchema>;
export type MessContractor = z.infer<typeof MessContractorSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Auction = z.infer<typeof AuctionSchema>;
export type Bid = z.infer<typeof BidSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type VideoConference = z.infer<typeof VideoConferenceSchema>;