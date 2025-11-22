export interface ApiResponse {
  success: boolean; //true
  statusCode: number; //200
  message: string; // "Create successful"
  error?: string;
  timestamp: string;
}
