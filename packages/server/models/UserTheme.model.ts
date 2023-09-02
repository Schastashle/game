import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript'

export enum ThemeNames {
  Dark = 'DARK',
  Light = 'LIGHT',
}

@Table({
  timestamps: false,
  paranoid: true,
  tableName: 'user_theme',
})
class UserTheme extends Model<UserTheme> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id!: number

  @AllowNull(false)
  @Column(DataType.STRING)
  app_theme_name: ThemeNames | undefined
}

export default UserTheme
