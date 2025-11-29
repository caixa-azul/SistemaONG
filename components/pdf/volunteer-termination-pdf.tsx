import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Register fonts
Font.register({
    family: "Roboto",
    fonts: [
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Roboto",
        fontSize: 12,
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
        textAlign: "center",
        borderBottom: "1px solid #000",
        paddingBottom: 10,
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 10,
        alignSelf: "center",
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        textTransform: "uppercase",
    },
    text: {
        marginBottom: 10,
        textAlign: "justify",
    },
    bold: {
        fontWeight: "bold",
    },
    signatureSection: {
        marginTop: 50,
        alignItems: "center",
    },
    signatureLine: {
        width: 300,
        borderBottom: "1px solid #000",
        marginBottom: 5,
    },
    signatureText: {
        fontSize: 10,
        textAlign: "center",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 8,
        color: "#666",
        borderTop: "1px solid #ccc",
        paddingTop: 10,
    },
});

interface VolunteerTerminationPDFProps {
    data: {
        fullName: string;
        cpf: string;
        rg: string;
        address?: {
            street: string;
            number: string;
            neighborhood: string;
            city: string;
            state: string;
        };
        terminationDate: Date;
    };
}

export const VolunteerTerminationPDF: React.FC<VolunteerTerminationPDFProps> = ({ data }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("pt-BR");
    };

    const getFullAddress = () => {
        if (!data.address) return "Endereço não informado";
        return `${data.address.street}, ${data.address.number} - ${data.address.neighborhood}, ${data.address.city}/${data.address.state}`;
    };

    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString("pt-BR", { month: "long" });
    const year = today.getFullYear();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>PROJETO ALÉM DOS OLHOS</Text>
                    <Text style={{ fontSize: 10 }}>CNPJ: 00.000.000/0000-00</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>
                    TERMO DE ENCERRAMENTO DE ATIVIDADES POR DECISÃO DO VOLUNTÁRIO
                </Text>

                {/* Content */}
                <Text style={styles.text}>
                    Eu, <Text style={styles.bold}>{data.fullName}</Text>, portador(a) do documento de identidade RG <Text style={styles.bold}>{data.rg}</Text> e CPF nº <Text style={styles.bold}>{data.cpf}</Text>, residente e domiciliado(a) à <Text style={styles.bold}>{getFullAddress()}</Text>, venho, por meio deste, comunicar formalmente minha decisão de encerrar minha atividade voluntária no Projeto Além dos Olhos, a partir desta data: <Text style={styles.bold}>{formatDate(data.terminationDate)}</Text>.
                </Text>

                <Text style={styles.text}>
                    Esta decisão é tomada por livre e espontânea vontade, conforme prevê o inciso I do artigo 28 do Estatuto Social do Projeto Além dos Olhos.
                </Text>

                <Text style={styles.text}>
                    Agradeço pela oportunidade de ter contribuído com o projeto e pela experiência adquirida durante o período em que atuei como voluntário(a).
                </Text>

                <Text style={{ marginTop: 30, textAlign: "right" }}>
                    São José (SC), {day} de {month} de {year}
                </Text>

                {/* Signature */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureText}>{data.fullName}</Text>
                    <Text style={styles.signatureText}>Voluntário(a)</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Projeto Além dos Olhos - Transformando vidas através da solidariedade</Text>
                </View>
            </Page>
        </Document>
    );
};
