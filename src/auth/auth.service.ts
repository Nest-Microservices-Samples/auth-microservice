import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('AuthService');

    onModuleInit() {
        this.$connect();
        this.logger.log('MongoDB connected');
    }


    async registerUser(registerUserDto: RegisterUserDto) {

        const { email, name, password } = registerUserDto;

        try {

            const user = await this.user.findUnique({
                where: {
                    email,
                }
            });

            if (user) {
                throw new RpcException({
                    status: 400,
                    message: 'User already exists',
                })
            }

            const newUser = await this.user.create({
                data: {
                    email,
                    password: bcrypt.hashSync( password, 10 ),
                    name,
                }
            });

            const { password: __, ...rest } = newUser;

            return {
                user: rest,
                token: 'ABC',
            }

        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message,
            });
        }
    }
}
