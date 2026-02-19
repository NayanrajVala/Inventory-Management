import { FastifyRequest } from 'fastify';


export interface FastRequest extends FastifyRequest{
  user?:{
    userId:string,
    roles:string[],
    email:string
  };
}