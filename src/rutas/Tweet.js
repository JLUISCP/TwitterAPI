const express = require('express');
const ruta = express.Router();
const { body, validationResult } = require('express-validator')
const mysqlConnection = require('../database')

/**
 * @swagger
 * components:
 *  schemas:
 *    Tweet:
 *      type: object
 *      properties:
 *        idTweet:
 *          type: integer
 *          description: id autogenerado de Tweet
 *        Cuerpo:
 *          type: string
 *          description: Contenido del tweet
 *        FechaHoraPublicacion:
 *          type: string
 *          description: Fecha en la que se publico o actualizo el Tweet
 *        Likes:
 *          type: integer
 *          description: cantidad de likes del Tweet, comienza en 0
 *        idUsuario:
 *          type: integer
 *          description: id del Usuario que publico el Tweet
 *      required:
 *        - Cuerpo
 *        - FechaHoraPublicacion
 *        - idUsuario
 *  parameters:
 *    idTweet:
 *      in: path
 *      name: idTweet
 *      required: true
 *      schema:
 *        type: integer 
 *      description: id del Tweet
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
 *  name: Tweet
 *  description: endpoints para Tweet
 */

/**
 * @swagger
 * /Tweet:
 *  get:
 *    summary: retorna una lista de Tweet
 *    tags: [Tweet]
 *    responses:
 *      200:
 *        description: Lista de Tweet
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Tweet'
 */
ruta.get('/Tweet', (req, res) => {
    mysqlConnection.query('CALL R_Tweet()', (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})

ruta.get('/TweetPerfil/:idUsuario', (req, res) => {
    const {idUsuario} = req.params
    mysqlConnection.query('CALL R_TweetsPerfil(?)', [idUsuario], (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Tweet/{idUsuario}:
 *  get:
 *    summary: obtener la lista de Tweets de las persona que sigues y los del usuario mismo
 *    tags: [Tweet]
 *    parameters:
 *      - $ref: '#/components/parameters/idUsuario'
 *    responses:
 *      200:
 *        description: Lista de Tweet
 *        content:
 *          application/json:
 *            schema:
 *            $ref: '#/components/schemas/Tweet'
 *      404:
 *        description: Usuario no encontrado
 */
ruta.get('/Tweet/:idUsuario', (req, res) => {
    const {idUsuario} = req.params
    mysqlConnection.query('CALL R_TweetFollowing(?)', [idUsuario], (err, rows, fields) =>{
        if(!err){
            res.json(rows[0])
        }else{
            console.log(err)
        }
    })
})

ruta.get('/Tweet/Content/:Keyword', (req, res) => {
    const {Keyword} = req.params
    mysqlConnection.query('CALL S_InTweet(?)', [Keyword], (err, rows, fields) =>{
        if(!err){
            res.status(200).json(rows[0])
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Tweet:
 *  post:
 *    summary: Crear un nuevo Tweet
 *    tags: [Tweet]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Tweet'
 *    responses:
 *      200:
 *        description: Tweet guardado
 *      500:
 *        description: Error con el servidor
 *
 */
ruta.post('/Tweet', (req, res) =>{
    const {Cuerpo, FechaHoraPublicacion, idUsuario} = req.body
    mysqlConnection.query('CALL CU_Tweet(?, ?, ?, ?)', [0, Cuerpo, FechaHoraPublicacion, idUsuario], (err, rows, fields) =>{
        if(!err){
            res.status(201).json(rows[0][0])
        }else{
            res.status(500)
        }
    })
})

/**
 * @swagger
 * /Tweet/{idTweet}:
 *  put:
 *    summary: Actualiza un Tweet por id
 *    tags: [Tweet]
 *    parameters:
 *      - $ref: '#/components/parameters/idTweet'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Tweet'
 *    responses:
 *      200:
 *        description: Tweet actualizado
 *      404:
 *        description: Tweet no encontrado
 */
ruta.put('/Tweet/:idTweet', (req, res) =>{
    const {idTweet} = req.params
    const {Cuerpo, FechaHoraPublicacion, idUsuario} = req.body
    mysqlConnection.query('CALL CU_Tweet(?, ?, ?, ?)', [idTweet, Cuerpo, FechaHoraPublicacion, idUsuario], (err, rows, fields) =>{
        if(!err){
            res.status(200).json(rows[0][0])
        }else{
            console.log(err)
        }
    })
})

/**
 * @swagger
 * /Tweet/{idTweet}:
 *  delete:
 *    summary: Eliminar un Tweet de la BD por id 
 *    tags: [Tweet]
 *    parameters:
 *      - $ref: '#/components/parameters/idTweet'
 *    responses:
 *      200:
 *        description: TWeet eliminado
 *      404:
 *        description: Tweet no encontrado
 */
ruta.delete('/Tweet/:idTweet', (req, res) =>{
    const {idTweet} = req.params;
    mysqlConnection.query('CALL D_Tweet(?)', [idTweet], (err, rows, fields) =>{
        if(!err){
            res.json(rows[0][0])
        }else{
            console.log(err)
        }
    })
})

module.exports = ruta