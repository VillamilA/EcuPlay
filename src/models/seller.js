import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'

const sellerSchema = new Schema({
    nombre: {
        type: String, 
        required: true,
        trim:true
    },
    email: {
        type: String, 
        required: true,
        trim:true,
        unique: true
    },
    phone: {
        type: String, 
        required: true,
        trim:true
    },
    password: {
        type: String, 
        required: true,
        trim:true
    },
    token: {
        type: String,
        trim:true
    },
    status: {
        type: String, 
        trim:true
    },
    confirmEmail:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
})

sellerSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
sellerSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

// Método para crear un token 
sellerSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

export default model('Vendedor',sellerSchema)