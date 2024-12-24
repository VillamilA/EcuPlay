import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import generarJWT from "../helpers/generarJWT.js";
import Vendedor from "../models/seller.js";

const registerUser = async (req, res) => {
    const {email, password} = req.body

    //validamos los datos
    if(Object.values(req.body).includes('')) {
        return res.status(400).json({msg: 'Ingresa los campos son obligatorios'})
}
const verificarEmail = await Vendedor.findOne({email})
console.log(verificarEmail);
if(verificarEmail){
    return res.status(400).json({msg: 'El correo ya se encuentra registrado'})
}

const nuevoSeller = new Vendedor(req.body)
nuevoSeller.password = await nuevoSeller.encrypPassword(password)

//paso 4 - enviar correo
const token = nuevoSeller.crearToken()

sendMailToUser(email, token)
// guardar nuevoSeller
await nuevoSeller.save()
res.status(200).json({msg:"Revisa tu correo a confirmar tu cuenta"})
}

const confirmEmail = async (req, res) => {
    //paso 1 tomar request
    const {token} = req.params
    //paso 2 validar datos
    if(!(token)) return res.status(400).json({error:"No se pudo confirmar tu cuenta, no hay token"});

    const sellerBDD = await Vendedor.findOne({token})

    if(!sellerBDD.token) return res.status(400).json({error:"La cuenta ya ha sido confirmada"});

    //paso 3 interactuar con la base de datos
    sellerBDD.token = null
    sellerBDD.confirmEmail = true
    await sellerBDD.save()

    res.status(200).json({msg:"Token confirmado"})
}

const login = async (req,res) => { 
    //paso 1 tomar request
    const {email, password} = req.body

    //paso 2 validar datos  
    if(Object.values(req.body).includes("")){
        res.status(400).json({error:"Faltan datos, ingresa todo los campos"})
    }

    //paso 3 interactuar con la base de datos
    //verificar si el mail esta confirmado
    const sellerBDD = await Vendedor.findOne({email})
    if(sellerBDD?.confirmEmail===false)
        return res.status(400).json({error:"La cuenta no ha sido confirmada"})
    
    //verificar si el mail esta registrado
    if(!sellerBDD) return res.status(400).json({error:"El mail no esta registrado"})

    //verificar si el password es correcto
    const validarPassword = await sellerBDD.matchPassword(password)
    if(!validarPassword) return res.status(400).json({error:"El password es incorrecto"})

    //paso 4 interactar con la base de datos
    const tokenJWT = generarJWT(sellerBDD.id,"del usuario")
    res.status(200).json({sellerBDD,tokenJWT})
}

const recuperarPassword = async (req, res) => {
    const {email} = req.body
    //validar datos
        if(Object.values(req.body).includes(""))
            return res.status(400).json({error:"Faltan datos, ingresa todo los campos"})
    // verificar si existe el correo
        const sellerBDD = await Vendedor.findOne({email})
        if(!sellerBDD) return res.status(400).json({error:"El mail no esta registrado"})


    //parte 3 interactuar con la base de datos
    const token = sellerBDD.crearToken()
    sellerBDD.token = token
    await sendMailToRecoveryPassword(email,token)
    await sellerBDD.save()
    res.status(200).json({msg:"Revisa tu correo para reestablecer tu contraseña"})

}

const comprobarToken = async (req,res)=>{
    if(!(req.params.token)) 
        return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    const sellerBDD = await Vendedor.findOne({token:req.params.token})

    if(sellerBDD?.token !== req.params.token) 
        return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    await sellerBDD.save()
  
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

const nuevoPassword = async (req,res)=>{

    const{password,confirmpassword} = req.body

    if (Object.values(req.body).includes("")) 
        return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) 
        return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const sellerBDD = await Vendedor.findOne({token:req.params.token})

    if(sellerBDD?.token !== req.params.token)
        return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    sellerBDD.token = null
    sellerBDD.password = await sellerBDD.encrypPassword(password)

    await sellerBDD.save()
    res.status(200).json({msg:"Tu contraseña ha sido reestablecida, ya puedes iniciar sesión con tu nuevo password"}) 
} 

export{
    registerUser,
    confirmEmail,
    login,
    recuperarPassword,
    comprobarToken,
    nuevoPassword
}