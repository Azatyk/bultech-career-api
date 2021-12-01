import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'email', length: '255' })
  email: string;

  @Column({ type: 'varchar', name: 'password', length: '255' })
  password: string;

  @Column({ type: 'varchar', name: 'firstName', length: '255' })
  firstName: string;

  @Column({ type: 'varchar', name: 'lastName', length: '255' })
  lastName: string;
}
