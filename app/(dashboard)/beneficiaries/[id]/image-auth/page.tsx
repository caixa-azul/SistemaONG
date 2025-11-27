import { ImageAuthorizationForm } from "@/components/forms/image-authorization-form";
import { getBeneficiaryById } from "@/actions/beneficiaries";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ImageAuthorizationPage({ params }: PageProps) {
    const result = await getBeneficiaryById(params.id);

    if (!result.success || !result.data) {
        redirect("/beneficiaries");
    }

    const beneficiary = result.data;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Autorização de Uso de Imagem</h1>
                <p className="text-muted-foreground">
                    Beneficiário: {beneficiary.fullName}
                </p>
            </div>

            <ImageAuthorizationForm
                beneficiaryId={params.id}
                beneficiaryCPF={beneficiary.cpf}
                beneficiaryRG={beneficiary.rg || ""}
            />
        </div>
    );
}
