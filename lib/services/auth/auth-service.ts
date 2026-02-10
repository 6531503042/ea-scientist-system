import { UsersRepository } from "@/lib/repositories/users/users-repository";

/**
 * Service for Authentication business logic
 */
export class AuthService {
    private usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository();
    }

    /**
     * Authenticate user by email and password
     */
    async login(email: string, password: string) {
        const user = await this.usersRepository.findByEmail(email);

        if (!user || !user.isActive) {
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }

        // TODO: Replace with bcrypt comparison when bcrypt is installed
        // const isValid = await bcrypt.compare(password, user.password);
        const isValid = password === user.password; // Temporary plain-text check
        if (!isValid) {
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }

        // Update last login time
        await this.usersRepository.update(user.id, { lastLoginAt: new Date() });

        // Extract permissions
        const permissions = user.role.rolePermissions?.map(
            (rp) => rp.permission.name
        ) || [];

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roleId: user.roleId,
            role: {
                id: user.role.id,
                roleName: user.role.roleName,
                description: user.role.description,
            },
            departmentId: user.departmentId,
            department: user.department
                ? {
                    id: user.department.id,
                    shortName: user.department.shortName,
                    fullName: user.department.fullName,
                }
                : null,
            permissions,
        };
    }

    /**
     * Change user password
     */
    async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new Error("ไม่พบผู้ใช้");
        }

        // TODO: bcrypt compare
        const isValid = currentPassword === user.password;
        if (!isValid) {
            throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
        }

        // TODO: bcrypt hash
        await this.usersRepository.update(userId, {
            password: newPassword,
            passwordChangedAt: new Date(),
        });

        return { success: true };
    }
}
