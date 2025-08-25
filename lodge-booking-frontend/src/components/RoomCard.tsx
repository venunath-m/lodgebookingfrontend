"use client";
import type { Room } from "../types";
import "./RoomCard.css"

interface Props {
  room: Room;
  onBook?: (roomId: number) => void;
  onVacant?: (roomId: number) => void;
  className?: string;
  booked?: boolean;
  cancelled?: boolean;
}

const RoomCard = ({ room, onBook, onVacant, className, booked, cancelled }: Props) => {
  const isAvailable = !booked;

  return (
    <div
      className={`room-card ${className || ""} ${
        cancelled ? "cancelled" : booked ? "booked" : "available"
      }`}
    >
      {/* Status badges */}
      <div className={`badge ${isAvailable ? "available" : "occupied"}`}> 
        {isAvailable ? "Available" : "Occupied"}
      </div>

      {booked && <div className="badge booked-right">Booked</div>}
      {cancelled && <div className="badge cancelled-right">Cancelled</div>}

      {/* Room image */}
      <div className="room-image-container">
        {room.imageUrl ? (
          <img
            src={`https://lodgebookingbackend.onrender.com${room.imageUrl}`}
            alt={room.name}
            className="room-image"
          />
        ) : (
          <div className="room-image-placeholder">No Image</div>
        )}
      </div>

      {/* Room details */}
      <h3 className="room-name">{room.name}</h3>
      <p className="room-type">{room.type}</p>
      <p className="room-price">${room.price} / night</p>
      <p className="room-description">{room.description}</p>

      {/* Buttons */}
      <div className="room-buttons">
        {onBook && (
          <button
            className={`room-book-btn ${!isAvailable ? "disabled" : ""}`}
            onClick={() => onBook(room.id)}
            disabled={!isAvailable}
          >
            {booked ? "Booked" : "Book"}
          </button>
        )}

        {(booked || cancelled) && onVacant && (
          <button className="room-vacant-btn" onClick={() => onVacant(room.id)}>
            Set to Vacant
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
