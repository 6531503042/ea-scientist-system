import { UsersRepository } from "@/lib/repositories/users/users-repository";
import type { CreateUserInput, UpdateUserInput } from "@/lib/validators/users-validator";

/**
 * Service for User business logic
 */
export class UsersService {
    private repository: UsersRepository;

    constructor() {
        this.repository = new UsersRepository();
    }

    async getAll() {
        const users = await this.repository.findAll();

        return users.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            username: user.username,
            roleId: user.roleId,
            roleName: user.role.roleName,
            departmentId: user.departmentId,
            departmentName: user.department?.shortName || null,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        }));
    }

    async getById(id: number) {
        const user = await this.repository.findById(id);
        if (!user) throw new Error("ไม่พบผู้ใช้");
        return user;
    }

    async create(data: CreateUserInput) {
        // Check for duplicate email
        const existingEmail = await this.repository.findByEmail(data.email);
        if (existingEmail) throw new Error("อีเมลนี้ถูกใช้งานแล้ว");

        // Check for duplicate username
        const existingUsername = await this.repository.findByUsername(data.username);
        if (existingUsername) throw new Error("Username นี้ถูกใช้งานแล้ว");

        // TODO: Hash password with bcrypt
        return this.repository.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            username: data.username,
            password: data.password, // TODO: bcrypt hash
            role: { connect: { id: data.roleId } },
            ...(data.departmentId && {
                department: { connect: { id: data.departmentId } },
            }),
        });
    }

    async update(id: number, data: UpdateUserInput) {
        const user = await this.repository.findById(id);
        if (!user) throw new Error("ไม่พบผู้ใช้");

        return this.repository.update(id, {
            ...(data.firstName && { firstName: data.firstName }),
            ...(data.lastName && { lastName: data.lastName }),
            ...(data.email && { email: data.email }),
            ...(data.username && { username: data.username }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
            ...(data.roleId && { role: { connect: { id: data.roleId } } }),
            ...(data.departmentId !== undefined && {
                department: data.departmentId
                    ? { connect: { id: data.departmentId } }
                    : { disconnect: true },
            }),
        });
    }

    async delete(id: number) {
        const user = await this.repository.findById(id);
        if (!user) throw new Error("ไม่พบผู้ใช้");

        return this.repository.delete(id);
    }
}
