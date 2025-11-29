import { getVolunteerById } from "@/actions/volunteers";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { notFound } from "next/navigation";

export default async function EditVolunteerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getVolunteerById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Voluntário</h1>
                <p className="text-muted-foreground">
                    Atualize os dados do voluntário e gere um novo termo de adesão se necessário.
                </p>
            </div>
            <VolunteerForm initialData={result.data} />
        </div>
    );
}
