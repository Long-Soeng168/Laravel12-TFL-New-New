<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Partner>
 */
class PartnerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company(),
            'name_kh' => $this->faker->boolean(70) ? $this->faker->word() : null,
            'phone' => $this->faker->boolean(80) ? '+855' . $this->faker->numberBetween(10000000, 99999999) : null,
            'link' => $this->faker->boolean(60) ? $this->faker->url() : null,
            'image' => $this->faker->boolean(50) ? 'partners/' . $this->faker->uuid() . '.png' : null,
            'created_by' => $this->faker->numberBetween(1, 5),
            'updated_by' => $this->faker->boolean(80) ? $this->faker->numberBetween(1, 5) : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
