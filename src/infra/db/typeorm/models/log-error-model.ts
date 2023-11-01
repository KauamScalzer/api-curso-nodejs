import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity('log_error')
export class LogError extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  error: string

  @Column({
    type: 'datetime',
    })
  date: Date
}
