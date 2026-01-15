import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseInterceptors,
    Inject,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ArtefactsService } from './artefacts.service';
import { CreateArtefactDto, UpdateArtefactDto, FindArtefactsDto } from './dto';

@Controller('artefacts')
export class ArtefactsController {
    constructor(
        private readonly artefactsService: ArtefactsService,
        @Inject(CACHE_MANAGER) private cacheManager: any,
    ) { }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(30000) // 30 seconds
    findAll(@Query() query: FindArtefactsDto) {
        return this.artefactsService.findAll(query);
    }

    @Get('stats')
    @UseInterceptors(CacheInterceptor)
    @CacheKey('artefacts-stats')
    @CacheTTL(60000) // 60 seconds
    getStats() {
        return this.artefactsService.getStats();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.artefactsService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateArtefactDto) {
        const result = await this.artefactsService.create(dto);
        await this.invalidateCache();
        return result;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateArtefactDto) {
        const result = await this.artefactsService.update(id, dto);
        await this.invalidateCache();
        return result;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const result = await this.artefactsService.remove(id);
        await this.invalidateCache();
        return result;
    }

    private async invalidateCache() {
        await this.cacheManager.del('artefacts-stats');
    }
}
