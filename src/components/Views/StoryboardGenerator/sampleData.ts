// Sample storyboard data for development/testing purposes
// Matches schema v1.0 with duration_ms, environmentRegistry, etc.

export const SAMPLE_STORYBOARD = {
  "version": "1.0",
  "generated_at": "2025-10-28T12:00:00.000Z",
  "input": {
    "user_prompt": "How to make crème brûlée - a French dessert tutorial",
    "style_filter": ["Cinematic", "Food Photography"],
    "duration_seconds": 45
  },
  "styleSettings": {
    "camera_type": "DSLR with 50mm f/1.8 lens",
    "lighting_style": "Natural window light with warm fill",
    "colour_palette": "Warm creams, golden caramel, white marble, soft pastels",
    "render_style": "Photorealistic food photography with shallow depth of field",
    "aspect_ratio": "16:9"
  },
  "characterRegistry": [
    {
      "id": "chef",
      "name": "Chef",
      "description": "Professional pastry chef demonstrating the recipe",
      "appearance": "Hands visible, wearing white chef's coat",
      "wardrobe": "Clean white chef's coat, rolled up sleeves",
      "age_range": "30-40",
      "tags": ["instructor", "expert"]
    }
  ],
  "objectRegistry": [
    {
      "id": "ramekins",
      "name": "Ramekin Dishes",
      "description": "Six white porcelain ramekins for baking",
      "visual_traits": "Classic French ceramic ramekins, 4oz capacity, smooth glossy finish, arranged in two rows of three",
      "tags": ["cookware", "hero-product"]
    },
    {
      "id": "kitchen_torch",
      "name": "Kitchen Torch",
      "description": "Professional culinary blowtorch for caramelizing sugar",
      "visual_traits": "Stainless steel torch with blue flame, ergonomic black handle",
      "tags": ["tool", "essential"]
    }
  ],
  "environmentRegistry": [
    {
      "id": "modern_kitchen",
      "name": "Modern Home Kitchen",
      "description": "Bright, clean contemporary kitchen with professional touch",
      "visual_details": "White marble countertops, stainless steel appliances, subway tile backsplash, wooden cutting boards, copper utensils hanging",
      "lighting": "Soft natural light from large window on left side, supplemented by warm overhead pendant lights",
      "tags": ["interior", "daytime", "professional-home"]
    }
  ],
  "scenes": [
    {
      "scene_id": "scene_1",
      "title": "Ingredient Preparation",
      "description": "Introduction and ingredient setup for crème brûlée",
      "visual_prompt": "Bright modern kitchen with natural lighting, marble counter, ingredients artfully arranged",
      "time_range": {
        "start_s": 0,
        "end_s": 15
      },
      "shots": [
        {
          "shot_id": "shot_1",
          "shot_number": 1,
          "shot_type": "Wide Shot",
          "description": "Establishing shot of kitchen with all ingredients laid out on marble counter",
          "visual_prompt": "Wide angle view of modern kitchen, marble countertop in focus, ingredients including eggs, heavy cream, vanilla beans, sugar arranged beautifully with six white ramekins",
          "thumbnail_prompt": "Overhead wide shot of baking ingredients on white marble counter, natural lighting",
          "duration_ms": 4000,
          "objects": ["ramekins"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_2",
          "shot_number": 2,
          "shot_type": "Close Up",
          "description": "Close-up of vanilla bean being split and scraped",
          "visual_prompt": "Extreme close-up of hands using paring knife to split vanilla bean lengthwise, revealing black seeds inside, marble counter background slightly blurred",
          "thumbnail_prompt": "Close-up hands splitting vanilla bean with knife on marble surface",
          "duration_ms": 3500,
          "characters": ["chef"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_3",
          "shot_number": 3,
          "shot_type": "Medium Shot",
          "description": "Chef whisking egg yolks with sugar in glass bowl",
          "visual_prompt": "Medium shot of glass mixing bowl, hands whisking egg yolks and sugar together until pale and creamy, natural window light creating soft shadows",
          "thumbnail_prompt": "Hands whisking golden egg mixture in glass bowl, side angle",
          "duration_ms": 4500,
          "characters": ["chef"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_4",
          "shot_number": 4,
          "shot_type": "Insert",
          "description": "Cream being poured into saucepan on stove",
          "visual_prompt": "Insert shot of heavy cream being poured from glass measuring cup into stainless steel saucepan, steam beginning to rise",
          "thumbnail_prompt": "Pouring cream into saucepan, shallow depth of field, warm lighting",
          "duration_ms": 3000,
          "characters": ["chef"],
          "environment_id": "modern_kitchen"
        }
      ]
    },
    {
      "scene_id": "scene_2",
      "title": "Baking Process",
      "description": "Pouring custard and baking the ramekins",
      "visual_prompt": "Kitchen counter and oven, focus on precision and technique",
      "time_range": {
        "start_s": 15,
        "end_s": 30
      },
      "shots": [
        {
          "shot_id": "shot_5",
          "shot_number": 5,
          "shot_type": "Overhead",
          "description": "Overhead view of custard being poured into six ramekins",
          "visual_prompt": "Directly overhead shot showing six white ramekins arranged on baking tray, hands pouring custard mixture from spouted measuring cup into each ramekin, creating concentric ripples",
          "thumbnail_prompt": "Bird's eye view of custard being poured into white ramekins on tray",
          "duration_ms": 5000,
          "characters": ["chef"],
          "objects": ["ramekins"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_6",
          "shot_number": 6,
          "shot_type": "Medium Shot",
          "description": "Placing ramekins in water bath in roasting pan",
          "visual_prompt": "Side angle medium shot of hands carefully placing filled ramekins into large roasting pan, then pouring hot water around them to create bain-marie",
          "thumbnail_prompt": "Hands arranging ramekins in water bath, steam rising, warm tones",
          "duration_ms": 4000,
          "characters": ["chef"],
          "objects": ["ramekins"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_7",
          "shot_number": 7,
          "shot_type": "Push In",
          "description": "Camera pushes in on oven as door opens and tray is inserted",
          "visual_prompt": "Slow push in starting wide on oven, oven door opens revealing warm orange interior light, hands slide in the water bath tray with ramekins",
          "thumbnail_prompt": "Oven door opening with ramekins on tray being inserted, warm interior glow",
          "duration_ms": 4500,
          "characters": ["chef"],
          "objects": ["ramekins"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_8",
          "shot_number": 8,
          "shot_type": "Close Up",
          "description": "Close-up through oven window showing custards setting",
          "visual_prompt": "Close-up through oven glass window, soft orange glow illuminating the ramekins, custard surface gently quivering as it sets",
          "thumbnail_prompt": "View through oven glass of custards baking, warm orange lighting",
          "duration_ms": 3500,
          "objects": ["ramekins"],
          "environment_id": "modern_kitchen"
        }
      ]
    },
    {
      "scene_id": "scene_3",
      "title": "Caramelizing & Presentation",
      "description": "Final touches - adding sugar and torch caramelization",
      "visual_prompt": "Counter with finished custards, focus on the dramatic caramelizing process",
      "time_range": {
        "start_s": 30,
        "end_s": 45
      },
      "shots": [
        {
          "shot_id": "shot_9",
          "shot_number": 9,
          "shot_type": "Medium Close Up",
          "description": "Sprinkling sugar evenly over chilled custard surface",
          "visual_prompt": "Medium close-up of hand sprinkling white granulated sugar from small bowl over custard surface in ramekin, sugar falling like snow, marble counter in background",
          "thumbnail_prompt": "Hand sprinkling sugar over custard in ramekin, side lighting, shallow focus",
          "duration_ms": 3500,
          "characters": ["chef"],
          "objects": ["ramekins"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_10",
          "shot_number": 10,
          "shot_type": "Extreme Close Up",
          "description": "Extreme close-up of blowtorch flame caramelizing the sugar",
          "visual_prompt": "Extreme macro shot of blue torch flame touching white sugar, sugar bubbling and turning golden-brown, creating glossy caramel shell, mesmerizing transformation",
          "thumbnail_prompt": "Macro shot of torch flame caramelizing sugar on custard, golden bubbling",
          "duration_ms": 5000,
          "characters": ["chef"],
          "objects": ["ramekins", "kitchen_torch"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_11",
          "shot_number": 11,
          "shot_type": "Close Up",
          "description": "Tapping the caramelized top with a spoon to show the crack",
          "visual_prompt": "Close-up of silver spoon tapping the golden caramelized surface, creating satisfying crack pattern in the sugar shell, revealing cream custard underneath",
          "thumbnail_prompt": "Spoon cracking caramelized sugar top of crème brûlée, golden shell breaking",
          "duration_ms": 3500,
          "objects": ["ramekins"],
          "environment_id": "modern_kitchen"
        },
        {
          "shot_id": "shot_12",
          "shot_number": 12,
          "shot_type": "Wide Shot",
          "description": "Final presentation of all six finished crème brûlées",
          "visual_prompt": "Beautiful wide shot of all six completed crème brûlées arranged on marble counter, each with perfectly caramelized golden-brown top, fresh mint leaves as garnish, afternoon window light creating soft shadows",
          "thumbnail_prompt": "Hero shot of six finished crème brûlées with caramelized tops on marble surface",
          "duration_ms": 4500,
          "objects": ["ramekins"],
          "environment_id": "modern_kitchen"
        }
      ]
    }
  ]
};

