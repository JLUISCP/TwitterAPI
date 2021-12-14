const express = require('express')
const ruta = express.Router()
const mysqlConnection = require('../database')
const verificarToken = require('../auth')


ruta.get('/Likes/:idTweet/:idUsuario', verificarToken, (req, res) =>{
    const {idTweet, idUsuario} = req.params
    mysqlConnection.query('CALL R_IsLiked(?,?)', [idTweet, idUsuario], (err, rows, fields) =>{
        if(!err){
            res.status(200).json(rows[0][0])
        }else{
            res.status(500)
        }
    })
})

ruta.get('/Likes/:idTweet', verificarToken, (req, res) =>{
    const {idTweet} = req.params
    mysqlConnection.query('CALL R_CantidadLikes(?)', [idTweet], (err, rows, fields) =>{
        if(!err){
            res.status(200).json(rows[0][0])
        }else{
            res.status(500)
        }
    })
})
ruta.post('/Likes', verificarToken, (req, res) =>{
    const {idTweet, idUsuario} = req.body
    mysqlConnection.query('CALL C_Likes(?, ?)', [idTweet, idUsuario], (err, rows, fields) =>{
        if(!err){
            res.status(201).json(rows[0][0])
        }else{
            res.status(500)
        }
    })
})

ruta.delete('/Likes/:idTweet/:idUsuario', verificarToken, (req, res) =>{
    const {idTweet, idUsuario} = req.params
    mysqlConnection.query('CALL D_Likes(?, ?)', [idTweet, idUsuario], (err, rows, fields) =>{
        if(!err){
            res.status(200).json(rows[0][0])
        }else{
            res.status(500)
        }
    })
})
module.exports = ruta