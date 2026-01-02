import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

export default Home;
