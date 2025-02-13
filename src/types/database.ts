import { RowDataPacket } from 'mysql2';

export interface UserRecord extends RowDataPacket {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}