
const { db } = require('../config/firebase')

const obtenerProductos = async (req,res)=>{
    try{
        const productosSnapshot = await db.collection('productos').get()
        console.log(productosSnapshot)
        const productos = []
        
        productosSnapshot.forEach(doc => {
            productos.push({
                id: doc.id,
                ...doc.data()
            })
        })
        
        res.json({
            success: true,
            data: productos,
            total: productos.length
        })
    }
    catch(error){
        console.error('Error al obtener productos:', error)
        res.status(500).json({success:false, error: error.message})
}
}

const crearProductos = async (req, res) => {
 try {
        const { nombre, inventariable, precio, costo, existencia } = req.body
        
        //  Validación básica
        if (!nombre || inventariable === undefined || !precio || !costo) {
            return res.status(400).json({ 
                success: false, 
                error: 'Faltan campos requeridos' 
            })
        }
        
        const newProduct = {
            nombre,
            inventariable,
            precio: parseFloat(precio),  //  Asegurar que sea número
            costo: parseFloat(costo),
            existencia: existencia || 0,
            creado: new Date()  //  Fecha de creación
        }
        
        const docRef = await db.collection('productos').add(newProduct)
        
        //  Devolver el ID del producto creado
        res.status(201).json({ 
            success: true, 
            message: 'Producto agregado exitosamente',
            data: {
                id: docRef.id,
                ...newProduct
            }
        })
    }
    catch(error) {
        console.error('Error al agregar producto:', error)  //  Log del error
        res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}

module.exports = {
    obtenerProductos,
    crearProductos
}