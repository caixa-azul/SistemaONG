import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a font that supports bold/italic if needed, or use standard ones.
// Por simplicidade, usaremos Helvetica padrão.

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    preamble: {
        marginBottom: 15,
        textAlign: 'justify',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
        textTransform: 'uppercase',
        backgroundColor: '#f0f0f0',
        padding: 3,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    label: {
        fontWeight: 'bold',
        width: '30%',
    },
    value: {
        width: '70%',
    },
    clauseTitle: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    clauseText: {
        textAlign: 'justify',
        marginBottom: 5,
    },
    signatureSection: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBlock: {
        width: '45%',
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 5,
    },
    dateLine: {
        marginTop: 30,
        textAlign: 'center',
        marginBottom: 20,
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
            zipCode?: string;
        };
    };
}

export const VolunteerAdhesionPDF: React.FC<VolunteerAdhesionPDFProps> = ({ data }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getDay = () => new Date().getDate();
    const getMonth = () => new Date().toLocaleString('pt-BR', { month: 'long' });
    const getYear = () => new Date().getFullYear();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>TERMO DE ADESÃO AO SERVIÇO VOLUNTÁRIO – ASSOCIADO CONTRIBUINTE</Text>
                </View>

                {/* Preamble */}
                <Text style={styles.preamble}>
                    Este Termo de Adesão é regido pelo disposto em seus artigos, pelo art. 11 de seu Estatuto Social e de acordo com a Lei Federal nº 9.608, de 18 de fevereiro de 1998, que dispõe sobre o serviço voluntário.
                </Text>

                {/* Volunteer Data */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DADOS DO VOLUNTÁRIO</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Nome do Voluntário:</Text>
                        <Text style={styles.value}>{data.fullName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data de Nascimento:</Text>
                        <Text style={styles.value}>{formatDate(data.dateOfBirth)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CPF:</Text>
                        <Text style={styles.value}>{data.cpf}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>RG:</Text>
                        <Text style={styles.value}>{data.rg}</Text>
                    </View>

                    {data.address && (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>Endereço:</Text>
                                <Text style={styles.value}>{data.address.street}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Nº:</Text>
                                <Text style={styles.value}>{data.address.number}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Bairro:</Text>
                                <Text style={styles.value}>{data.address.neighborhood}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Cidade:</Text>
                                <Text style={styles.value}>{data.address.city} - {data.address.state}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>CEP:</Text>
                                <Text style={styles.value}>{data.address.zipCode || '__________'}</Text>
                            </View>
                        </>
                    )}

                    <View style={styles.row}>
                        <Text style={styles.label}>Celular/WhatsApp:</Text>
                        <Text style={styles.value}>{data.phoneNumber}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>E-mail:</Text>
                        <Text style={styles.value}>{data.email || '______________________________________'}</Text>
                    </View>
                </View>

                {/* Clauses */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cláusulas</Text>

                    <Text style={styles.clauseText}>
                        <Text style={styles.clauseTitle}>Art. 1º</Text> Considera-se objeto do presente Termo de Adesão o trabalho voluntário, a ser desempenhado no âmbito do Projeto Social Além dos Olhos a fim de atender seus objetivos.
                    </Text>

                    <Text style={styles.clauseText}>
                        <Text style={styles.clauseTitle}>Art. 2º</Text> O trabalho voluntário de que trata este termo é atividade não remunerada, prestada por pessoa física às atividades e ações do Projeto Além dos Olhos.
                    </Text>

                    <Text style={styles.clauseText}>
                        <Text style={styles.clauseTitle}>Art. 3º</Text> O voluntário prestará atividades não remuneradas, sem geração de vínculo empregatício, nem obrigações de natureza trabalhista, previdenciária e afins.
                    </Text>

                    <Text style={styles.clauseText}>
                        <Text style={styles.clauseTitle}>Art. 4º</Text> Eventuais despesas do voluntário para atendimento aos objetivos do Projeto Social Além dos Olhos poderão ser ressarcidas, mediante comprovação de tais gastos, desde que previamente e expressamente autorizadas pelo(a) presidente da instituição beneficiária ou por quem for legalmente constituído.
                    </Text>

                    <Text style={styles.clauseText}>
                        <Text style={styles.clauseTitle}>Art. 5º</Text> O voluntário declara que possui condições necessárias ao desempenho dos serviços e que, no caso de causar danos a terceiros por dolo ou culpa, poderá ser responsabilizado pelos prejuízos.
                    </Text>

                    <Text style={styles.clauseText}>
                        <Text style={styles.clauseTitle}>Art. 6º</Text> O trabalho voluntário objeto deste termo não tem caráter sistemático e será desempenhado sob a forma de ações eventuais, conforme necessidades do Projeto Além dos Olhos.
                    </Text>

                    <Text style={styles.clauseText}>
                        <Text style={styles.clauseTitle}>Art. 7º</Text> O voluntário declara estar ciente e de acordo com este Termo de Adesão e com as disposições da Lei Federal nº 9.608/1998.
                    </Text>

                    <Text style={styles.clauseText}>
                        <Text style={styles.clauseTitle}>Art. 8º</Text> Este Termo de Adesão poderá ser encerrado a qualquer tempo, pelo(a) voluntário(a) mediante preenchimento de Termo de Encerramento de Atividades, ou por decisão do presidente do Projeto Além dos Olhos, mediante o mesmo procedimento.
                    </Text>
                </View>

                {/* Data e Assinaturas */}
                <View style={styles.dateLine}>
                    <Text>São José (SC), {getDay()} de {getMonth()} de {getYear()}.</Text>
                </View>

                <View style={styles.signatureSection}>
                    <View style={styles.signatureBlock}>
                        <Text>{data.fullName}</Text>
                        <Text style={{ fontSize: 8, color: '#666' }}>Voluntário</Text>
                    </View>
                    <View style={styles.signatureBlock}>
                        <Text>Presidente do Projeto</Text>
                        <Text style={{ fontSize: 8, color: '#666' }}>Projeto Além dos Olhos</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
