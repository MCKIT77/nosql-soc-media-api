const mongoose = require('mongoose');
const { User, Thought } = require('./models');
const { names, thoughtTexts, reactions } = require('./utils/data');

mongoose.connect('mongodb://localhost/social-networkDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

const seedDatabase = async () => {
    try {
        // Clear the existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Create users
        const users = [];

        for (const name of names) {
            const user = await User.create({ username: name });
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
        mongoose.disconnect();
    }
};

seedDatabase();