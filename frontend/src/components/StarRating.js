import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating, totalReviews, size = 'sm' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Star key={i} className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} style={{clipPath: 'inset(0 50% 0 0)'}} />
      );
    } else {
      stars.push(
        <Star key={i} className={`${sizeClasses[size]} text-gray-300`} />
      );
    }
  }
  
  return (
    <div className="flex items-center gap-2" data-testid="star-rating">
      <div className="flex gap-1">{stars}</div>
      <span className="text-sm font-medium" data-testid="rating-value">{rating.toFixed(1)}</span>
      {totalReviews !== undefined && (
        <span className="text-sm text-muted-foreground" data-testid="total-reviews">({totalReviews})</span>
      )}
    </div>
  );
};

export default StarRating;
