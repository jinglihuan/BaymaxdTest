'use strict'

// node level
import fs from 'fs'
import path from 'path'

// npm level
import _ from 'lodash'
import moment from 'moment'
import async from 'async'
import mysql from 'mysql'

import express from 'express'
import bodyParser from 'body-parser'

import passport from 'passport'
import { Strategy } from 'passport-local'

// app level
// import __utils from './utils'
import config, { serverConf, dbConf } from './config'

// namespace ?
const __router = express.Router()
const __api = express()
const __db = mysql.createConnection(dbConf)
const __apiDir = fs.readdirSync(path.join(__dirname, 'api', 'v1'))

const __utils = require('./utils')(_, moment, async, __db)

//
passport.use(new Strategy(
	function(username, password, callback) {
		console.log(username, password)
		return cb(null, user)
	}
))

// config
__api.use(bodyParser.json())
__api.set('json spaces', 4)

__api.use(passport.initialize())
__api.use(passport.session())

// load api
_.each(__apiDir, function (api) {
	require(`./api/v1/${api}`)(__router, __db, _, moment, async, __utils, config)
})

// prefix api
__api.use('/api/v1', __router)

//
__api.use(function(err, req, res, next) {
	res.status(err.status || 500).json({
		message: err.message,
		error: err
	})
})

// listen
__api.listen(serverConf.port, function () {
	console.log(`api server is running at port ${serverConf.port}`)
})
