const {Movie, Genre, MovieGenre, Rating, Comment, User} = require('../models/models.js');
const { Op } = require("sequelize");
const db = require('../config/db.js');


class infoPostController{
    async getMovies(req, res) {
        const page = req.query.page || 1;
        const LIMIT = 20;
        const OFFSET = (Number(page) - 1) * LIMIT;

        try{
            const result = await Movie.findAndCountAll({
                attributes: ["movie_id", "title", "release_date", "poster_url"],
                where: {
                    type: "movie"
                },
                include: [
                    {
                        model: Rating,
                    }
                ],
                offset: OFFSET,
                limit: LIMIT
            });
            res.status(200).json({data: result.rows, currentPage: Number(page), total: Math.ceil(result.count / LIMIT)});
        } catch(error){
            res.json({message: error.message});
        }
    }

    async getTVSerieses(req, res) {
        const page = req.query.page || 1;
        const LIMIT = 20;
        const OFFSET = (Number(page) - 1) * LIMIT;

        try{
            const result = await Movie.findAndCountAll({
                attributes: ["movie_id", "title", "release_date", "poster_url"],
                where: {
                    type: "tv_series"
                },
                include: [
                    {
                        model: Rating
                    }
                ],
                offset: OFFSET,
                limit: LIMIT
            });
            res.status(200).json({data: result.rows, currentPage: Number(page), total: Math.ceil(result.count / LIMIT)});
        } catch(error){
            res.json({message: error.message});
        }
    }

    async getMovie(req, res) {
        const id = req.params.id;

        try{
            const result = await Movie.findOne({
                where: {
                    movie_id: id,
                    type: "movie"
                },
                order: [[{model: Comment}, 'post_date', 'desc']],
                include: [
                    {
                        model: Genre
                    },
                    {
                        model: Rating
                    },
                    {
                        model: Comment,
                        include: [
                            {
                                model: User
                            }
                        ],
                    }
                ]
            })
            res.status(200).json(result);
        } catch(error){
            res.json({message: error.message});
        }
    }

    async getTVSeries(req, res) {
        const id = req.params.id;

        try{
            const result = await Movie.findOne({
                where: {
                    movie_id: id,
                    type: "tv_series"
                },
                order: [[{model: Comment}, 'post_date', 'desc']],
                include: [
                    {
                        model: Genre
                    },
                    {
                        model: Rating
                    },
                    {
                        model: Comment,
                        include: [
                            {
                                model: User
                            }
                        ]
                    }
                ]
            })
            res.status(200).json(result);
        } catch(error){
            res.json({message: error.message});
        }
    }

    async getInfoPostsBySearch(req, res) {
        const searchQuery = `%${req.query.query}%`;
        const page = req.query.page || 1;
        const LIMIT = 20;
        const OFFSET = (Number(page) - 1) * LIMIT;

        if(!searchQuery) res.send(200).json({})

        try{
            const result = await Movie.findAndCountAll({
                where: {
                    title: {
                        [Op.like]: searchQuery,
                    }
                },
                offset: OFFSET,
                limit: LIMIT
            });
            res.status(200).json({data: result.rows, currentPage: Number(page), total: Math.ceil(result.count / LIMIT)});
        } catch(error){
            res.json({message: error.message});
        }
    }

    async getMoviesByGenre(req, res) {
        const genre_id = req.params.genre_id;
        const page = req.query.page || 1;
        const LIMIT = 20;
        const OFFSET = (Number(page) - 1) * LIMIT;

        try{
            const result = await Genre.findAndCountAll({
                where: {
                    genre_id: genre_id
                },
                include: [
                    {
                        model: Movie,
                        where: {
                            type: 'movie'
                        },
                        include: [
                            {
                                model: Rating
                            }
                        ],
                    },
                ],
                offset: OFFSET,
                limit: LIMIT
            });
            res.status(200).json({
                data: result.rows[0].movies,
                genre: {
                    genre_id: result.rows[0].genre_id, 
                    genre: result.rows[0].genre
                },
                currentPage: Number(page), 
                total: Math.ceil(result.count / LIMIT)
            });
        } catch(error){
            res.json({message: error.message});
        }
    }

    async getTVSeriesesByGenre(req, res) {
        const genre_id = req.params.genre_id;
        const page = req.query.page || 1;
        const LIMIT = 20;
        const OFFSET = (Number(page) - 1) * LIMIT;

        try{
            const result = await Genre.findAndCountAll({
                where: {
                    genre_id: genre_id
                },
                include: [
                    {
                        model: Movie,
                        where: {
                            type: 'tv_series'
                        },
                        include: [
                            {
                                model: Rating
                            }
                        ],
                    },
                ],
                offset: OFFSET,
                limit: LIMIT
            });
            res.status(200).json({
                data: result.rows[0].movies,
                genre: {
                    genre_id: result.rows[0].genre_id, 
                    genre: result.rows[0].genre
                },
                currentPage: Number(page), 
                total: Math.ceil(result.count / LIMIT)
            });
        } catch(error){
            res.json({message: error.message});
        }
    }

    async createInfoPost(req, res) {
        const {title, release_date, description, duration, type, poster_url, background, trailer_url, genres} = req.body;
        
        if(!req.role_id.includes(2)) return res.json({message: "Ви не модератор. Право на створення фільму є тільки в модератора"});

        try{
            const movie = await Movie.create({title, release_date, description, duration, type, poster_url, background, trailer_url}, {transaction: t});
            genres.split(",").forEach(async (genre) => {
                await MovieGenre.create({movie_id: movie.dataValues.movie_id, genre_id: genre}, {transaction: t});
            });

            const result = await Movie.findOne({
                where: {
                    movie_id: movie.dataValues.movie_id,
                    type: type
                },
                order: [[{model: Comment}, 'post_date', 'desc']],
                include: [
                    {
                        model: Genre
                    },
                    {
                        model: Rating
                    },
                    {
                        model: Comment,
                        include: [
                            {
                                model: User
                            }
                        ]
                    }
                ]
            })
            res.status(200).json(result);
        } catch(error){
            await t.rollback();
            res.json({message: error.message});
        }
    }

    async updateInfoPost(req, res) {
        const id = req.params.id;
        const {title, release_date, description, duration, type, poster_url, background, trailer_url, genres} = req.body;

        if(!req.role_id.includes(2)) return res.json({message: "Ви не модератор. Право на редагування фільму є тільки в модератора"});

        try{
            await Movie.update({title, release_date, description, duration, type, poster_url, background, trailer_url}, {where: {movie_id: id}});
            await MovieGenre.destroy({where: {movie_id: id}});
            genres.split(",").forEach(async (genre) => {
                await MovieGenre.create({movie_id: id, genre_id: genre});
            });

            await t.commit();
            
            const result = await Movie.findOne({
                where: {
                    movie_id: id,
                    type: type
                },
                order: [[{model: Comment}, 'post_date', 'desc']],
                include: [
                    {
                        model: Genre
                    },
                    {
                        model: Rating
                    },
                    {
                        model: Comment,
                        include: [
                            {
                                model: User
                            }
                        ]
                    }
                ]
            })
            res.status(200).json(result);
        } catch(error){
            await t.rollback();

            res.json({message: error.message});
        }
    }

    async deleteInfoPost(req, res) {
        const id = req.params.id;

        if(!req.role_id.includes(2)) return res.json({message: "Ви не модератор. Право на видалення фільму є тільки в модератора"});

        const t = await db.transaction();
        try{
            await Movie.destroy({where: {movie_id: id}}, {transaction: t});
            await MovieGenre.destroy({where: {movie_id: id}}, {transaction: t});
            await Rating.destroy({where: {movie_id: id}}, {transaction: t});
            await Comment.destroy({where: {movie_id: id}}, {transaction: t});

            await t.commit();

            res.status(200).send("Movie deleted");
        } catch(error){
            await t.rollback();

            res.json({message: error.message});
        }
    }

    async setRating(req, res) {
        const {movie_id, user_id, rating} = req.body;

        try{
            await Rating.create({movie_id, user_id, rating});
            res.status(200).json("Rating added");
        } catch(error){
            res.json({message: error.message});
        }
    }

    async changeRating(req, res) {
        const {rating_id, rating} = req.body;

        try{
            await Rating.update({rating}, {where: {rating_id}});
            res.status(200).json("Rating changed");
        } catch(error){
            res.json({message: error.message});
        }
    }

    async postComment(req, res) {
        const {movie_id} = req.params;
        const {user_id, comment_text, post_date} = req.body;

        try{
            await Comment.create({movie_id, user_id, comment_text, post_date});

            const result = await Movie.findOne({
                where: {
                    movie_id
                },
                order: [[{model: Comment}, 'post_date', 'desc']],
                include: [
                    {
                        model: Genre
                    },
                    {
                        model: Rating
                    },
                    {
                        model: Comment,
                        include: [
                            {
                                model: User
                            }
                        ]
                    }
                ]
            });

            res.status(200).json(result);
        } catch(error){
            res.json({message: error.message});
        }
    }
}

module.exports = new infoPostController();