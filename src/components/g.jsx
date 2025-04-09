<div>
{roomData.map((room) => (
  <div key={room.id}>
    <div>
      <img 
        src={room.image} 
        alt={room.name}
      />
    </div>
    <div>
      <div>
        <div>
          <h2>{room.name}</h2>
          <div>
            <p>
              {room.amenities.map((amenity, index) => (
                <span key={index}>
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
        
        <div>
          <span>Rooms</span>
        </div>
      </div>
      
      <div>
        <div>
          <p>
            {room.price}
            <span>per night</span>
          </p>
          
          <div>
            <Clock size={16} />
            <p>
              Cancellation Policy: This booking may be cancelled for free before 12:00pm hotel local time on {room.date}
            </p>
          </div>
        </div>
        
        <div>
          <button 
            onClick={() => updateRoomCount(room.id, -1)}
          >
            -
          </button>
          <span>{roomCounts[room.id]}</span>
          <button 
            onClick={() => updateRoomCount(room.id, 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
))}
</div>