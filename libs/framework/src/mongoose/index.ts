import { Types } from 'mongoose';

export type Lean<T> = { _id: Types.ObjectId; __v: number } & T;
