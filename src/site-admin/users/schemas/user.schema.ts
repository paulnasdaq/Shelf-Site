import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  Admin = 'admin',
  Author = 'author'
}

interface UserProfile {
  firstName: string
  lastName: string
}

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop({
    type: String,
    enum: UserRole,
  })
  role: UserRole;
  @Prop(raw({
    firstName: String,
    lastName: String
  }))
  profile: UserProfile

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User).set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    ret.id = ret._id;
    delete ret._id;
  }
});

UserSchema.pre('save', async function(next) {
  let user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  // @ts-ignore
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(password: string) {
  // @ts-ignore
  return await bcrypt.compare(password, this.password!);
};
