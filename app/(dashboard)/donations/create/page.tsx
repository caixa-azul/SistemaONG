import { DonationForm } from "@/components/forms/donation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateDonationPage() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Record New Donation</CardTitle>
                </CardHeader>
                <CardContent>
                    <DonationForm />
                </CardContent>
            </Card>
        </div>
    );
}
