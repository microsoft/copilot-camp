// Base interfaces for claims operations - simplified structures
// DamageType is now simplified to string array
// PolicyHolder is now simplified to name and email strings
// Property is now simplified to address string
// ClaimStatus is now simplified to single string

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Property interface removed - now using simple string for address

export interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  policyHolderName: string;
  policyHolderEmail: string;
  property: string;
  dateOfLoss: string;
  dateReported: string;
  status: string;
  damageTypes: string[];
  description: string;
  estimatedLoss: number;
  adjusterAssigned?: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateClaimRequest {
  status?: string;
  description?: string;
  estimatedLoss?: number;
  adjusterAssigned?: string;
  notes?: string[];
  damageTypes?: string[];
}

export interface CreateClaimRequest {
  claimNumber: string;
  policyNumber: string;
  policyHolderName: string;
  policyHolderEmail: string;
  property: string;
  dateOfLoss: string;
  dateReported: string;
  status: string;
  damageTypes: string[];
  description: string;
  estimatedLoss: number;
  adjusterAssigned?: string;
  notes?: string[];
}

// Inspection-related interfaces - simplified photos are now just URL strings

export interface Inspector {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specializations: string[];
}

export interface InspectionTask {
  id: string;
  claimId: string;
  claimNumber: string;
  taskType: 'initial' | 'reinspection' | 'final' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate?: string;
  completedDate?: string;
  inspectorId?: string;
  property: string;
  instructions: string;
  photos: string[];
  findings: string;
  recommendedActions: string[];
  flaggedIssues: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInspectionTaskRequest {
  claimId: string;
  taskType: InspectionTask['taskType'];
  priority: InspectionTask['priority'];
  scheduledDate?: string;
  inspectorId?: string;
  instructions: string;
}

export interface UpdateInspectionTaskRequest {
  taskType?: InspectionTask['taskType'];
  priority?: InspectionTask['priority'];
  status?: InspectionTask['status'];
  scheduledDate?: string;
  completedDate?: string;
  inspectorId?: string;
  instructions?: string;
  findings?: string;
  recommendedActions?: string[];
  flaggedIssues?: string[];
  photos?: string[];
}

// Contractor and PO interfaces
export interface Contractor {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: Address;
  licenseNumber: string;
  insuranceCertificate: string;
  specialties: string[];
  rating: number;
  isPreferred: boolean;
  isActive: boolean;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: 'materials' | 'labor' | 'equipment' | 'permits';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  claimId: string;
  claimNumber: string;
  contractorId: string;
  workDescription: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  createdDate: string;
  approvedDate?: string;
  completedDate?: string;
  approvedBy?: string;
  notes: string[];
}

export interface CreatePurchaseOrderRequest {
  claimId: string;
  contractorId: string;
  workDescription: string;
  lineItems: Omit<LineItem, 'id' | 'totalPrice'>[];
  notes?: string[];
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// AI Analysis interfaces for future integration
export interface PhotoAnalysisRequest {
  claimNumber: string;
  photoIds: string[];
  analysisType: 'damage-detection' | 'summary' | 'roofing-assessment';
}

export interface PhotoAnalysisResult {
  claimNumber: string;
  summary: string;
  detectedDamage: {
    type: string;
    severity: 'minor' | 'moderate' | 'major' | 'total';
    confidence: number;
    location: string;
    description: string;
  }[];
  flags: {
    type: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  recommendations: string[];
  estimatedRepairCost?: number;
}