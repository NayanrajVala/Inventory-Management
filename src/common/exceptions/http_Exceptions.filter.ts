import { ExceptionFilter,Catch,ArgumentsHost,HttpException } from "@nestjs/common";
import { FastifyRequest,FastifyReply } from "fastify";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception:HttpException,host:ArgumentsHost){
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<FastifyRequest>()
        const response = ctx.getResponse<FastifyReply>();
        const status = exception.getStatus();

        response.status(status).send({
            message:exception.message,
            path:request.url
        })
    }
}