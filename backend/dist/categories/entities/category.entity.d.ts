import { Association } from '../../associations/entities/association.entity';
export declare enum CategoryLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    PROFESSIONAL = "professional"
}
export declare class Category {
    id: string;
    name: string;
    level: CategoryLevel;
    minPoints: number;
    maxPoints: number;
    description: string | null;
    isActive: boolean;
    associationId: string | null;
    association: Association | null;
    tournaments: any[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Category>);
}
