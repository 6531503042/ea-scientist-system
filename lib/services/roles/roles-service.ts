import { RolesRepository } from "@/lib/repositories/roles/roles-repository";
import type { CreateRoleInput, UpdateRoleInput } from "@/lib/validators/roles-validator";
import { NotFoundError, BadRequestError } from "@/lib/utils/api-error";

/**
 * Service for Role business logic
 */
export class RolesService {
    private repository: RolesRepository;

    constructor() {
        this.repository = new RolesRepository();
    }

    async getAll() {
        const roles = await this.repository.findAll();
        return roles.map((role) => ({
            id: role.id,
            roleName: role.roleName,
            description: role.description,
            isActive: role.isActive,
            userCount: role._count.users,
            permissions: role.rolePermissions.map((rp) => ({
                id: rp.permission.id,
                name: rp.permission.name,
            })),
        }));
    }

    async getById(id: number) {
        const role = await this.repository.findById(id);
        if (!role) throw new NotFoundError("ไม่พบบทบาท");
        return role;
    }

    async create(data: CreateRoleInput) {
        const existing = await this.repository.findByName(data.roleName);
        if (existing) throw new BadRequestError("ชื่อบทบาทนี้มีอยู่แล้ว", { field: "roleName" });

        const role = await this.repository.create({
            roleName: data.roleName,
            description: data.description || null,
            isActive: data.isActive ?? true,
        });

        // Set permissions if provided
        if (data.permissionIds && data.permissionIds.length > 0) {
            await this.repository.setPermissions(role.id, data.permissionIds);
        }

        return role;
    }

    async update(id: number, data: UpdateRoleInput) {
        const role = await this.repository.findById(id);
        if (!role) throw new NotFoundError("ไม่พบบทบาท");

        const updated = await this.repository.update(id, {
            ...(data.roleName && { roleName: data.roleName }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
        });

        // Update permissions if provided
        if (data.permissionIds) {
            await this.repository.setPermissions(id, data.permissionIds);
        }

        return updated;
    }

    async delete(id: number) {
        const role = await this.repository.findById(id);
        if (!role) throw new NotFoundError("ไม่พบบทบาท");
        return this.repository.delete(id);
    }
}
