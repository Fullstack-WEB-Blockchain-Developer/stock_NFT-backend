import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { AuthDto } from './dto/auth.dto';

import * as ethUtil from 'ethereumjs-util';
import * as sigUtil from 'eth-sig-util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('Auth');
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async auth(authDto: AuthDto) {
    const user = await this.usersRepository.findOne({
      where: { publicAddress: authDto.publicAddress },
      select: ['nonce', 'publicAddress', 'id', 'username'],
    });

    if (!user) {
      this.logger.log(
        `Log in attempt. User with provided public address '${authDto.publicAddress}' not found`,
      );
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    let address;
    console.log('nonce', user.nonce);

    try {
      const msg = `I am signing my one-time nonce: ${user.nonce}`;
      const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));

      address = sigUtil.recoverPersonalSignature({
        data: msgBufferHex,
        sig: authDto.signature,
      });
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }

    if (address.toLowerCase() !== authDto.publicAddress.toLowerCase()) {
      this.logger.error(
        `Signature '${authDto.signature}' verification failed for user '${user.username}' with provided public address '${user.publicAddress}'`,
      );
      throw new HttpException(
        'Signature verification failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
    user.nonce = Math.floor(Math.random() * 1000000);
    this.usersRepository.save(user);
    this.logger.log(
      `User ${user.username} with public address '${user.publicAddress}' is logged in`,
    );

    return {
      token: this.jwtService.sign({
        payload: {
          id: user.id,
          publicAddress: authDto.publicAddress,
        },
      }),
    };
  }

  async verify(user: UserEntity) {
    return this.generateToken(user);
  }

  async verifyTest(user: any) {
    return this.generateToken(user);
  }

  private async generateToken(user: UserEntity) {
    return {
      token: this.jwtService.sign({
        payload: {
          id: user.id,
          publicAddress: user.publicAddress,
        },
      }),
    };
  }
}
