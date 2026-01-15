import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Relationship, RelationshipSchema } from '../../schemas/relationship.schema';
import { Artefact, ArtefactSchema } from '../../schemas/artefact.schema';
import { RelationshipsController } from './relationships.controller';
import { RelationshipsService } from './relationships.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Relationship.name, schema: RelationshipSchema },
            { name: Artefact.name, schema: ArtefactSchema },
        ]),
    ],
    controllers: [RelationshipsController],
    providers: [RelationshipsService],
    exports: [RelationshipsService],
})
export class RelationshipsModule { }
