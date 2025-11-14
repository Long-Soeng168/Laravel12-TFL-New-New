<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'title_kh' => $this->faker->optional()->sentence(3),
            'image' => $this->faker->optional()->imageUrl(640, 480, 'education', true), // Optional image URL
            'price' => $this->faker->randomFloat(2, 10, 500), // Price between 10.00 and 500.00
            'short_description' => $this->faker->paragraph(2),
            'short_description_kh' => $this->faker->optional()->paragraph(2),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'start_at' => $this->faker->optional()->dateTimeBetween('-1 month', '+1 month'),
            'end_at' => $this->faker->optional()->dateTimeBetween('+1 month', '+6 months'),
            'created_by' => $this->faker->numberBetween(1, 5),
            'updated_by' => $this->faker->boolean(80) ? $this->faker->numberBetween(1, 5) : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
