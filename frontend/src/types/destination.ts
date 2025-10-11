export interface Destiny {
    id: Number;
    name: String;
    slug: String;
    display_order: Number;
    destiny_code: String;
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
    id: 30, // 🔁 alterado para não repetir
    name: "México",
    slug: "america-latina-inclui-mexico",
    display_order: 7,
    destiny_code: "GPR",
  },
  {
    id: 9,
    name: "Ásia",
    slug: "demais-destinos",
    display_order: 12,
    destiny_code: "GPR",
  },
  {
    id: 93, // 🔁 alterado
    name: "África",
    slug: "demais-destinos",
    display_order: 13,
    destiny_code: "GPR",
  },
  {
    id: 94, // 🔁 alterado
    name: "Oceania",
    slug: "demais-destinos",
    display_order: 14,
    destiny_code: "GPR",
  },
  // {
  //   id: 8,
  //   name: "Múltiplos destinos",
  //   slug: "2-ou-mais-destinos",
  //   display_order: 15,
  //   destiny_code: "GPR",
  // },
  // {
  //   id: 11,
  //   name: "Multiplos Destinos (Exceto Estados Unidos)",
  //   slug: "2-ou-mais-destinos-exceto-estados-unidos",
  //   display_order: 16,
  //   destiny_code: "GPR",
  // },
];
