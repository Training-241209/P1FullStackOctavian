import { queryOptions } from "@tanstack/react-query";
import {z} from 'zod';

const UserSchema = z.object({
    userId : z.number(),
    username: z.string(),
    password : z.number(),
    roleId : z.number()
});

export type User = z.infer<typeof UserSchema>;

export function createQueryOptionsRegister(){
    return queryOptions({
        queryKey: ['user'],
        queryFn : async() => await fetch('http://localhost:8080/api/user/register')
                                .then(response =>response.json())
                                .then(data => UserSchema.parse(data)),
        enabled : true                 
                                                           
    })
}