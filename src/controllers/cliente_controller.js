import Cliente from "../models/cliente.js";

const loginCliente = (req, res) => {
    res.send("Login del cliente: Bienvenido a la plataforma de videojuegos. Por favor, ingrese sus credenciales.");
};

const perfilCliente = async (req, res) => {
    const { id } = req.params; // Suponemos que el cliente proporciona su ID como parámetro

    try {
        // Buscar los datos del cliente en la base de datos por ID
        const cliente = await Cliente.findById(id);

        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado." });
        }

        // Responder con los datos del cliente
        res.status(200).json({
            nombre: cliente.nombre,
            email: cliente.email,
            celular: cliente.celular,
            categoriasFavoritas: cliente.categoriasFavoritas,
            juegosComprados: cliente.juegosComprados,
            estadoCuenta: cliente.estadoCuenta,
        });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el perfil del cliente.", error });
    }
};

const registrarCliente = async (req, res) => {
    const { email } = req.body;

    // Verificar si el email ya está registrado en la base de datos
    const verificarEmailBDD = await Cliente.findOne({ email });

    // Si el email ya está registrado, devolver un error
    if (verificarEmailBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado." });
    }

    // Crear un nuevo cliente y guardarlo en la base de datos
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();

    // Responder con un mensaje de éxito
    res.status(200).json({ msg: "Registro exitoso de cliente. ¡Bienvenido a nuestra tienda de videojuegos!" });
}

const actualizarCliente = (req, res) => {
    res.send("Cliente actualizado: Los datos de su perfil han sido actualizados correctamente.");
}

const eliminarCliente = (req, res) => {
    res.send("Cliente eliminado: Su cuenta ha sido eliminada con éxito. Gracias por usar nuestros servicios.");
}

const compraCliente = async (req, res) => {
    const { id } = req.params; // Suponemos que el cliente proporciona su ID como parámetro

    try {
        // Buscar los datos del cliente en la base de datos por ID
        const cliente = await Cliente.findById(id);

        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado." });
        }

        if (cliente.juegosComprados.length === 0) {
            return res.status(200).json({ msg: "Aún no has realizado ninguna compra." });
        }

        // Responder con la lista de juegos comprados
        res.status(200).json({
            nombre: cliente.nombre,
            juegosComprados: cliente.juegosComprados,
        });
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las compras del cliente.", error });
    }
}

export {
    loginCliente,   
    perfilCliente,
    registrarCliente,
    actualizarCliente,
    eliminarCliente,
    compraCliente
};
