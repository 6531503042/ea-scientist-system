import { IsString, IsEnum } from 'class-validator';

export enum RelationshipType {
    SUPPORTS = 'supports',
    USES = 'uses',
    DEPENDS_ON = 'depends_on',
    MANAGES = 'manages',
    INTEGRATES_WITH = 'integrates_with',
}

export class CreateRelationshipDto {
    @IsString()
    sourceId: string;

    @IsString()
    targetId: string;

    @IsEnum(RelationshipType)
    type: RelationshipType;

    @IsString()
    label: string;
}
