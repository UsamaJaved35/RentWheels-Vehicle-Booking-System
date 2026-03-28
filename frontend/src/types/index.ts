export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  dailyRate: number;
  status: "available" | "booked" | "maintenance";
  createdAt: string;
}

export interface Booking {
  _id: string;
  customer: Pick<Customer, "_id" | "name" | "email" | "phone">;
  vehicle: Pick<Vehicle, "_id" | "make" | "model" | "licensePlate" | "dailyRate">;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalCustomers: number;
  totalVehicles: number;
  availableVehicles: number;
  totalRevenue: number;
  recentBookings: Booking[];
}
