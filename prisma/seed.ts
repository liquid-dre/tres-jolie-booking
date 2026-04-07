import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding operating hours...");

  // Tres Jolie hours:
  // Tue-Sun: Breakfast 9:00-11:30, Lunch 12:00-17:30
  // Fri-Sat: Dinner 18:00-22:00
  // Monday: Closed (dayOfWeek 0)

  const defaultHours = [
    // Tuesday (1) - Sunday (6): Breakfast & Lunch
    ...[1, 2, 3, 4, 5, 6].flatMap((day) => [
      {
        dayOfWeek: day,
        mealPeriod: "BREAKFAST" as const,
        openTime: "09:00",
        closeTime: "11:30",
        maxCovers: 200,
      },
      {
        dayOfWeek: day,
        mealPeriod: "LUNCH" as const,
        openTime: "12:00",
        closeTime: "17:30",
        maxCovers: 300,
      },
    ]),
    // Friday (4) & Saturday (5): Dinner
    ...[4, 5].map((day) => ({
      dayOfWeek: day,
      mealPeriod: "DINNER" as const,
      openTime: "18:00",
      closeTime: "22:00",
      maxCovers: 200,
    })),
  ];

  for (const h of defaultHours) {
    await prisma.operatingHours.upsert({
      where: {
        dayOfWeek_mealPeriod: {
          dayOfWeek: h.dayOfWeek,
          mealPeriod: h.mealPeriod,
        },
      },
      update: {},
      create: h,
    });
  }

  console.log(`Seeded ${defaultHours.length} operating hour entries.`);

  // Seed default sections
  const sections = [
    { name: "Indoor", capacity: 150 },
    { name: "Outdoor / Garden", capacity: 200 },
    { name: "Patio", capacity: 50 },
  ];

  for (const s of sections) {
    const existing = await prisma.section.findFirst({
      where: { name: s.name },
    });
    if (!existing) {
      await prisma.section.create({ data: s });
    }
  }

  console.log(`Seeded ${sections.length} sections.`);

  // Seed menu categories and items
  console.log("Seeding menu...");

  const menuData = [
    {
      name: "Breakfast",
      label: "Morning",
      sortOrder: 0,
      items: [
        { name: "Tres Jolie Full English Breakfast", description: "2 Fried eggs, grilled tomato, bacon, beef or pork sausage, mushrooms & toast", price: "R121.00" },
        { name: "Tres Jolie South African Farm Breakfast", description: "2 Fried eggs, grilled tomato, bacon, boerewors, baked beans & toast", price: "R121.00" },
        { name: "'Sloppy Jo-lie'", description: "Savoury mince & grilled tomato served on top of 2 slices of toast, with your choice of 2 eggs", price: "R100.00" },
        { name: "Breakfast Wrap", description: "Bacon, feta, mushrooms, peppers and scrambled egg wrapped in our famous wraps", price: "R87.00" },
        { name: "Omelettes - Create Your Own", description: "3 egg omelettes served with a slice of white/brown toast. Add fillings from R12.00", price: "R50.00" },
        { name: "Avo on Toast", description: "2 slices of toast, with crushed avo & 2 poached eggs, topped with rocket", price: "R93.00" },
        { name: "Flapjacks", description: "Stack of vanilla flapjacks, cream & banana, drizzled with maple syrup & decorated with fresh fruit", price: "R87.00" },
        { name: "French Toast - Savoury", description: "Slices of fresh baguette, served with bacon", price: "R70.00" },
        { name: "French Toast - Sweet", description: "Slices of fresh baguette, served with creme fraiche, berries, nuts and honey", price: "R80.00" },
        { name: "Health Breakfast", description: "Layered seasonal fruit, homemade muesli, Greek yoghurt and honey", price: "R80.00" },
        { name: "Tres Jolie 'Veggi Breakfast'", description: "2 eggs, grilled tomato, mushrooms, grilled halloumi, roasted cherry tomatoes, peppers and onions and a slice of healthy toast", price: "R108.00" },
        { name: "Benedicts - Country", description: "Spinach and mushrooms on a homemade scone topped with poached eggs and hollandaise sauce. Weekends only", price: "R100.00" },
        { name: "Benedicts - Tres Jolie", description: "Ham or bacon on a homemade scone topped with poached eggs and hollandaise sauce. Weekends only", price: "R93.00" },
        { name: "Bakers Choice", description: "Homemade scones served with jam and cream", price: "R52.00" },
      ],
    },
    {
      name: "Starters",
      label: "To Start",
      sortOrder: 1,
      items: [
        { name: "Halloumi", description: "Fried, served with fresh lemon & sweet chili sauce", price: "R91.00" },
        { name: "Calamari", description: "Grilled or fried, with lemon-garlic butter sauce", price: "R106.00" },
        { name: "Chicken Livers", description: "Served with a mild peri-peri sauce and a slice of bread", price: "R70.00" },
        { name: "Bistro Snails", description: "Served simmering in a creamy-garlic sauce topped with mozzarella", price: "R70.00" },
        { name: "Chicken Tenders", description: "Crispy fried chicken breast, served with a sweet chili & avo dip", price: "R70.00" },
        { name: "Chicken Wings", description: "Grilled and basted with a peri-peri sauce, lemon & herb or BBQ sauce", price: "R70.00" },
        { name: "Mussels", description: "Steamed in a creamy white wine sauce, served with crusty bread", price: "R70.00" },
        { name: "Prawns", description: "Deshelled prawns, simmering in a creamy garlic & feta sauce", price: "R115.00" },
      ],
    },
    {
      name: "Salads",
      label: "Fresh",
      sortOrder: 2,
      items: [
        { name: "Greek Salad - Chopped", description: "Garden greens with olives & feta, cucumber & chopped tomato", price: "R77.00" },
        { name: "Smoked Salmon Salad", description: "Garden greens served with smoked salmon, capers & avo", price: "R206.00" },
        { name: "Halloumi Salad", description: "Garden greens served with halloumi and cranberry jelly", price: "R120.00" },
        { name: "Avocado & Feta Salad", description: "Fresh greens with avo & feta", price: "R87.00" },
        { name: "Caramelised Pear & Blue Cheese Salad", description: "Fresh greens with toasted nut brittle, pears & creamy blue cheese", price: "R87.00" },
        { name: "Roasted Butternut & Feta Salad", description: "Fresh greens with roasted butternut, feta & toasted seeds", price: "R100.00" },
      ],
    },
    {
      name: "Seafood",
      label: "From the Sea",
      sortOrder: 3,
      items: [
        { name: "Fresh Hake", description: "Grilled or fried (with beer batter)", price: "R146.00" },
        { name: "Calamari", description: "Calamari tubes grilled or fried", price: "R176.00" },
        { name: "Prawns", description: "8 Grilled queen prawns", price: "R248.00" },
        { name: "Kingklip", description: "Grilled kingklip", price: "R236.00" },
        { name: "Seafood Platter (Serves 2)", description: "8 Mussels, 6 grilled queen prawns, 250g hake fillet & 200g calamari. Served with lemon butter, garlic butter or peri-peri sauce", price: "R545.00" },
      ],
    },
    {
      name: "Poultry",
      label: "From the Farm",
      sortOrder: 4,
      items: [
        { name: "Chicken Schnitzel", description: "Crumbed and fried, served with a choice of cheese, mushroom or pepper sauce", price: "R146.00" },
        { name: "Chicken Parmegiano", description: "Crumbed chicken topped with spinach, mozzarella & tomato, oven baked", price: "R176.00" },
        { name: "Cape Malay Chicken Curry", description: "Served with poppadoms, tomato & onion salsa and coconut milk & bananas", price: "R142.00" },
        { name: "Half Chicken", description: "Half flamed grilled chicken. Grilled to your liking - peri-peri, lemon & herb or BBQ", price: "R121.00" },
        { name: "Full Chicken", description: "Full flamed grilled chicken. Grilled to your liking - peri-peri, lemon & herb or BBQ", price: "R218.00" },
      ],
    },
    {
      name: "Grills",
      label: "From the Grill",
      sortOrder: 5,
      items: [
        { name: "Rump Steak 250g", description: "Aged grain fed rump steak", price: "R182.00" },
        { name: "Rump Steak 350g", description: "Aged grain fed rump steak", price: "R218.00" },
        { name: "Halloumi Rump", description: "250g rump stuffed with mozzarella, pepperdew & topped with bacon & halloumi cheese", price: "R236.00" },
        { name: "T-bone Steak 500g", description: "Grilled to your liking", price: "R242.00" },
        { name: "T-bone Steak 1kg", description: "Grilled to your liking", price: "R423.00" },
        { name: "Ribeye 350g", description: "Grilled to your liking", price: "R218.00" },
        { name: "Lamb Cutlets", description: "300g grilled to your liking, served in a basting sauce", price: "R224.00" },
        { name: "Pork Ribs 300g", description: "Succulent ribs, prepared in a homemade sticky BBQ & honey marinade", price: "R200.00" },
        { name: "Pork Ribs 600g", description: "Succulent ribs, prepared in a homemade sticky BBQ & honey marinade", price: "R272.00" },
      ],
    },
    {
      name: "Combos",
      label: "Sharing & Combos",
      sortOrder: 6,
      items: [
        { name: "Tres Jolie Platter (Serves 6-8)", description: "8 Chicken wings, 8 meatballs, 250g ribs, 8 chicken tenders. Served with chips & guacamole", price: "R585.00" },
        { name: "Surf and Turf", description: "250g Rump & calamari combo", price: "R266.00" },
        { name: "Prawn & Rump Steak Combo", description: "4 Grilled queen prawns & 250g rump steak", price: "R338.00" },
        { name: "300g Rib & Half Chicken", description: "300g Rib & half chicken combo", price: "R338.00" },
        { name: "Mixed Grill", description: "150g Rump, 100g lamb chops, 100g boerewors & a chicken thigh", price: "R242.00" },
        { name: "Prawn & Calamari Combo", description: "6 Grilled queen prawns & 150g calamari", price: "R242.00" },
        { name: "Fresh Grilled Hake & Calamari Combo", description: "Served with lemon butter", price: "R220.00" },
      ],
    },
    {
      name: "Pasta",
      label: "Pasta",
      sortOrder: 7,
      items: [
        { name: "Prawn and Bacon Mac & Cheese", description: "Baked penne pasta with a creamy prawn & bacon sauce", price: "R145.00" },
        { name: "Chicken Alfredo", description: "Grilled chicken fillet in a cream parmesan & mushroom sauce", price: "R115.00" },
      ],
    },
    {
      name: "Pizza",
      label: "Wood-Fired",
      sortOrder: 8,
      items: [
        { name: "Focaccia - Olive Oil & Herbs", description: "Freshly baked focaccia", price: "R50.00" },
        { name: "Focaccia - Cheese, Garlic & Herbs", description: "Freshly baked focaccia with cheese & garlic", price: "R56.00" },
        { name: "Margarita", description: "Fresh tomato sauce, mozzarella & herbs", price: "R89.00" },
        { name: "Regina", description: "Country ham, mushrooms & mozzarella", price: "R128.00" },
        { name: "Island", description: "Country ham, pineapple", price: "R120.00" },
        { name: "Vegeteriana", description: "Spinach, mushrooms, peppers, artichokes & onion", price: "R133.00" },
        { name: "Mexicana", description: "Fresh ground beef, peppers, chilli & garlic", price: "R133.00" },
        { name: "Bella-Bella", description: "Bacon & banana", price: "R127.00" },
        { name: "Nantuckey", description: "Chicken, bacon, feta & avo", price: "R179.00" },
        { name: "Palermo", description: "Salami & olive", price: "R146.00" },
        { name: "Baa Baa", description: "Roasted lamb, rosemary, rocket. When available", price: "R133.00" },
        { name: "Kayla", description: "Salami, ham, mushrooms, onions, peppers, garlic, olives", price: "R172.00" },
        { name: "Al Greco", description: "Spinach, olive & feta", price: "R127.00" },
        { name: '"The" Alexander', description: "Pepperdew, rocket, fresh avo, salami & gorgonzola", price: "R170.00" },
      ],
    },
    {
      name: "Burgers",
      label: "Burgers",
      sortOrder: 9,
      items: [
        { name: "Beef Burger 200g", description: "Topped with onions, tomato salsa and lettuce, served with chips & onion rings", price: "R109.00" },
        { name: "Chicken Burger 200g", description: "Topped with onions, tomato salsa and lettuce, served with chips & onion rings", price: "R109.00" },
      ],
    },
    {
      name: "Vegetarian",
      label: "Plant-Based",
      sortOrder: 10,
      items: [
        { name: "Vegetarian Burger", description: "Plant based burger", price: "R115.00" },
        { name: "Vegetarian Platter", description: "Baked potato, grilled spinach, fried mushrooms, grilled tomatoes & zucchini fries", price: "R152.00" },
        { name: "Vegetarian Pasta", description: "Creamy mushroom & avo pasta", price: "R133.00" },
      ],
    },
    {
      name: "Desserts",
      label: "Sweet",
      sortOrder: 11,
      items: [
        { name: "Ice Cream & Chocolate Sauce", description: "Vanilla ice cream", price: "R42.00" },
        { name: "Fresh Fruit Salad", description: "Served with vanilla ice cream", price: "R55.00" },
        { name: "Creme Brulee", description: "Vanilla custard, with a sugar crust", price: "R43.00" },
        { name: "Home Baked Pudding", description: "Steamy hot pudding served with farm style custard", price: "R43.00" },
        { name: "Slice of Cake", description: "Please ask your waiter for today's selection", price: "R64.00" },
        { name: "Chocolate Mousse", description: "Smooth chocolate mousse, garnished with whipped cream", price: "R50.00" },
        { name: "Chocolate Brownie", description: "Soft and gooey, finished with vanilla ice cream (contains nuts)", price: "R56.00" },
      ],
    },
    {
      name: "Kids Menu",
      label: "Little Ones",
      sortOrder: 12,
      items: [
        { name: "Little League Cafe Breakfast", description: "Bacon, egg & toast", price: "R54.00" },
        { name: "Little League Omelette", description: "One egg omelette with 2 fillings: cheese, tomato, bacon or ham", price: "R60.00" },
        { name: "Little Big League", description: "2 Beef chipolatas & egg", price: "R54.00" },
        { name: "Kiddies Flapjacks", description: "Kids sized stack of vanilla flapjacks, drizzled with maple syrup & banana slices", price: "R35.00" },
        { name: "Plate of Chips", description: null, price: "R38.00" },
        { name: "Viennas & Chips", description: "2 Viennas served with chips", price: "R48.00" },
        { name: "Chicken Strips", description: "Home-made chicken strips served with chips", price: "R46.00" },
        { name: "Chicken or Beef Burger", description: "Served with chips", price: "R68.00" },
        { name: "Riblets", description: "200g Pork ribs, prepared with sticky BBQ sauce", price: "R90.00" },
        { name: "Chicken Drumsticks", description: "2 Drumsticks grilled in a BBQ sauce", price: "R68.00" },
        { name: "Hot Dog Pizza", description: "Slices of vienna & mushroom", price: "R80.00" },
        { name: "Margarita Pizza", description: "Kids pizza", price: "R55.00" },
        { name: "Macaroni & Cheese", description: null, price: "R68.00" },
        { name: "Tres Jolie Ice Cream Clown", description: "With sprinkles", price: "R32.00" },
      ],
    },
  ];

  for (const cat of menuData) {
    const existing = await prisma.menuCategory.findFirst({
      where: { name: cat.name },
    });

    if (existing) {
      console.log(`  Category "${cat.name}" already exists, skipping.`);
      continue;
    }

    const category = await prisma.menuCategory.create({
      data: {
        name: cat.name,
        label: cat.label,
        sortOrder: cat.sortOrder,
      },
    });

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          description: item.description,
          price: item.price,
          sortOrder: i,
        },
      });
    }

    console.log(`  Seeded "${cat.name}" with ${cat.items.length} items.`);
  }

  console.log("Menu seeding complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
