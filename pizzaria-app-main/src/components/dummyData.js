// src/components/dummyData.js

export const products = [
  // --- PIZZAS ---
  { 
    id: 1, 
    category: "Pizza", 
    name: "Marguerita", 
    price: 49.90, 
    image: "/src/assets/marguerita-demo.png", // (Caminho da imagem que você já tem)
    description: "Deliciosa massa de fermentação caseira, molho pomodoro caseiro, queijo parmesão ralado, mussarela de búfala, manjericão e azeite!"
  },
  { 
    id: 2, 
    category: "Pizza", 
    name: "Pepperoni", 
    price: 59.90, 
    image: "/src/assets/pepperoni.png", // (Você precisará adicionar esta imagem)
    description: "Deliciosa massa de fermentação caseira, molho pomodoro caseiro, queijo mussarela, pepperoni e orégano!"
  },
  { 
    id: 3, 
    category: "Pizza", 
    name: "Portuguesa", 
    price: 55.90, 
    image: "/src/assets/portuguesa.png", // (Ainda não temos)
    description: "Deliciosa massa de fermentação caseira, molho pomodoro caseiro, queijo mussarela, presunto, ovo cozido, cebola e azeitonas!" // (Ainda não temos)
  },
  { 
    id: 4, 
    category: "Pizza", 
    name: "Quatro-queijos", 
    price: 55.90, 
    image: "/src/assets/quatroqueijos.png",
    description: "Deliciosa massa de fermentação caseira, molho pomodoro caseiro, queijo mussarela, provolone, parmesão, gorgonzola e orégano!"
  },
  
  // --- CALZONES ---
  { 
    id: 5, 
    category: "Calzone", 
    name: "Calabresa", 
    price: 35.90, 
    image: "/src/assets/calzonecalabresa.png",
    description: "Deliciosa massa de fermentação caseira, molho pomodoro caseiro, queijo mussarela, calabresa acebolada, e orégano! Tudo isso em uma massa fechada de pizza!"
  },
  { 
    id: 6, 
    category: "Calzone", 
    name: "Frango", 
    price: 39.90, 
    image: "/src/assets/calzonefrango.png",
    description: "Deliciosa massa de fermentação caseira, molho pomodoro caseiro, queijo mussarela, tomate, cebola e frango desfiado! Tudo isso em uma massa fechada de pizza!."
  },
  
  // --- BEBIDAS ---
  { 
    id: 7, 
    category: "Coca-Cola", 
    name: "Latinha 350ml", 
    price: 7.99, 
    image: "/src/assets/coca350.png",
    description: "Coca-cola de latinha bem gelada, de 350ml!",
    options: ["Tradicional", "Zero"]
  },
  { 
    id: 8, 
    category: "Coca-Cola", 
    name: "Garrafa 500ml", 
    price: 12.99, 
    image: "/src/assets/coca500.png",
    description: "Coca-cola de garrafa PET bem geladinha, de 500ml!",
    options: ["Tradicional", "Zero"]
  },
  { 
    id: 9, 
    category: "Prats", 
    name: "Garrafinha 300ml", 
    price: 8.99, 
    image: "/src/assets/prats300.png",
    description: "Suco prats natural, bem geladinho de 300ml!.",
    options: ["Laranja", "Uva", "Goiaba"]
  },
];