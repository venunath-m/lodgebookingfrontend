import type { Room } from "../types";

interface Props {
  room: Room;
  onBook?: (roomId: number) => void;
}

const RoomCard = ({ room, onBook }: Props) => (
  <div style={{ border: "1px solid #ccc", padding: 16, margin: 8 }}>
    <h3>{room.name}</h3>
    <p>{room.type}</p>
    <p>${room.price} / night</p>
    <p>{room.description}</p>
    {onBook && <button onClick={() => onBook(room.id)}>Book</button>}
  </div>
);

export default RoomCard;
