import { useOutletContext } from "react-router-dom";

const Login = () => {

  const {handleLogin, loggedIn} =  useOutletContext();

  function handleLoginSubmit(formData){
    formData.preventDefault();
    handleLogin(formData);
  }

  return (
    <form onSubmit={(formData) => handleLoginSubmit(formData)}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name"></input>
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password"></input>
      <button type="submit">LOG IN</button>
   </form>
  );
};

export default Login;