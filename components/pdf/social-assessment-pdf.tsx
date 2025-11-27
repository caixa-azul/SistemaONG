import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 11,
        color: '#666',
        marginBottom: 15,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        width: '40%',
    },
    value: {
        width: '60%',
    },
    table: {
        display: 'flex',
        width: '100%',
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        padding: 5,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tableCol: {
        width: '25%',
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

interface SocialAssessmentPDFProps {
    data: {
        beneficiary: {
            fullName: string;
            cpf: string;
            dateOfBirth: Date;
        };
        householdSize: number;
        housingType: string;
        housingCondition: string;
        familyIncome: string;
        healthAccess: string[];
        hasSanitation: boolean;
        hasWater: boolean;
        hasSewage: boolean;
        hasGarbageCollection: boolean;
        hasSchoolNearby: boolean;
        schoolName?: string;
        hasPublicTransport: boolean;
        socialPrograms: string[];
        familyMembers?: Array<{
            name: string;
            age: number;
            relationship: string;
            educationLevel?: string;
            isStudying: boolean;
            occupation?: string;
            isPCD: boolean;
        }>;
        consentDate: Date;
    };
}

export const SocialAssessmentPDF: React.FC<SocialAssessmentPDFProps> = ({ data }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>AVALIAÇÃO SOCIOECONÔMICA</Text>
                    <Text style={styles.subtitle}>Cadastro Social - ONG</Text>
                </View>

                {/* Beneficiary Info */}
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
                    <View style={styles.row}>
                        <Text style={styles.label}>Data de Nascimento:</Text>
                        <Text style={styles.value}>{formatDate(data.beneficiary.dateOfBirth)}</Text>
                    </View>
                </View>

                {/* Family Composition */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>COMPOSIÇÃO FAMILIAR</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Número de pessoas:</Text>
                        <Text style={styles.value}>{data.householdSize}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Renda familiar:</Text>
                        <Text style={styles.value}>{data.familyIncome}</Text>
                    </View>
                </View>

                {/* Family Members */}
                {data.familyMembers && data.familyMembers.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>MEMBROS DA FAMÍLIA</Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableCol}>Nome</Text>
                                <Text style={styles.tableCol}>Idade</Text>
                                <Text style={styles.tableCol}>Parentesco</Text>
                                <Text style={styles.tableCol}>Ocupação</Text>
                            </View>
                            {data.familyMembers.map((member, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCol}>{member.name}</Text>
                                    <Text style={styles.tableCol}>{member.age}</Text>
                                    <Text style={styles.tableCol}>{member.relationship}</Text>
                                    <Text style={styles.tableCol}>{member.occupation || '-'}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Housing */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>MORADIA</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tipo de moradia:</Text>
                        <Text style={styles.value}>{data.housingType}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Condição da moradia:</Text>
                        <Text style={styles.value}>{data.housingCondition}</Text>
                    </View>
                </View>

                {/* Infrastructure */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>INFRAESTRUTURA E SANEAMENTO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Água encanada:</Text>
                        <Text style={styles.value}>{data.hasWater ? 'Sim' : 'Não'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Esgoto:</Text>
                        <Text style={styles.value}>{data.hasSewage ? 'Sim' : 'Não'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Coleta de lixo:</Text>
                        <Text style={styles.value}>{data.hasGarbageCollection ? 'Sim' : 'Não'}</Text>
                    </View>
                </View>

                {/* Health Access */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACESSO À SAÚDE</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Formas de acesso:</Text>
                        <Text style={styles.value}>{data.healthAccess.join(', ')}</Text>
                    </View>
                </View>

                {/* Social Programs */}
                {data.socialPrograms.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PROGRAMAS SOCIAIS</Text>
                        <View style={styles.row}>
                            <Text style={styles.value}>{data.socialPrograms.join(', ')}</Text>
                        </View>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Data da avaliação: {formatDate(data.consentDate)}</Text>
                    <Text>Documento gerado automaticamente pelo Sistema de Gestão da ONG</Text>
                </View>
            </Page>
        </Document>
    );
};
