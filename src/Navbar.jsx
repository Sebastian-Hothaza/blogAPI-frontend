import { Link } from "react-router-dom";

const Navbar = ({handleLogout, loggedIn}) => {

    return (
      <div className="navBar">
        <h1>Welcome to my Blog!</h1>
        <Link to="/">Home</Link>
        {(loggedIn)? <Link onClick={handleLogout}>Log Out</Link> : <Link to="/login">Log In</Link>}
      </div>
    );
  };
  
  export default Navbar;


