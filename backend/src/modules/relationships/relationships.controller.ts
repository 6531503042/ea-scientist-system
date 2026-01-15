import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { RelationshipsService } from './relationships.service';
import { CreateRelationshipDto, UpdateRelationshipDto } from './dto';

@Controller('relationships')
export class RelationshipsController {
    constructor(private readonly relationshipsService: RelationshipsService) { }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(30000)
    findAll() {
        return this.relationshipsService.findAll();
    }

    @Get('graph')
    @UseInterceptors(CacheInterceptor)
    @CacheKey('graph-data')
    @CacheTTL(60000)
    getGraphData() {
        return this.relationshipsService.getGraphData();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.relationshipsService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateRelationshipDto) {
        return this.relationshipsService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRelationshipDto) {
        return this.relationshipsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.relationshipsService.remove(id);
    }
}
