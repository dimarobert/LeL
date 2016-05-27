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
exports.top15 = function (req, res) {
    User.find().lean()
        .where('startedCourses.course').equals(req.params.courseId)
        .exec(function (err, results) {
            var users = getUsersByStartedCourse(req.params.courseId, results);

            users = sortUsersByScore(users);
            users = _.take(users, 15);
            res.jsonp(users);
        });
};

exports.currentUserPlace = function (req, res) {
    User.find().lean()
        .where('startedCourses.course').equals(req.params.courseId)
        .exec(function (err, results) {
            var users = getUsersByStartedCourse(req.params.courseId, results);
            users = sortUsersByScore(users);
            var user = _.find(users, function (u) { return u._id.equals(req.user._id); });
            res.jsonp({
                place: _.indexOf(users, user) + 1,
                score: user.score
            });
        });
}

function getUsersByStartedCourse(courseId, users) {
    return _.filter(users, function (user) {
        var course = user.startedCourses.find(function (v) {
            return v.course.equals(courseId);
        });
        user.score = course.finishedLessons.reduce(function (acc, next) {
            return acc + next.points;
        }, 0);
        return course ? true : false;
    });
}

function sortUsersByScore(users) {
    return users.sort(function (a, b) {
        return b.score - a.score;
    });
}