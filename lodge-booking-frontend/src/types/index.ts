export interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
}

export interface BookingService {
  id: number;
  service: Service;
  quantity: number;
}

export interface Booking {
  id: number;
  room: Room;
  startDate: string;
  endDate: string;
  status: string;
  services: BookingService[]; 
}
export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}
