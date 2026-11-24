export type ShelfBox = [number, number, number, number];

export type ShelfDemo = {
  id: string;
  tab: string;
  photo: string;
  width: number;
  height: number;
  question: string;
  answer: string;
  reason: string;
  seconds: number;
  box: ShelfBox;
  lookalikes: { box: ShelfBox; name: string; whyNot: string }[];
};

export const shelfDemos: ShelfDemo[] = [
  {
    id: "torneira",
    tab: "Torneira de cotovelo",
    photo: "/demo/lm-08.webp",
    width: 1600,
    height: 1200,
    question: "Qual desses é a torneira de parede que abre com o cotovelo?",
    answer: "Torneira de parede com alavanca de cotovelo",
    reason: "Achei pela alavanca comprida e pela plaquinha “azionamento con gomito” na etiqueta.",
    seconds: 5.2,
    box: [565, 0, 903, 175],
    lookalikes: [
      {
        box: [499, 196, 788, 421],
        name: "Torneira de parede, bica longa",
        whyNot: "É de parede, mas abre com a mão, não com o cotovelo.",
      },
      {
        box: [365, 95, 497, 297],
        name: "Torneira de parede comum",
        whyNot: "Alavanca curta, não dá pra abrir com o cotovelo.",
      },
    ],
  },
  {
    id: "espelho",
    tab: "Fita pra espelho",
    photo: "/demo/colas.webp",
    width: 1600,
    height: 1300,
    question: "Qual desses é a fita dupla face própria pra colar espelho?",
    answer: "Fita de montagem tesa para espelhos",
    reason: "O rótulo diz “Spiegel / Mirrors”: é feita pra segurar o peso de espelho.",
    seconds: 7.7,
    box: [104, 893, 359, 1000],
    lookalikes: [
      {
        box: [390, 818, 650, 994],
        name: "Fita dupla face UHU removível",
        whyNot: "É de uso geral e removível: não aguenta espelho.",
      },
    ],
  },
  {
    id: "alicate",
    tab: "Alicate isolado",
    photo: "/demo/alicates.webp",
    width: 1200,
    height: 1600,
    question: "Qual desses é o alicate isolado pra mexer em fio com energia?",
    answer: "Alicate isolado VDE 1000 V",
    reason: "Cabo vermelho e amarelo com isolação VDE, o padrão pra trabalhar com fio energizado.",
    seconds: 8.8,
    box: [77, 917, 276, 998],
    lookalikes: [
      {
        box: [108, 381, 287, 461],
        name: "Alicate universal de cabo azul",
        whyNot: "O cabo é só emborrachado, não tem isolação pra fio com energia.",
      },
      {
        box: [391, 715, 620, 843],
        name: "Alicate bomba d’água isolado",
        whyNot: "É isolado, mas é regulável: não serve pra cortar e descascar fio.",
      },
    ],
  },
  {
    id: "oleo",
    tab: "Óleo 5W-30",
    photo: "/demo/oleo.webp",
    width: 1600,
    height: 1143,
    question: "Qual desses é o óleo 5W-30 da Castrol, galão de 5 litros?",
    answer: "Castrol Magnatec Stop-Start 5W-30, 5 L",
    reason: "Li a viscosidade 5W-30 e o tamanho de 5 L no rótulo do galão verde.",
    seconds: 11.2,
    box: [586, 689, 929, 878],
    lookalikes: [
      {
        box: [548, 568, 848, 715],
        name: "Liqui Moly Top Tec 4600 5W-30, 5 L",
        whyNot: "Mesma viscosidade e tamanho, mas não é Castrol.",
      },
      {
        box: [0, 882, 180, 992],
        name: "Castrol Magnatec 5W-30, 1 L",
        whyNot: "É o óleo certo, mas só 1 litro.",
      },
    ],
  },
];

export const photoCredits = [
  {
    label: "Torneiras na Leroy Merlin de Bastia Umbra",
    author: "Daniele Costantini",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Leroy_Merlin_Store_in_Bastia_Umbra_(interiors),_August_2019_(8).jpg",
  },
  {
    label: "Colas e fitas em loja de material",
    author: "Pittigrilli",
    license: "CC0",
    href: "https://commons.wikimedia.org/wiki/File:Variety_of_adhesive_products_for_different_purposes_from_different_brands_in_hardware_store_in_Munich,_Germany.jpg",
  },
  {
    label: "Alicates em loja de material",
    author: "Pittigrilli",
    license: "CC BY 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Various_types_of_pliers_on_display_in_German_hardware_store,_2023.jpg",
  },
  {
    label: "Óleos de motor em loja de material",
    author: "Pittigrilli",
    license: "CC0",
    href: "https://commons.wikimedia.org/wiki/File:Motor_oil_for_cars_and_motorcycles_from_various_producers_in_German_hardware_store.jpg",
  },
];
