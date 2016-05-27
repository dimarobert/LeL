'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Update user details
 */
exports.startedcourses = function (req, res) {
    var userId = req.user._id;
    User.findOne({ _id: userId }).lean()
        .exec(function (err, results) {
            var userCourses = results.startedCourses;

            for (var course of userCourses) {
                course.score = course.finishedLessons.reduce(function (acc, next) {
                    return acc + next.points;
                }, 0);
            }

            res.jsonp(userCourses);
        });
};