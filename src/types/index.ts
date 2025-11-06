// export interface Room {
//   id: number;
//   name: string;
//   type: string;
//   price: number;
//   description: string;
//   imageUrl: string;
//   status?: string;
// }

// export interface Service {
//   id: number;
//   name: string;
//   price: number;
// }

// export interface BookingService {
//   id: number;
//   service: Service;
//   quantity: number;
// }

// export interface Booking {
//   id: number;
//   startDate: string;
//   endDate: string;
//   status: string;
//   room?: {
//     id: number;
//     name: string;
//     type: string;
//     price: number;
//     description: string;
//   };
//   roomId: number; // ✅ Add this
//   services: {
//     id: number;
//     quantity: number;
//     service: {
//       id: number;
//       name: string;
//       price: number;
//     };
//   }[];

//   males?: number;
//   females?: number;
//   documentUrl?: string;
// }


// export interface AuthContextType {
//   token: string | null;
//   setToken: (token: string | null) => void;
//   role: "user" | "admin" | null;
//   setRole: (role: "user" | "admin" | null) => void;
//   loading: boolean;
// }



export interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
  status?: string;
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
  bookingNumber: string; // backend-generated
  userId: number;
  roomId: number;
  room?: {
    id: number;
    name: string;
    type: string;
    price: number;
    description: string;
  };
  startDate: string;
  endDate: string;
  status: string;

  // New fields matching backend
  name?: string;
  mobile?: string;
  checkInDate?: string;
  checkInTime?: string;
  checkOutDate?: string;
  checkOutTime?: string;
  customerGstNo?: string;
  roomNo?: string;
  numberOfDates?: number;
  totalNoPeople?: number;
  bookingSource?: string;
  paymentMethod?: string;
  address?: string;
  safe?: boolean;
  documentUrl?: string;

  services?: {
    id: number;
    quantity: number;
    service: {
      id: number;
      name: string;
      price: number;
    };
  }[];
}


export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  role: "user" | "admin" | null;
  setRole: (role: "user" | "admin" | null) => void;
  loading: boolean;
}