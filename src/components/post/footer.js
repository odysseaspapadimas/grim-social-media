import { Link } from "react-router-dom";

const Footer = ({ caption, username }) => {
  return (
    <div className="p-4 pt-2 pb-0">
      <Link to={`/p/${username}`}>
        <span className="mr-1 font-semibold">{username}</span>
      </Link>
      <span>{caption}</span>
    </div>
  );
};

export default Footer;
