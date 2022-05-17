import jwt from "jsonwebtoken";
import dotnev from "dotenv";

dotnev.config();

const {JWT_SECRET} = process.env;

const jwtAuthentication = (req, res, next) => {
  //getting token from req header sent from client
  const token = req.header("oswc-auth-token");

  if (!token)
    return res.status(401).json({message: "Unauthorized, Please Log In"});

  try {
    //get id and time from token sent from back end
    //remember token was decoded using the user id and createdAt time
    //decoded would equals = { id : user_id, createdAt : time_created}

    const decoded = jwt.verify(token, JWT_SECRET);

    //storing the decoded data into a variable user in the request body
    req.user = decoded;

    next();
  } catch (error) {
    res.status(409).json({message: "Token is not valid", error});
  }
};

export default jwtAuthentication;
