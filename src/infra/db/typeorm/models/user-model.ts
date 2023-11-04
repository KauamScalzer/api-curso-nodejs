import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({
    type: 'text',
    name: 'access_token',
    nullable: true
    })
  accessToken: string
}
