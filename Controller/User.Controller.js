const User = require("../Model/User.Model");


async function createUser({ body }) {
    const user = await User.create(body)
    return user
}


async function updateUser({ id, body }) {
    const user = await User.findByIdAndUpdate(id, body, { new: true })
    return user
}

async function getUserById(id) {
    return await User.findById(id)
}

const geolib = require('geolib'); // You may need to install this library

async function searchUser({ high_age = 60, low_age = 1, gender = "", breed = "", original = false, Latitude = "", Longitude = "", maxDistance = 100 }) {
    // Create a filter object to build the query
    const filter = {};

    // Apply filters based on the provided parameters
    if (high_age) {
        filter.age = { $lte: high_age };
    }
    if (low_age) {
        filter.age = { ...filter.age, $gte: low_age };
    }
    if (gender) {
        filter.gender = gender;
    }
    if (breed) {
        filter.breed = breed;
    }
    if (original) {
        filter.original = original;
    }

    // If Latitude and Longitude are provided, calculate distance
    if (Latitude && Longitude) {
        filter.location = {
            $geoWithin: {
                $centerSphere: [
                    [parseFloat(Longitude), parseFloat(Latitude)],
                    maxDistance / 6371 // Convert maxDistance from kilometers to radians
                ]
            }
        };
    }

    // Use the filter to find matching users and sort them as needed
    const users = await User.find(filter).sort({ age: 1 /* or -1 for descending */ });

    return users;
}



module.exports = { createUser, updateUser, getUserById, searchUser }