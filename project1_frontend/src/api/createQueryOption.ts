import { queryOptions } from "@tanstack/react-query";
import {z} from 'zod';

const TicketSchema = z.object({
    reimbId : z.number(),
    description : z.string(),
    amount : z.number(),
    status : z.string(),
    userId : z.number()
});

const ArrayOfTicketsSchema = z.array(TicketSchema);

export type TicketsArray = z.infer<typeof ArrayOfTicketsSchema>;

export function createQueryOptions(){
    return queryOptions({
        queryKey: ['tickets'],
        queryFn : async() => await fetch('http://localhost:8080/api/user/allmytickets/22')
                                .then(response =>response.json())
                                .then(data => ArrayOfTicketsSchema.parse(data)),
        enabled : true                 
                                                           
    })
}