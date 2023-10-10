/**
 * Express Router for user-related routes.
 * @module routes/users
 */

var express = require('express');
var router = express.Router();
const User = require('../models/user.model').model;

/**
 * GET request to retrieve a list of users.
 * @function
 * @name GET /
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
router.get('/', async function (req, res, next) {
    try {
        const users = await User.find({}, '_id username');
        res.send(users);
    } catch (e) {
        next(e);
    }
});

/**
 * POST request to create a new user.
 * @function
 * @name POST /
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
router.post('/', async function (req, res, next) {
    const user = new User(req.body);
    try {
        await user.save();
        res.send(user);
    } catch (e) {
        next(e);
    }
});

/**
 * POST request to add an exercise to a user's log.
 * @function
 * @name POST /:_id/exercises
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
router.post('/:_id/exercises', async function (req, res, next) {
    const exercise = {
        description: req.body.description,
        duration: +req.body.duration,
        date: !!req.body.date ? new Date(req.body.date) : new Date()
    };
    let user = await User.findById(req.params._id);
    user.exercises.push(exercise);
    await user.save();
    exercise.date = exercise.date.toDateString();
    user = user.toJSON();
    res.json(Object.assign({ username: user.username, _id: user._id }, exercise));
});

/**
 * GET request to retrieve a user's exercise logs.
 * @function
 * @name GET /:_id/logs
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
router.get('/:_id/logs', async function (req, res, next) {
    const from = req.query.from;
    const to = req.query.to;
    const limit = req.query.limit;

    const q = { 'exercises.date': {} };
    if (from) q['exercises.date'].$gte = new Date(from);
    if (to) q['exercises.date'].$lte = new Date(to);

    let user = await User.findById(req.params._id, '_id username exercises', from || to ? q : {});
    const response = {
        _id: user._id,
        username: user.username,
        count: user.exercises.length,
        log: user.exercises.map(item => Object.assign({}, { date: item.date.toDateString(), description: item.description, duration: item.duration }))
    };
    if (limit) response.log = response.log.slice(limit);
    res.send(response);
});

module.exports = router;
