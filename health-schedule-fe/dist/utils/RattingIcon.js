"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const RatingIcon = ({ rating }) => {
    // Input validation and normalization
    const parsedRating = parseFloat(rating);
    const safeRating = isNaN(parsedRating) ? 0 : Math.min(Math.max(parsedRating, 0), 5);
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (<span className="rating-icons">
            {[...Array(fullStars)].map((_, i) => (<react_fontawesome_1.FontAwesomeIcon icon={free_solid_svg_icons_1.faStar} key={`full-${i}`} color="gold"/>))}
            {hasHalfStar && (<react_fontawesome_1.FontAwesomeIcon icon={free_solid_svg_icons_1.faStarHalfAlt} key="half" color="gold"/>)}
            {[...Array(emptyStars)].map((_, i) => (<react_fontawesome_1.FontAwesomeIcon icon={free_solid_svg_icons_1.faStar} key={`empty-${i}`} color="#cccccc"/>))}
        </span>);
};
exports.default = RatingIcon;
