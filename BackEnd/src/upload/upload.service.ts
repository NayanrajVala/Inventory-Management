import { BadRequestException,Injectable} from '@nestjs/common';
import * as fs from 'fs';
 import fastify = require('fastify')
import path from 'path';


@Injectable()
export class UploadService {
     async uploadFile(req:fastify.FastifyRequest & any){
        if(!req.isMultipart()){
            throw new BadRequestException('request must be multipart')
        }

        const file = await req.file()

        if(!file){
            throw new BadRequestException('No file uploaded')
        }

        const allowedTypes = [
            'application/vnd.ms.excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]

        if(!allowedTypes.includes(file.mimetype)){
            throw new BadRequestException('Only excel files are accepted')
        }
        
        const uploadDir = path.join(process.cwd(),'uploads')

        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir)
        }

        const buffer = await file.toBuffer()

        const filepath = path.join(uploadDir,file.filename)

        fs.writeFileSync(filepath,buffer)

        return {
            message:'File Uploaded successfully',
            filename:file.filename,
            path:filepath
        }
     }
}   
