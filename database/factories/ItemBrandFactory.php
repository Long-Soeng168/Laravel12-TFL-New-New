<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ItemBrand>
 */
class ItemBrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->company(), // Unique brand code (could be brand name-like)
            'name' => $this->faker->company(), // Brand name
            'name_kh' => $this->faker->boolean(70) ? $this->faker->word() : null, // 70% chance to have a Khmer name
            'image' => $this->faker->boolean(50) ? 'item_brands/' . $this->faker->uuid() . '.png' : null, // 50% chance to have image
            'created_by' => $this->faker->numberBetween(1, 5), // Random user ID for created_by
            'updated_by' => $this->faker->boolean(80) ? $this->faker->numberBetween(1, 5) : null, // 80% chance to have updated_by
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'), // realistic timestamps
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
