// secure/privateRoute.js
import Cookies from "js-cookie";

import { Navigate } from "react-router-dom";
import conf from '../config/conf.js'

const anoid = conf.anoId;

const PrivateRoute = ({ children }) => {
  const userId = Cookies.get("userId");
  const anoId = Cookies.get("anoId");

  if (!userId && anoId !== anoid) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
