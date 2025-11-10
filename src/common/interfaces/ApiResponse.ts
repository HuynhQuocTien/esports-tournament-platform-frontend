export interface ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    error?: string;
    timestamp: string;
}