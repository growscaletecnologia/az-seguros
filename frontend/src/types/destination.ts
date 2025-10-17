export interface Destiny {
    id: number;
    name: string;
    slug: string;
    display_order: number;
    destiny_code: string;
}

export const DESTINIES: Destiny[] = [
    {
        id: 1,
        name: "Brasil",
        slug: "brasil",
        display_order: 1,
        destiny_code: "GPR",
    },
    {
        id: 4,
        name: "América do Norte",
        slug: "estados-unidos-e-canada",
        display_order: 3,
        destiny_code: "USA",
    },
    {
        id: 3,
        name: "Europa",
        slug: "europa",
        display_order: 6,
        destiny_code: "EUR",
    },
    {
        id: 29,
        name: "América do Sul",
        slug: "america-latina-inclui-mexico",
        display_order: 7,
        destiny_code: "GPR",
    },
    {
        // ID Corrigido
        id: 30, 
        name: "México",
        slug: "mexico", 
        display_order: 8, 
        destiny_code: "GPR",
    },
    {
        id: 9,
        name: "Ásia",
        slug: "demais-destinos-asia", 
        display_order: 12,
        destiny_code: "GPR",
    },
    {
        // ID Corrigido
        id: 10,
        name: "África",
        slug: "demais-destinos-africa", 
        display_order: 13,
        destiny_code: "GPR",
    },
    {
        // ID Corrigido
        id: 11,
        name: "Oceania",
        slug: "demais-destinos-oceania", 
        display_order: 14,
        destiny_code: "GPR",
    },
];
