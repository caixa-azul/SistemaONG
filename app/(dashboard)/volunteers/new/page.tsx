import { VolunteerForm } from "@/components/forms/volunteer-form";

export default function NewVolunteerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Novo Voluntário</h1>
                <p className="text-muted-foreground">
                    Cadastrar novo voluntário para serviço comunitário
                </p>
            </div>

            <VolunteerForm />
        </div>
    );
}
