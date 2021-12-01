import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/data/entities/user.entity';
import config from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async login(payload: LoginDto) {
    let user = await this.userRepository.findOne({ email: payload.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordsMatch = await this.comparePasswords(
      user.password,
      payload.password,
    );
    if (!passwordsMatch) {
      throw new UnauthorizedException('Credentials are invalid');
    }

    const tokenPayload = this.getTokenPayload(user);
    const token = this.generateAuthToken(tokenPayload);
    const auth = { token };

    return { auth, user };
  }

  async register(payload: RegisterDto) {
    await this.checkUserAlreadyExists(payload.email);

    const hashedPassword: string = await this.hashPassword(payload.password);
    const userData = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
    };

    const user = new User()
    user.email = payload.email;
    user.password = hashedPassword;
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;

    await user.save();

    const tokenPayload = this.getTokenPayload(user);
    const token = this.generateAuthToken(tokenPayload);
    const auth = { token };

    return { auth, user };
  }

  hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }

  comparePasswords(
    currentPasswordHash: string,
    comparingPassword: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(comparingPassword, currentPasswordHash, (err, success) => {
        if (err) return reject(err);
        return resolve(success);
      });
    });
  }

  private getTokenPayload(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private generateAuthToken(payload: object): string {
    const secret = config.jwtSecret;
    const token: string = jwt.sign(payload, secret, {
      expiresIn: '7d',
    });
    return `Bearer ${token}`;
  }

  private async checkUserAlreadyExists(email: string) {
    const user = await this.userRepository.findOne({ email });

    if (user) {
      throw new ConflictException('User already exists');
    }
  }
}
