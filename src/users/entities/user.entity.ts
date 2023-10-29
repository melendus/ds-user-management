import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../public/enums/role.enum';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  role: Role;

  @Column()
  password: string;

  @Column()
  email: string;
}
