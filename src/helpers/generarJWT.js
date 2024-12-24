import jwt from "jsonwebtoken";

const generarJWT = (id,rol)=>{
    return jwt.sign({id,rol},process.env.JWT_SECRET_KEY,{expiresIn:'24h'})
}

export default generarJWT