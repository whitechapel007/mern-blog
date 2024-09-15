import { Link } from "react-router-dom";
import PropTypes from "prop-types";
const PostCard = ({ post: { slug, image, title, category } }) => {
  return (
    <div className="group relative w-full h-[350px] border border-teal-500 transition-all overflow-hidden rounded-lg sm:w-[420px]">
      <Link to={`/post/${slug}`}>
        <img
          src={image}
          alt={slug}
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>

      <div className="p-3 flex-col gap-2">
        <p className="text-lg font-semibold">{title}</p>
        <span className="italic text-sm">{category}</span>
        <Link
          to={`/post/${slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all text-center duration-300 py-2 rounded-md !rounded-tl-none m-2"
        >
          Read article
        </Link>
      </div>
    </div>
  );
};
PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostCard;
