import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        fontWeight: 'bold',
        width: '40%',
    },
    value: {
        width: '60%',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
    },
});

interface NutritionistReferralPDFProps {
    data: {
        beneficiary: {
            fullName: string;
            cpf: string;
        };
        specialty: string;
        indication?: string;
        weight?: number;
        height?: number;
        observations?: string;
        referredBy: string;
        referrerRole: string;
        referralDate: Date;
    };
}

export const NutritionistReferralPDF: React.FC<NutritionistReferralPDFProps> = ({ data }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const calculateBMI = () => {
        if (data.weight && data.height) {
            const bmi = data.weight / (data.height * data.height);
            return bmi.toFixed(2);
        }
        return null;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>ENCAMINHAMENTO PROFISSIONAL</Text>
                    <Text style={styles.subtitle}>Serviço de Apoio Social</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DADOS DO BENEFICIÁRIO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.value}>{data.beneficiary.fullName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CPF:</Text>
                        <Text style={styles.value}>{data.beneficiary.cpf}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ENCAMINHAMENTO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Especialidade:</Text>
                        <Text style={styles.value}>{data.specialty}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data do Encaminhamento:</Text>
                        <Text style={styles.value}>{formatDate(data.referralDate)}</Text>
                    </View>
                </View>

                {data.specialty === 'NUTRICIONISTA' && (data.weight || data.height) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DADOS ANTROPOMÉTRICOS</Text>
                        {data.weight && (
                            <View style={styles.row}>
                                <Text style={styles.label}>Peso:</Text>
                                <Text style={styles.value}>{data.weight} kg</Text>
                            </View>
                        )}
                        {data.height && (
                            <View style={styles.row}>
                                <Text style={styles.label}>Altura:</Text>
                                <Text style={styles.value}>{data.height} m</Text>
                            </View>
                        )}
                        {calculateBMI() && (
                            <View style={styles.row}>
                                <Text style={styles.label}>IMC:</Text>
                                <Text style={styles.value}>{calculateBMI()}</Text>
                            </View>
                        )}
                    </View>
                )}

                {data.indication && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>INDICAÇÃO CLÍNICA</Text>
                        <Text>{data.indication}</Text>
                    </View>
                )}

                {data.observations && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>OBSERVAÇÕES</Text>
                        <Text>{data.observations}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>RESPONSÁVEL PELO ENCAMINHAMENTO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.value}>{data.referredBy}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Cargo:</Text>
                        <Text style={styles.value}>{data.referrerRole}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>Data de emissão: {formatDate(data.referralDate)}</Text>
                    <Text>Documento gerado automaticamente pelo Sistema de Gestão da ONG</Text>
                </View>
            </Page>
        </Document>
    );
};
