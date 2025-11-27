import { VolunteerTerminationForm } from "@/components/forms/volunteer-termination-form";

export default function TerminateVolunteerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Encerrar Serviço Voluntário</h1>
                <p className="text-muted-foreground">
                    Registrar término de atividades de voluntário
                </p>
            </div>

            <VolunteerTerminationForm />
        </div>
    );
}
