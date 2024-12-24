import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const clienteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: true,
        trim: true
    },
    categoriasFavoritas: {
        type: [String], // Ejemplo: ['Aventura', 'Acción', 'RPG']
        required: true,
        default: []
    },
    juegosComprados: {
        type: [String],
        default: []
    },
    estadoCuenta: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Método para cifrar el password del cliente
clienteSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncryp = await bcrypt.hash(password, salt);
    return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
clienteSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

export default model('Cliente', clienteSchema);
