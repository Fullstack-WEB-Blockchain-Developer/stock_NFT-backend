import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger: Logger = new Logger('JWT');

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new HttpException('Acces denied', HttpStatus.UNAUTHORIZED);
      }

      const user = this.jwtService.verify(token);
      this.logger.log('User:', user.payload);
      const foundUser = this.usersRepository.findOne({
        where: { publicAddress: user.publicAddress, id: user.id },
      });

      if (!foundUser) {
        throw new HttpException('JWT user not found', HttpStatus.UNAUTHORIZED);
      }
      req.user = user;
      return true;
    } catch (error) {
      this.logger.log(error);
      throw new HttpException('Acces denied', HttpStatus.UNAUTHORIZED);
    }
  }
}
