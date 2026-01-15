import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artefact, ArtefactSchema } from '../../schemas/artefact.schema';
import { ArtefactsController } from './artefacts.controller';
import { ArtefactsService } from './artefacts.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Artefact.name, schema: ArtefactSchema }]),
    ],
    controllers: [ArtefactsController],
    providers: [ArtefactsService],
    exports: [ArtefactsService],
})
export class ArtefactsModule { }
