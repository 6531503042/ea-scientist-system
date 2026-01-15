import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from '../../schemas/setting.schema';
import { CreateSettingDto, UpdateSettingDto } from './dto';

@Injectable()
export class SettingsService {
    private readonly logger = new Logger(SettingsService.name);

    constructor(
        @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    ) { }

    async findAll() {
        const settings = await this.settingModel
            .find()
            .sort({ category: 1, key: 1 })
            .exec();

        // Group by category
        const grouped = settings.reduce(
            (acc, setting) => {
                const cat = setting.category;
                if (!acc[cat]) {
                    acc[cat] = [];
                }
                acc[cat].push(setting);
                return acc;
            },
            {} as Record<string, typeof settings>,
        );

        return grouped;
    }

    async findByKey(key: string) {
        const setting = await this.settingModel.findOne({ key }).exec();

        if (!setting) {
            throw new NotFoundException(`Setting with key "${key}" not found`);
        }

        return setting;
    }

    async findByCategory(category: string) {
        return this.settingModel
            .find({ category })
            .sort({ key: 1 })
            .exec();
    }

    async upsert(dto: CreateSettingDto) {
        const setting = await this.settingModel
            .findOneAndUpdate(
                { key: dto.key },
                { value: dto.value, category: dto.category },
                { upsert: true, new: true },
            )
            .exec();

        this.logger.log(`Upserted setting: ${dto.key}`);
        return setting;
    }

    async update(key: string, dto: UpdateSettingDto) {
        const setting = await this.settingModel
            .findOneAndUpdate({ key }, dto, { new: true })
            .exec();

        if (!setting) {
            throw new NotFoundException(`Setting with key "${key}" not found`);
        }

        this.logger.log(`Updated setting: ${key}`);
        return setting;
    }

    async remove(key: string) {
        const result = await this.settingModel.findOneAndDelete({ key }).exec();

        if (!result) {
            throw new NotFoundException(`Setting with key "${key}" not found`);
        }

        this.logger.log(`Deleted setting: ${key}`);
        return { deleted: true, key };
    }

    async bulkUpdate(settings: CreateSettingDto[]) {
        const results = await Promise.all(
            settings.map((dto) => this.upsert(dto)),
        );

        this.logger.log(`Bulk updated ${results.length} settings`);
        return results;
    }
}
