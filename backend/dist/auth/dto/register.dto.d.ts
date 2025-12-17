import { Gender } from '../../users/entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    gender?: Gender;
    dateOfBirth?: string;
    playingHand?: 'right' | 'left' | 'ambidextrous';
    playingStyle?: 'defensive' | 'offensive' | 'all_around';
}
