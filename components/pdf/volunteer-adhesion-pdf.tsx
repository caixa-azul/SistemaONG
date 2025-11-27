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
        marginBottom: 15,
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
    signatureSection: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 10,
        textAlign: 'center',
    },
});

interface VolunteerAdhesionPDFProps {
    data: {
        fullName: string;
        cpf: string;
        rg: string;
        dateOfBirth: Date;
        phoneNumber: string;
        email?: string;
        joinDate: Date;
        address?: {
            street: string;
            number: string;
            neighborhood: string;
            city: string;
            state: string;
        };
    };
}

export const VolunteerAdhesionPDF: React.FC<VolunteerAdhesionPDFProps> = ({ data }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>TERMO DE ADESÃO - SERVIÇO VOLUNTÁRIO</Text>
                    <Text style={styles.subtitle}>Cadastro de Voluntário</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DADOS PESSOAIS</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nome Completo:</Text>
                        <Text style={styles.value}>{data.fullName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CPF:</Text>
                        <Text style={styles.value}>{data.cpf}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>RG:</Text>
                        <Text style={styles.value}>{data.rg}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data de Nascimento:</Text>
                        <Text style={styles.value}>{formatDate(data.dateOfBirth)}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CONTATO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Telefone:</Text>
                        <Text style={styles.value}>{data.phoneNumber}</Text>
                    </View>
                    {data.email && (
                        <View style={styles.row}>
                            <Text style={styles.label}>E-mail:</Text>
                            <Text style={styles.value}>{data.email}</Text>
                        </View>
                    )}
                </View>

                {data.address && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ENDEREÇO</Text>
                        <View style={styles.row}>
                            <Text style={styles.value}>
                                {data.address.street}, {data.address.number} - {data.address.neighborhood}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.value}>
                                {data.address.city}/{data.address.state}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DATA DE ADESÃO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Início das Atividades:</Text>
                        <Text style={styles.value}>{formatDate(data.joinDate)}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>COMPROMISSO</Text>
                    <Text>
                        Eu, {data.fullName}, declaro estar ciente de que o serviço voluntário não gera vínculo
                        empregatício, nem obrigação de natureza trabalhista, previdenciária ou afim,
                        sendo realizado por livre e espontânea vontade.
                    </Text>
                    <Text style={{ marginTop: 10 }}>
                        Comprometo-me a atuar com responsabilidade, respeito e dedicação nas atividades
                        designadas pela organização.
                    </Text>
                </View>

                <View style={styles.signatureSection}>
                    <Text>__________________________________________</Text>
                    <Text style={{ marginTop: 5 }}>Assinatura do Voluntário</Text>
                </View>

                <View style={styles.footer}>
                    <Text>Data de emissão: {formatDate(new Date())}</Text>
                    <Text>Documento gerado automaticamente pelo Sistema de Gestão da ONG</Text>
                </View>
            </Page>
        </Document>
    );
};
