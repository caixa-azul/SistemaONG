import { BeneficiaryForm } from "@/components/forms/beneficiary-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateBeneficiaryPage() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Beneficiary</CardTitle>
                </CardHeader>
                <CardContent>
                    <BeneficiaryForm />
                </CardContent>
            </Card>
        </div>
    );
}
