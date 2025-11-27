# 🗄️ Diagrama do Banco de Dados (ERD)

Este diagrama mostra visualmente como as tabelas do nosso banco de dados se relacionam. Ele é gerado automaticamente a partir do arquivo `prisma/schema.prisma`.

```mermaid
erDiagram
    User ||--o{ Donation : "registra"
    User ||--o{ FamilyDistribution : "cria"
    User ||--o{ InstitutionalDistribution : "cria"

    Beneficiary ||--o| Address : "mora em"
    Beneficiary ||--o| SocialAssessment : "tem"
    Beneficiary ||--o| ImageAuthorization : "autoriza"
    Beneficiary ||--o{ NutritionistReferral : "recebe"
    Beneficiary ||--o{ FamilyDistribution : "recebe"

    SocialAssessment ||--o{ FamilyMember : "possui"

    Institution ||--o| Address : "localizada em"
    Institution ||--o{ InstitutionalDistribution : "recebe"

    InstitutionalDistribution ||--o{ DistributionItem : "contém"

    Volunteer ||--o| Address : "mora em"

    Donation ||--o| FinancialLedger : "gera"
    Donation ||--o| Inventory : "atualiza"

    %% Definições das Tabelas Principais

    User {
        String id PK
        String email
        String role
    }

    Beneficiary {
        String id PK
        String fullName
        String cpf
        String addressId FK
    }

    Address {
        String id PK
        String street
        String city
        String state
    }

    SocialAssessment {
        String id PK
        String beneficiaryId FK
        Int householdSize
        String familyIncome
    }

    FamilyMember {
        String id PK
        String socialAssessmentId FK
        String name
        String relationship
    }

    ImageAuthorization {
        String id PK
        String beneficiaryId FK
        Boolean commercialUse
    }

    NutritionistReferral {
        String id PK
        String beneficiaryId FK
        String specialty
    }

    FamilyDistribution {
        String id PK
        String beneficiaryId FK
        String distributionType
        DateTime deliveryDate
    }

    Institution {
        String id PK
        String name
        String cnpj
        String addressId FK
    }

    InstitutionalDistribution {
        String id PK
        String institutionId FK
        DateTime deliveryDate
    }

    DistributionItem {
        String id PK
        String distributionId FK
        String itemName
        String quantity
    }

    Volunteer {
        String id PK
        String fullName
        String cpf
        String addressId FK
    }

    Donation {
        String id PK
        String type
        Decimal amount
    }

    Inventory {
        String id PK
        String itemName
        Float quantity
    }

    FinancialLedger {
        String id PK
        Decimal amount
        Decimal balanceAfter
    }
```

## 📝 Legenda

- **PK**: Primary Key (Chave Primária) - O ID único do registro.
- **FK**: Foreign Key (Chave Estrangeira) - O link para outra tabela.
- **||--o{**: Um para Muitos (Ex: Um Usuário registra Várias Doações).
- **||--o|**: Um para Um (Ex: Um Beneficiário tem Um Endereço).
