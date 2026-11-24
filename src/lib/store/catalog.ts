export type Department =
  | "fixacao"
  | "eletrica"
  | "iluminacao"
  | "hidraulica"
  | "torneiras"
  | "revestimento"
  | "ferramentas"
  | "pintura"
  | "acessorios-pintura"
  | "ferramentas-eletricas";

export type Product = {
  id: string;
  name: string;
  department: Department;
  aisle: number;
  unit: string;
  details: string;
  price: number;
  stock: number;
  substituteId?: string;
};

export const departmentNames: Record<Department, string> = {
  fixacao: "Fixação",
  eletrica: "Elétrica",
  iluminacao: "Iluminação e chuveiros",
  hidraulica: "Hidráulica",
  torneiras: "Torneiras e registros",
  revestimento: "Revestimentos",
  ferramentas: "Ferramentas manuais",
  pintura: "Tintas",
  "acessorios-pintura": "Acessórios de pintura",
  "ferramentas-eletricas": "Ferramentas elétricas",
};

export const catalog: Product[] = [
  { id: "bucha-6", name: "Bucha de nylon 6 mm (50 un.)", department: "fixacao", aisle: 12, unit: "pacote", details: "Parede de alvenaria, cargas leves como quadro e prateleira pequena", price: 12.90, stock: 40 },
  { id: "bucha-8", name: "Bucha de nylon 8 mm (25 un.)", department: "fixacao", aisle: 12, unit: "pacote", details: "Parede de alvenaria, cargas médias como suporte de TV e armário", price: 14.90, stock: 32 },
  { id: "bucha-basculante", name: "Bucha basculante para drywall 10 mm (4 un.)", department: "fixacao", aisle: 12, unit: "pacote", details: "Parede de gesso (drywall), segura até 25 kg por bucha", price: 29.90, stock: 0, substituteId: "bucha-drywall-metal" },
  { id: "bucha-drywall-metal", name: "Bucha metálica para drywall (6 un.)", department: "fixacao", aisle: 12, unit: "pacote", details: "Parede de gesso (drywall), segura até 20 kg por bucha", price: 24.90, stock: 18 },
  { id: "parafuso-6", name: "Parafuso chipboard 4,0 x 40 mm (50 un.)", department: "fixacao", aisle: 12, unit: "pacote", details: "Combina com bucha 6 mm", price: 13.90, stock: 55 },
  { id: "parafuso-8", name: "Parafuso chipboard 5,0 x 50 mm (25 un.)", department: "fixacao", aisle: 12, unit: "pacote", details: "Combina com bucha 8 mm", price: 15.90, stock: 41 },
  { id: "suporte-tv-fixo", name: "Suporte fixo para TV 32 a 70 polegadas", department: "fixacao", aisle: 14, unit: "un.", details: "Até 40 kg, acompanha parafusos para a TV, buchas não inclusas", price: 89.90, stock: 9 },
  { id: "suporte-tv-articulado", name: "Suporte articulado para TV 32 a 55 polegadas", department: "fixacao", aisle: 14, unit: "un.", details: "Até 30 kg, braço que gira e inclina", price: 189.90, stock: 4 },
  { id: "mao-francesa", name: "Mão francesa 20 cm (par)", department: "fixacao", aisle: 14, unit: "par", details: "Prateleira de até 15 kg", price: 19.90, stock: 23 },
  { id: "prateleira-mdf", name: "Prateleira MDF branca 60 x 20 cm", department: "fixacao", aisle: 14, unit: "un.", details: "Para usar com mão francesa", price: 34.90, stock: 15 },

  { id: "tomada-10a", name: "Tomada 2P+T 10 A com placa", department: "eletrica", aisle: 33, unit: "un.", details: "Padrão brasileiro, aparelhos comuns", price: 14.90, stock: 60 },
  { id: "tomada-20a", name: "Tomada 2P+T 20 A com placa", department: "eletrica", aisle: 33, unit: "un.", details: "Para micro-ondas, air fryer e aparelhos fortes", price: 18.90, stock: 28 },
  { id: "interruptor-simples", name: "Interruptor simples com placa", department: "eletrica", aisle: 33, unit: "un.", details: "Uma tecla, 10 A", price: 12.90, stock: 45 },
  { id: "fita-isolante", name: "Fita isolante 19 mm x 10 m", department: "eletrica", aisle: 33, unit: "rolo", details: "Antichama, preta", price: 6.90, stock: 80 },
  { id: "fio-2-5", name: "Cabo flexível 2,5 mm² (rolo 15 m)", department: "eletrica", aisle: 33, unit: "rolo", details: "Tomadas de uso geral", price: 69.90, stock: 20 },
  { id: "fio-6", name: "Cabo flexível 6 mm² (rolo 15 m)", department: "eletrica", aisle: 33, unit: "rolo", details: "Chuveiro elétrico até 7.500 W", price: 189.90, stock: 7 },
  { id: "disjuntor-20", name: "Disjuntor unipolar 20 A", department: "eletrica", aisle: 33, unit: "un.", details: "Circuito de tomadas", price: 19.90, stock: 22 },
  { id: "disjuntor-40", name: "Disjuntor bipolar 40 A", department: "eletrica", aisle: 33, unit: "un.", details: "Circuito de chuveiro 220 V", price: 49.90, stock: 11 },
  { id: "testador-tensao", name: "Chave teste de tensão", department: "eletrica", aisle: 33, unit: "un.", details: "Confere se o fio está com energia antes de mexer", price: 14.90, stock: 35 },

  { id: "chuveiro-220", name: "Chuveiro elétrico 7.500 W 220 V", department: "iluminacao", aisle: 37, unit: "un.", details: "4 temperaturas", price: 99.90, stock: 6 },
  { id: "resistencia-220", name: "Resistência para chuveiro 7.500 W 220 V", department: "iluminacao", aisle: 37, unit: "un.", details: "Confira a marca e o modelo do chuveiro na embalagem", price: 29.90, stock: 14 },
  { id: "lampada-led-9", name: "Lâmpada LED bulbo 9 W branca", department: "iluminacao", aisle: 37, unit: "un.", details: "Bocal E27, equivale a 60 W", price: 9.90, stock: 120 },
  { id: "plafon-led", name: "Plafon LED sobrepor 18 W", department: "iluminacao", aisle: 37, unit: "un.", details: "Luz branca, para teto", price: 49.90, stock: 12 },

  { id: "reparo-vedacao-12", name: "Reparo de vedação para torneira 1/2”", department: "hidraulica", aisle: 41, unit: "un.", details: "Torneira de rosca comum que pinga com o registro aberto", price: 9.90, stock: 25 },
  { id: "reparo-vedacao-34", name: "Reparo de vedação para torneira 3/4”", department: "hidraulica", aisle: 41, unit: "un.", details: "Torneira de rosca 3/4”, comum em tanque e área externa", price: 11.90, stock: 0, substituteId: "reparo-universal" },
  { id: "reparo-universal", name: "Reparo universal 1/2” e 3/4”", department: "hidraulica", aisle: 41, unit: "un.", details: "Serve nas duas bitolas", price: 16.90, stock: 13 },
  { id: "cartucho-monocomando", name: "Cartucho cerâmico 35 mm para monocomando", department: "hidraulica", aisle: 41, unit: "un.", details: "Torneira de alavanca única que pinga", price: 59.90, stock: 8 },
  { id: "veda-rosca-18", name: "Fita veda-rosca 18 mm x 25 m", department: "hidraulica", aisle: 41, unit: "rolo", details: "Vedação de qualquer conexão de rosca", price: 4.90, stock: 90 },
  { id: "flexivel-40", name: "Engate flexível 1/2” 40 cm", department: "hidraulica", aisle: 41, unit: "un.", details: "Liga torneira ou caixa acoplada ao ponto de água", price: 19.90, stock: 37 },
  { id: "sifao-sanfonado", name: "Sifão sanfonado universal", department: "hidraulica", aisle: 41, unit: "un.", details: "Pia de cozinha, banheiro ou tanque", price: 17.90, stock: 29 },
  { id: "silicone-acetico", name: "Silicone acético transparente 280 g", department: "hidraulica", aisle: 41, unit: "tubo", details: "Vedação em pia, box e azulejo, área molhada", price: 24.90, stock: 33 },
  { id: "aplicador-silicone", name: "Aplicador de silicone", department: "hidraulica", aisle: 41, unit: "un.", details: "Pistola para tubo de 280 g", price: 22.90, stock: 16 },
  { id: "kit-reparo-caixa", name: "Kit reparo para caixa acoplada", department: "hidraulica", aisle: 41, unit: "kit", details: "Vaso que fica soltando água ou não para de encher", price: 54.90, stock: 10 },

  { id: "torneira-parede-cozinha", name: "Torneira de parede para cozinha bica móvel", department: "torneiras", aisle: 47, unit: "un.", details: "Entrada 1/2”", price: 129.90, stock: 7 },
  { id: "torneira-banheiro-mesa", name: "Torneira de mesa para banheiro", department: "torneiras", aisle: 47, unit: "un.", details: "Bica baixa, entrada 1/2”, acompanha flexível", price: 119.90, stock: 9 },
  { id: "torneira-tanque", name: "Torneira de parede para tanque", department: "torneiras", aisle: 47, unit: "un.", details: "Entrada 3/4”", price: 49.90, stock: 12 },
  { id: "registro-gaveta", name: "Registro de gaveta 3/4” com acabamento", department: "torneiras", aisle: 47, unit: "un.", details: "Corta a água de um ponto", price: 89.90, stock: 5 },

  { id: "rejunte-acrilico", name: "Rejunte acrílico branco 1 kg", department: "revestimento", aisle: 52, unit: "pote", details: "Pronto para usar, rende cerca de 4 m² com junta de 3 mm", price: 32.90, stock: 21 },
  { id: "argamassa-ac2", name: "Argamassa AC-II 20 kg", department: "revestimento", aisle: 52, unit: "saco", details: "Piso sobre piso e área interna, rende cerca de 4 m²", price: 39.90, stock: 30 },
  { id: "espacador-3", name: "Espaçador de piso 3 mm (100 un.)", department: "revestimento", aisle: 52, unit: "pacote", details: "Mantém a junta igual", price: 7.90, stock: 44 },
  { id: "desempenadeira", name: "Desempenadeira dentada 8 mm", department: "revestimento", aisle: 52, unit: "un.", details: "Espalha argamassa", price: 19.90, stock: 17 },
  { id: "removedor-rejunte", name: "Raspador de rejunte", department: "revestimento", aisle: 52, unit: "un.", details: "Tira o rejunte velho", price: 16.90, stock: 19 },

  { id: "chave-inglesa-8", name: "Chave inglesa 8”", department: "ferramentas", aisle: 61, unit: "un.", details: "Abre até 24 mm, serve em porca de torneira e sifão", price: 39.90, stock: 14 },
  { id: "chave-fenda-philips", name: "Jogo de chaves fenda e Phillips (6 peças)", department: "ferramentas", aisle: 61, unit: "jogo", details: "Uso geral", price: 34.90, stock: 26 },
  { id: "alicate-universal", name: "Alicate universal isolado 8”", department: "ferramentas", aisle: 61, unit: "un.", details: "Isolado até 1.000 V", price: 49.90, stock: 18 },
  { id: "trena-5", name: "Trena 5 m", department: "ferramentas", aisle: 61, unit: "un.", details: "Trava automática", price: 24.90, stock: 33 },
  { id: "nivel-bolha", name: "Nível de bolha 30 cm", department: "ferramentas", aisle: 61, unit: "un.", details: "Deixa quadro, prateleira e TV retos", price: 21.90, stock: 21 },
  { id: "estilete", name: "Estilete 18 mm", department: "ferramentas", aisle: 61, unit: "un.", details: "Uso geral", price: 9.90, stock: 50 },

  { id: "tinta-acrilica-36", name: "Tinta acrílica fosca branca 3,6 L", department: "pintura", aisle: 63, unit: "galão", details: "Parede interna, rende até 38 m² por demão", price: 119.90, stock: 26 },
  { id: "tinta-acrilica-18", name: "Tinta acrílica fosca branca 18 L", department: "pintura", aisle: 63, unit: "lata", details: "Parede interna, rende até 190 m² por demão", price: 389.90, stock: 8 },
  { id: "tinta-banheiro", name: "Tinta acrílica antimofo 3,6 L", department: "pintura", aisle: 63, unit: "galão", details: "Banheiro, cozinha e área úmida, rende até 35 m² por demão", price: 149.90, stock: 11 },
  { id: "selador-acrilico", name: "Selador acrílico 3,6 L", department: "pintura", aisle: 63, unit: "galão", details: "Parede nova ou reboco antes da tinta, rende até 40 m²", price: 79.90, stock: 9 },
  { id: "massa-corrida", name: "Massa corrida PVA 5,8 kg", department: "pintura", aisle: 63, unit: "balde", details: "Tapa furo e imperfeição em parede interna seca", price: 54.90, stock: 15 },

  { id: "rolo-la-23", name: "Rolo de lã 23 cm com cabo", department: "acessorios-pintura", aisle: 65, unit: "un.", details: "Tinta acrílica em parede lisa", price: 29.90, stock: 31 },
  { id: "pincel-2", name: "Pincel 2” para recorte", department: "acessorios-pintura", aisle: 65, unit: "un.", details: "Cantos, rodapé e perto do teto", price: 12.90, stock: 40 },
  { id: "bandeja-pintura", name: "Bandeja de pintura", department: "acessorios-pintura", aisle: 65, unit: "un.", details: "Para rolo de 23 cm", price: 14.90, stock: 27 },
  { id: "fita-crepe-48", name: "Fita crepe 48 mm x 50 m", department: "acessorios-pintura", aisle: 65, unit: "rolo", details: "Protege rodapé, tomada e batente", price: 18.90, stock: 52 },
  { id: "lona-plastica", name: "Lona plástica 4 x 5 m", department: "acessorios-pintura", aisle: 65, unit: "un.", details: "Protege piso e móveis", price: 19.90, stock: 24 },
  { id: "lixa-150", name: "Lixa para parede grão 150 (5 un.)", department: "acessorios-pintura", aisle: 65, unit: "pacote", details: "Acabamento da massa corrida", price: 9.90, stock: 38 },
  { id: "espatula-8", name: "Espátula de aço 8 cm", department: "acessorios-pintura", aisle: 65, unit: "un.", details: "Aplica massa corrida", price: 14.90, stock: 22 },

  { id: "furadeira-impacto", name: "Furadeira de impacto 550 W", department: "ferramentas-eletricas", aisle: 71, unit: "un.", details: "Fura alvenaria, madeira e metal", price: 249.90, stock: 5 },
  { id: "broca-6", name: "Broca para concreto 6 mm", department: "ferramentas-eletricas", aisle: 71, unit: "un.", details: "Para bucha 6 mm", price: 8.90, stock: 34 },
  { id: "broca-8", name: "Broca para concreto 8 mm", department: "ferramentas-eletricas", aisle: 71, unit: "un.", details: "Para bucha 8 mm", price: 10.90, stock: 0, substituteId: "jogo-brocas" },
  { id: "broca-10-drywall", name: "Broca para madeira e gesso 10 mm", department: "ferramentas-eletricas", aisle: 71, unit: "un.", details: "Para bucha basculante de drywall", price: 12.90, stock: 19 },
  { id: "jogo-brocas", name: "Jogo de brocas para concreto 5 a 10 mm (5 peças)", department: "ferramentas-eletricas", aisle: 71, unit: "jogo", details: "Inclui 6 e 8 mm", price: 29.90, stock: 12 },
];

const productsById = new Map(catalog.map((product) => [product.id, product]));

export const findProduct = (id: string) => productsById.get(id);

export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const catalogForPrompt = () =>
  catalog
    .map(
      (product) =>
        `${product.id} | ${product.name} | ${departmentNames[product.department]} | ${formatPrice(product.price)} | ${product.details}`,
    )
    .join("\n");
