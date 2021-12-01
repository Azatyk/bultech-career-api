import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from 'src/config';
import { User } from './data/entities/user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.db.host,
      port: 5432,
      username: config.db.username,
      password: config.db.password,
      database: config.db.name,
      entities: [User],
      synchronize: false,
    }),
  ],
})
export class AppModule {}
