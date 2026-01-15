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
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { SettingsService } from './settings.service';
import { CreateSettingDto, UpdateSettingDto } from './dto';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300000) // 5 minutes - settings rarely change
    findAll() {
        return this.settingsService.findAll();
    }

    @Get('category/:category')
    findByCategory(@Param('category') category: string) {
        return this.settingsService.findByCategory(category);
    }

    @Get(':key')
    findByKey(@Param('key') key: string) {
        return this.settingsService.findByKey(key);
    }

    @Post()
    upsert(@Body() dto: CreateSettingDto) {
        return this.settingsService.upsert(dto);
    }

    @Post('bulk')
    bulkUpdate(@Body() settings: CreateSettingDto[]) {
        return this.settingsService.bulkUpdate(settings);
    }

    @Patch(':key')
    update(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
        return this.settingsService.update(key, dto);
    }

    @Delete(':key')
    remove(@Param('key') key: string) {
        return this.settingsService.remove(key);
    }
}
