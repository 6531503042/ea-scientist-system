import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async findAll() {
        return this.userModel.find().sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string) {
        const user = await this.userModel.findById(id).exec();

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }



    async create(dto: CreateUserDto) {
        const existing = await this.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException(`User with email ${dto.email} already exists`);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = new this.userModel({
            ...dto,
            password: hashedPassword,
        });
        const saved = await user.save();

        this.logger.log(`Created user: ${saved._id}`);
        // Return object without password
        const { password, ...result } = saved.toObject();
        return result;
    }

    async update(id: string, dto: UpdateUserDto) {
        if (dto.email) {
            const existing = await this.findByEmail(dto.email);
            if (existing && existing._id.toString() !== id) {
                throw new ConflictException(`User with email ${dto.email} already exists`);
            }
        }

        const user = await this.userModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        this.logger.log(`Updated user: ${id}`);
        return user;
    }

    async remove(id: string) {
        const result = await this.userModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        this.logger.log(`Deleted user: ${id}`);
        return { deleted: true, id };
    }
}
