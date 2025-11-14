<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VideoPlayList>
 */
class VideoPlayListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->bothify('VP-####')),
            'name' => fake()->sentence(2),
            'name_kh' => fake()->words(2, true),
            'price' => fake()->randomFloat(2, 0, 100),
            'image' => fake()->imageUrl(),
            'status' => 'active',
            'short_description' => fake()->paragraph(),
            'short_description_kh' => fake()->paragraph(),
        ];
    }
}
