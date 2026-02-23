import { RelationshipsRepository } from "@/lib/repositories/relationships/relationships-repository";
import type {
    CreateRelationshipInput,
    UpdateRelationshipInput,
} from "@/lib/validators/relationships-validator";
import { NotFoundError, BadRequestError } from "@/lib/utils/api-error";

/**
 * Service for Relationship business logic
 */
export class RelationshipsService {
    private repository: RelationshipsRepository;

    constructor() {
        this.repository = new RelationshipsRepository();
    }

    async getAll() {
        return this.repository.findAll();
    }

    async getById(id: number) {
        const rel = await this.repository.findById(id);
        if (!rel) throw new NotFoundError("ไม่พบ Relationship");
        return rel;
    }

    async getByArtefact(artefactId: number) {
        return this.repository.findByArtefact(artefactId);
    }

    /**
     * Get upstream + downstream artefacts for impact analysis
     */
    async getImpactAnalysis(artefactId: number) {
        const relationships = await this.repository.findByArtefact(artefactId);

        const upstream = relationships
            .filter((r) => r.targetArtefactId === artefactId)
            .map((r) => ({
                relationship: r,
                artefact: r.sourceArtefact,
                direction: "upstream" as const,
            }));

        const downstream = relationships
            .filter((r) => r.sourceArtefactId === artefactId)
            .map((r) => ({
                relationship: r,
                artefact: r.targetArtefact,
                direction: "downstream" as const,
            }));

        return { upstream, downstream, total: upstream.length + downstream.length };
    }

    async create(data: CreateRelationshipInput) {
        // Prevent self-referencing
        if (data.sourceArtefactId === data.targetArtefactId) {
            throw new BadRequestError("ไม่สามารถสร้างความสัมพันธ์กับตัวเองได้");
        }

        return this.repository.create({
            sourceArtefact: { connect: { id: data.sourceArtefactId } },
            targetArtefact: { connect: { id: data.targetArtefactId } },
            ...(data.relationshipTypeId && {
                relationshipType: { connect: { id: data.relationshipTypeId } },
            }),
            ...(data.description && { description: data.description }),
        });
    }

    async update(id: number, data: UpdateRelationshipInput) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("ไม่พบ Relationship");

        return this.repository.update(id, {
            ...(data.sourceArtefactId && {
                sourceArtefact: { connect: { id: data.sourceArtefactId } },
            }),
            ...(data.targetArtefactId && {
                targetArtefact: { connect: { id: data.targetArtefactId } },
            }),
            ...(data.relationshipTypeId && {
                relationshipType: { connect: { id: data.relationshipTypeId } },
            }),
            ...(data.description !== undefined && { description: data.description }),
        });
    }

    async delete(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("ไม่พบ Relationship");
        return this.repository.delete(id);
    }
}
