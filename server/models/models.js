const { DataTypes } = require("sequelize");
const db = require("../config/db.js");

const Movie = db.define('movies', {
    movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "release_date"
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    poster_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    background: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    trailer_url: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true
});

const Genre = db.define('genres', {
    genre_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

const MovieGenre = db.define('movie_genre', {
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true
});

const User = db.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

const Role = db.define('roles', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

const UserRole = db.define('user_role', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true
});

const Rating = db.define('ratings', {
    rating_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

const Comment = db.define('comments', {
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    post_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date()
    }
}, {
    freezeTableName: true
});

Movie.belongsToMany(Genre, {through: 'movie_genre', foreignKey: 'movie_id'});
Genre.belongsToMany(Movie, {through: 'movie_genre', foreignKey: 'genre_id'});
Movie.hasMany(Rating, {foreignKey: 'movie_id'});
Rating.belongsTo(Movie, {foreignKey: 'movie_id'});
User.hasMany(Rating, {foreignKey: 'user_id'});
Rating.belongsTo(User, {foreignKey: 'user_id'});
User.belongsToMany(Role, {through: 'user_role', foreignKey: 'user_id'});
Role.belongsToMany(User, {through: 'user_role', foreignKey: 'role_id'});
Movie.hasMany(Comment, {foreignKey: 'movie_id'});
Comment.belongsTo(Movie, {foreignKey: 'movie_id'});
User.hasMany(Comment, {foreignKey: 'user_id'});
Comment.belongsTo(User, {foreignKey: 'user_id'});

module.exports = {Movie, Genre, MovieGenre, User, Role, UserRole, Rating, Comment};
