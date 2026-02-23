import { DepartmentsRepository } from "@/lib/repositories/departments/departments-repository";
import type {
    CreateDepartmentInput,
    UpdateDepartmentInput,
} from "@/lib/validators/departments-validator";
import { NotFoundError } from "@/lib/utils/api-error";

/**
 * Service for Department business logic
 */
export class DepartmentsService {
    private repository: DepartmentsRepository;

    constructor() {
        this.repository = new DepartmentsRepository();
    }

    async getAll() {
        return this.repository.findAll();
    }

    async getById(id: number) {
        const dept = await this.repository.findById(id);
        if (!dept) throw new NotFoundError("ไม่พบหน่วยงาน");
        return dept;
    }

    async getHierarchy() {
        return this.repository.findHierarchy();
    }

    async create(data: CreateDepartmentInput) {
        return this.repository.create({
            shortName: data.shortName,
            fullName: data.fullName,
            isActive: data.isActive ?? true,
            ...(data.parentId && {
                parent: { connect: { id: data.parentId } },
            }),
        });
    }

    async update(id: number, data: UpdateDepartmentInput) {
        const dept = await this.repository.findById(id);
        if (!dept) throw new NotFoundError("ไม่พบหน่วยงาน");

        return this.repository.update(id, {
            ...(data.shortName && { shortName: data.shortName }),
            ...(data.fullName && { fullName: data.fullName }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
            ...(data.parentId !== undefined && {
                parent: data.parentId
                    ? { connect: { id: data.parentId } }
                    : { disconnect: true },
            }),
        });
    }

    async delete(id: number) {
        const dept = await this.repository.findById(id);
        if (!dept) throw new NotFoundError("ไม่พบหน่วยงาน");
        return this.repository.delete(id);
    }
}
