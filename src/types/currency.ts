export interface Currency {
    name: string;
    symbol?: string;
    // iso_code: string; // Uncomment if `iso_code` is required
    // exchange_rate?: string; // Uncomment if `exchange_rate` is required
    status?: "show" | "hide"; // Enum values for `status`
    live_exchange_rates?: "show" | "hide"; // Enum values for `live_exchange_rates`
    createdAt?: Date; // Added for `timestamps: true`
    updatedAt?: Date; // Added for `timestamps: true`
  }