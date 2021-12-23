const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, UserRole, Role } = require('../models/models.js');
const db = require('../config/db.js');

class UserRoutes{
    async signup(req, res){
        const {first_name, last_name, email, password, confirmPassword, username} = req.body;

        const t = await db.transaction();
        try{
            const existingUser = await User.findOne({where: { email: email }})
            if(existingUser) res.status(400).json({message: "Користувач вже зареєстрований."});
            if(password !== confirmPassword) return res.status(400).json({message: "Задані різні паролі."});

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await User.create({first_name, last_name, email, password: hashedPassword, username}, {transaction: t});
            await UserRole.create({user_id: user.dataValues.user_id, role_id: 3}, {transaction: t});

            t.commit();

            const token = jwt.sign({ email: user.dataValues.email, id: user.dataValues.user_id, role_id: [3] }, 'bd_project', {expiresIn: "1h"});

            res.status(200).json({result: user.dataValues, token});
        } catch(error){
            t.rollback();

            res.json({message: error.message});
        }
    }

    async signin (req, res){
        const {email, password} = req.body;

        try{
            const existingUser = await User.findOne({
                where: { email: email },
                include: [
                    {
                        model: Role,
                    }
                ],
            })
            if(!existingUser) return res.status(404).json({message: "Користувача не знайдено."});

            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            if(!isPasswordCorrect) return res.status(400).json({message: "Невірний пароль."})

            const token = jwt.sign({ email: existingUser.email, id: existingUser.user_id, role_id: existingUser.roles.map(role => role.role_id) }, 'bd_project', {expiresIn: "1h"});

            res.status(200).json({result: existingUser, token});
        } catch(error){
            res.json({message: error.message});
        }
    }


    async getUsers (req, res){
        const page = req.query.page || 1;
        const LIMIT = 20;
        const OFFSET = (Number(page) - 1) * LIMIT;
        
        if(!req.role_id.includes(1)) return res.json({message: "Ви не адміністрато. Право на перегляд усіх користувачів є тільки в адміністратора"})

        try{
            const result = await User.findAndCountAll({
                include: [
                    {
                        model: Role,
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

    async updateRoles (req, res){
        const {id} = req.params;
        const {roles} = req.body;

        if(!req.role_id.includes(1)) return res.json({message: "Ви не адміністрато. Право надавати ролі користувачам є тільки в адміністратора"})

        try{
            await UserRole.destroy({where: {user_id: id}});
            roles.split(",").forEach(async (role) => {
                await UserRole.create({user_id: id, role_id: role});
            });

            const user = User.findOne({
                where: {user_id: id},
                include: [
                    {
                        model: Role,
                    }
                ],
            });

            res.status(200).json({data: user});
        } catch(error){
            res.json({message: error.message});
        }
    }
}

module.exports = new UserRoutes();