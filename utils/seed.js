const { connect, connection } = require('mongoose');
const { User, Thought } = require('../models');
let { userData, thoughtTexts, reactions } = require('./data');

connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/social-networkDB');

connection.once('open', async () => {
    console.log('Connected to the database');

    try {
        // Clear the existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Create users
        const users = [];

        for (const userDatum of userData) {
            const user = await User.create(userDatum);
            users.push(user);
        }

        // Create thoughts and add reactions
        for (const thoughtText of thoughtTexts) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const thought = await Thought.create({
                thoughtText,
                username: randomUser.username,
            });

            // Add reactions to the thought
            for (const reaction of reactions) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                thought.reactions.push({
                    reactionBody: reaction.reactionBody,
                    username: randomUser.username,
                });
            }

            await thought.save();
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        connection.close();
    }
});