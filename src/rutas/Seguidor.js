const express = require('express');
const ruta = express.Router();
const { body, validationResult } = require('express-validator');
const mysqlConnection = require('../database')

/**
 * @swagger
 * components:
 *  schemas:
 *    Seguidor:
 *      type: object
 *      properties:
 *        idUsuario:
 *          type: integer
 *          description: id de un Usuario
 *        idSeguidor:
 *          type: integer
 *          description: id del usuario que toma el rol de seguidor
 *      required:
 *        - idUsuario
 *        - idSeguidor
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
 *  name: Seguidor
 *  description: endpoints para Seguidor
 */

/**
 * @swagger
 * /Seguidor:
 *  get:
 *    summary: retorna la lista de todos los usuarios y sus seguidores 
 *    tags: [Seguidor]
 *    responses:
 *      200:
 *        description: Lista de Seguidor
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Seguidor'
 */
ruta.get('/Seguidor', (req, res) =>{
    mysqlConnection.query('CALL R_Seguidor()', (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Seguidor/{idUsuario}/{idSeguidor}:
 *  get:
 *    summary: Retorna un True o False si la relacion entre los 2 usuarios existen
 *    tags: [Seguidor]
 *    responses:
 *      200:
 *        description: Usuario seguido
 */
ruta.get('/Seguidor/:idUsuario/:idSeguidor', (req, res) =>{
    const {idUsuario, idSeguidor} = req.params
    mysqlConnection.query('CALL R_IsFollowing(?, ?)',[idUsuario, idSeguidor], (err, rows, fields) =>{
        if(!err){
            res.status(200).json(rows[0][0])
        }else{
            res.status(500)
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Seguidores/{idUsuario}:
 *  get:
 *    summary: Retorna la lista de usuarios que siguen al usuario dado
 *    tags: [Seguidor]
 *    parameters:
 *      - $ref: '#/components/parameters/idUsuario'
 *    responses:
 *      200:
 *        description: Lista de personas que sigue un usuario
 *        content:
 *          application/json:
 *            schema:
 *            $ref: '#/components/schemas/Seguidor'
 *      404:
 *        description: Usuario no encontrado
 */
ruta.get('/Seguidores/:idUsuario', (req, res) =>{
    const {idUsuario} = req.params;
    mysqlConnection.query('CALL R_Seguidores(?)',[idUsuario], (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Seguidor/Siguiendo/{idUsuario}:
 *  get:
 *    summary: Retorna la lista de usuarios que el usuario dado sigue
 *    tags: [Seguidor]
 *    parameters:
 *      - $ref: '#/components/parameters/idUsuario'
 *    responses:
 *      200:
 *        description: Lista de seguidores del usuario mandado
 *        content:
 *          application/json:
 *            schema:
 *            $ref: '#/components/schemas/Seguidor'
 *      404:
 *        description: Usuario no encontrado
 */
ruta.get('/Siguiendo/:idUsuario', (req, res) =>{
    const {idUsuario} = req.params;
    mysqlConnection.query('CALL R_Siguiendo(?)',[idUsuario], (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Seguidor:
 *  post:
 *    summary: Agrega un seguidor
 *    tags: [Seguidor]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Seguidor'
 *    responses:
 *      200:
 *        description: Follow
 *      500:
 *        description: Error con el servidor
 *
 */
ruta.post('/Seguidor',[
    body("idUsuario", "Ingrese el id del usuario a seguir").exists(),
    body("idSeguidor", "Ingrese el id del usuario que sigue").exists()
], (req, res) =>{
    const {idUsuario, idSeguidor} = req.body
    mysqlConnection.query('CALL C_Seguidor(?, ?)', [idUsuario, idSeguidor], (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Seguidor:
 *  delete:
 *    summary: Elimina un follow
 *    tags: [Seguidor]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Seguidor'
 *    responses:
 *      200:
 *        description: Follow quitado
 *      404:
 *        description: este follow no existe
 */
ruta.delete('/Seguidor/:idUsuario/:idSeguidor', (req, res) =>{
    const {idUsuario, idSeguidor} = req.params
    mysqlConnection.query('CALL D_Unfollow(?, ?)', [idUsuario, idSeguidor], (err, rows, fields) =>{
        if(!err){
            res.status(200).json(rows[0][0])
        }else{
            res.status(400)
        }
    })
})
module.exports = ruta