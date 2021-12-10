const express = require('express')
const ruta = express.Router()
const bcrypt = require("bcryptjs");
const mysqlConnection = require('../database')

/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      properties:
 *        NombreUsuario:
 *          type: string
 *          description: id de un Usuario
 *        Contraseña:
 *          type: string
 *          description: id del usuario que toma el rol de seguidor
 *      required:
 *        - NombreUsuario
 *        - Contraseña
 */

/**
 * @swagger
 * tags:
 *  name: Login
 *  description: endpoints para Login
 */

/**
 * @swagger
 * /Login:
 *  post:
 *    summary: retorna un usuario si las credenciales son validas
 *    tags: [Login]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      200:
 *        description: Logeado
 */
ruta.post('/Login',(req, res) =>{
    const {NombreUsuario, Contraseña} = req.body
    mysqlConnection.query('CALL R_Login(?, ?)', [NombreUsuario, Contraseña], (err, rows, fields) =>{
        if(!err){
            if(!(rows[0][0]).hasOwnProperty("Respuesta")){
                res.status(200).json(rows[0][0])
            }else{
                res.status(404).json(rows[0][0])
            }
        }else{
            res.status(500)
        }
    })
})
module.exports = ruta