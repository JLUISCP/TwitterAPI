const express = require('express');
const ruta = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require('express-validator')
const mysqlConnection = require('../database')

/**
 * @swagger
 * components:
 *  schemas:
 *    Usuario:
 *      type: object
 *      properties:
 *        idUsuario:
 *          type: integer
 *          description: id autogenerado de Usuario
 *        Nombre:
 *          type: string
 *          description: Nombre del usuario
 *        ApellidoPaterno:
 *          type: string
 *          description: Apellido paterno del usuario
 *        ApellidoMaterno:
 *          type: string
 *          description: Apellido materno del usuario
 *        FechaNacimiento:
 *          type: string
 *          description: fecha de nacimiento del usuario
 *        Email:
 *          type: string
 *          description: Correo electronico del usuario
 *        NombreUsuario:
 *          type: string
 *          description: nombre de usuario para el sistema (Twitter academico)
 *        Contraseña:
 *          type: string
 *          description: contraseña de acceso a la cuenta del usuario
 *        idTipoUsuario:
 *          type: integer
 *          description: id(llave foranea) que representa el roll de este usuario
 *      required:
 *        - Nombre
 *        - ApellidoPaterno
 *        - ApellidoMaterno
 *        - FechaNacimiento
 *        - Email
 *        - NombreUsuario
 *        - Contraseña
 *        - idTipoUsuario
 *  parameters:
 *    idUsuario:
 *      in: path
 *      name: idUsuario
 *      required: true
 *      schema:
 *        type: integer 
 *      description: id del Usuario
 */

/**
 * @swagger
 * tags:
 *  name: Usuario
 *  description: endpoints para Usuario
 */

/**
 * @swagger
 * /Usuario:
 *  get:
 *    summary: retorna una lista de Usuario
 *    tags: [Usuario]
 *    responses:
 *      200:
 *        description: Lista de Usuario
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Usuario'
 */
ruta.get('/Usuario', (req, res) => {
    mysqlConnection.query('CALL R_Usuario()', (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Usuario/{idUsuario}:
 *  get:
 *    summary: Obtiene un usuario por su ID
 *    tags: [Usuario]
 *    parameters:
 *      - $ref: '#/components/parameters/idUsuario'
 *    responses:
 *      200:
 *        description: Usuario eliminado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Usuario'
 *      404:
 *        description: Usuario no encontrado
 */
ruta.get('/Usuario/:idUsuario', (req, res) => {
    const {idUsuario} = req.params
    mysqlConnection.query('CALL R_UsuarioByID(?)', [idUsuario], (err, rows, fields) =>{
        if(!err){
            if(!(rows[0][0]).hasOwnProperty("Respuesta")){
                res.status(200).json(rows[0][0])
            }else{
                res.status(404).json(rows[0])
            }
        }else{
            res.status(500).json(err)
        }
    })
})

/**
 * @swagger
 * /Usuario:
 *  post:
 *    summary: Crear un nuevo Usuario
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Usuario'
 *    responses:
 *      200:
 *        description: Usuario guardado
 *      500:
 *        description: Error con el servidor
 *
 */
ruta.post('/Usuario',[
    body("Nombre", "Ingrese un nombre para el usuario").exists(),
    body("NombreUsuario", "Ingrese el nombre de usuario para el usuario").exists(),
    body("Contraseña", "Ingrese la contraseña par la cuenta de este usuario").exists()
], (req, res) =>{
    const {Nombre, NombreUsuario, Contraseña} = req.body
    mysqlConnection.query('CALL CU_Usuario(?, ?, ?, ?)', [0, Nombre, NombreUsuario, Contraseña], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Usuario guardado'})
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Usuario/{idUsuario}:
 *  put:
 *    summary: Actualiza un Usuario por id
 *    tags: [Usuario]
 *    parameters:
 *      - $ref: '#/components/parameters/idUsuario'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Usuario'
 *    responses:
 *      200:
 *        description: Usuario actualizado
 *      404:
 *        description: Usuario no encontrado
 */
ruta.put('/Usuario/:idUsuario',[
    body("Nombre", "Ingrese un nombre para el usuario").exists(),
    body("NombreUsuario", "Ingrese el nombre de usuario para el usuario").exists(),
    body("Contraseña", "Ingrese la contraseña par la cuenta de este usuario").exists()
], (req, res) =>{
    const {idUsuario} = req.params
    const {Nombre, NombreUsuario, Password} = req.body
    mysqlConnection.query('CALL CU_Usuario(?, ?, ?, ?)', [idUsuario, Nombre, NombreUsuario, Password], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Usuario actualizado'})
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Usuario/{idUsuario}:
 *  delete:
 *    summary: Eliminar un Usuario de la BD por id 
 *    tags: [Usuario]
 *    parameters:
 *      - $ref: '#/components/parameters/idUsuario'
 *    responses:
 *      200:
 *        description: Usuario eliminado
 *      404:
 *        description: Usuario no encontrado
 */
ruta.delete('/Usuario/:idUsuario', (req, res) =>{
    const {idUsuario} = req.params;
    mysqlConnection.query('CALL D_Usuario(?)', [idUsuario], (err, rows, fields) =>{
        if(!err){
            res.json({Status: 'Usuario eliminados'})
        }else{
            console.log(err)
        }
    })
})
module.exports = ruta
