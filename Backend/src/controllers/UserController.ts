import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { User } from "../entities/Users";
import * as jwt from "jsonwebtoken";
import { Not } from "typeorm";


class UserController {
    async listUser(req: Request, res: Response): Promise<Response> {
        var email =  jwt.decode(req.cookies.jwt)
        const response: any = await AppDataSource.getRepository(User).find({where:{email:Not(email?email.toString():"")}
        });
      
        return res.json(response);
    }
    async profileUser(req: Request, res: Response): Promise<Response> {
        var email =  jwt.decode(req.cookies.jwt)
        const response: any = await AppDataSource.getRepository(User).findOne({where:{email:email?email.toString():""}
       
        });
        return res.json(response);
    }
    public async updateUser(req: Request, res: Response): Promise<Response> {
        const { id, name, email, password, gender,role } = req.body;
        const collection = AppDataSource.getRepository(User)
        const renew = await collection.findOneBy({
            id: id,
        })
        renew.name = name;
        renew.email = email;
        renew.password = renew.password;
        renew.gender = gender;
        renew.role = role;

        await collection.save(renew)
        return res.json(renew)
    }
    public async updateProfile(req: Request, res: Response): Promise<Response> {
        const { id, name, email, password, oldPassword, gender,role, changePassword } = req.body;
        const collection = AppDataSource.getRepository(User)
        const renew = await collection.findOneBy({
            id: id,
        })

        if(!renew){
            return res.json({error:"User not found"})
        }
        if(changePassword){
            if(oldPassword != renew.password){
                return res.json({error:"Wrong password"})
            }
            renew.password = password

        }
        renew.name = name;
        renew.email = email;
        renew.gender = gender;
        renew.role = role;

        await collection.save(renew)
        return res.json(renew)
    }
    public async createUser(req: Request, res: Response): Promise<Response> {
        const { name, email, password, gender, role } = req.body;

        const object = new User();
        object.name = name;
        object.email = email;
        object.password = password;
        object.gender = gender;
        object.role = role;

        const user: any = await AppDataSource.manager.save(User, object).catch((e) => {
            return res.json({error:"Error saving user"
            });
        })
        if (user.id) {

            return res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                gender: user.gender
            });
        }
        return res.json({ error: "Error saving user" });

    }
    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.body;

        const user: any = await AppDataSource.getRepository(User).findOneBy({id:id}).catch((e) => {
            return { error: "Invalid identifier" }
        })

        if (user && user.id) {
            const r = await AppDataSource.manager.remove(User, user).catch((e) => e)
            return res.json(r)
        }
        else {
            return res.json({ error: "User not found" })
        }


    }
    async getUsers(req: Request, res: Response): Promise<Response> {
        const response: any = await AppDataSource.getRepository(User).find({});
        return res.json(response);
    }
    async getUser(req: Request, res: Response): Promise<Response> {
        const id = parseInt(req.params.id)
        const user: any = await AppDataSource.getRepository(User).findOne({where:{id:id}}).catch((e) => {
            return { error: "Invalid identifier" }
        })
        return res.json(user);
    }

} export default new UserController();
