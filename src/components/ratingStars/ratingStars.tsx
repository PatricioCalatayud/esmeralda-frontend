
"use client"
import React, { useState } from "react";

interface RatingStarsProps {
  onChange: (rating: number, id?: string) => void;
  id?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ onChange, id }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={`text-3xl ${index <= (hover || rating) ? "text-yellow-500" : "text-gray-400"}`}
            onClick={() => { setRating(index); onChange(index, id); }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            style={{ cursor: "pointer", transition: "color 200ms" }}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;