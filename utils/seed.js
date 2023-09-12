const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { thoughtTexts, reactions } = require('./data');

connection.once('open', async () => {
    console.log('Connected to the database');

    try {
        // Clear the existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Get all users from the database
        const users = await User.find({});

        // Create thoughts and add reactions
        for (const thoughtText of thoughtTexts) {
            const randomUser = users[Math.floor(Math.random() * users.length)]; // Select a random user
            const thought = await Thought.create({
                thoughtText,
                username: randomUser.username,
            });

            // Add reactions to the thought
            for (const reaction of reactions) {
                thought.reactions.push({
                    reactionBody: reaction.reactionBody,
                    username: reaction.username,
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