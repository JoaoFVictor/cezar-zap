import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public phone_number: string;

  @Column({ default: false })
  public is_authenticated: boolean;

  @Column({ nullable: true })
  public token?: string;

  @Column({ nullable: true })
  public otp?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date = new Date();

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date = new Date();

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  constructor(phoneNumber: string, isAuthenticated: boolean, token?: string, otp?: string) {
    this.phone_number = phoneNumber;
    this.is_authenticated = isAuthenticated;
    this.token = token;
    this.otp = otp;
  }
}
