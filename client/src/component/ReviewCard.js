import { TOUR_IMAGE_URL } from "../customValue"
import { Link } from "react-router-dom";

export default function ReviewCard ({review}) {
  console.log(review);

  const stars = ratingStar => {
    const arr = []
    const remainStar = 5 - ratingStar

    for (let i = 0; i < ratingStar; i++) {
        arr.push((
          <span className="material-symbols-outlined fill text-warning">star</span>
        ))
    }
    for (let i = 0; i < remainStar; i++) {
        arr.push((
          <span className="material-symbols-outlined text-warning">star</span>
        ))
    }
    return arr
  }

  return (
    <div className="pb-4 d-flex justify-content-between review-card">
      <div className="d-flex">
        <div className="tour-image--sm">
          <img 
            src={TOUR_IMAGE_URL + review.tour.imageCover}
            className="w-100 h-100 rounded"
          />
        </div>
        <div className="ps-3">
          {/* <Link to={'/tour/' + review.tour.slug}> */}
            <p className="pb-2 fw-bold text-info">{review.tour.name}</p>
          {/* </Link> */}
          <p className="pb-1 text-secondary">
            {new Date(review.createAt).toLocaleString('en-US', {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: "h24"
            })}
          </p>
          <div className="d-flex pb-1">
            {stars(review.rating)}
          </div>
          <p className="review-card--body">{review.review}</p>
        </div>
      </div>
    </div>
  )
}