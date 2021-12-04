const express = require('express');
const ruta = express.Router();

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
 *          type: string
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
 * /Seguidor/Siguiendo/{idUsuario}:
 *  get:
 *    summary: retorna la lista de las personas que sigue un usuario
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
ruta.get('/Seguidor/Siguiendo/:idUsuario', (req, res) =>{
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
 * /Seguidor/Seguido/{idUsuario}:
 *  get:
 *    summary: retorna liste de usuarios que siguen a un usuario determinado
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
ruta.get('/Seguidor/Seguido/:idUsuario', (req, res) =>{
    const {idUsuario} = req.params;
    mysqlConnection.query('CALL R_Seguido(?)',[idUsuario], (err, rows, fields) =>{
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
ruta.post('/Seguidor', (req, res) =>{
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
ruta.delete('/Seguidor', (req, res) =>{
    const {idUsuario, idSeguidor} = req.body
    mysqlConnection.query('CALL D_Unfollow(?, ?)', [idUsuario, idSeguidor], (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})
module.exports = ruta