import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt ,faStar as faRegStar } from "@fortawesome/free-solid-svg-icons";


const RatingIcon = ({ rating }) => {
    // Input validation and normalization
    const parsedRating = parseFloat(rating);
    const safeRating = isNaN(parsedRating) ? 0 : Math.min(Math.max(parsedRating, 0), 5);

    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <span className="rating-icons">
            {[...Array(fullStars)].map((_, i) => (
                <FontAwesomeIcon icon={faStar} key={`full-${i}`} color="gold" />
            ))}
            {hasHalfStar && (
                <FontAwesomeIcon icon={faStarHalfAlt} key="half" color="gold" />
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <FontAwesomeIcon icon={faRegStar} key={`empty-${i}`} color="#cccccc" />
            ))}
        </span>
    );
};

export default RatingIcon;