<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PhoneCompany>
 */
class PhoneCompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->bothify('PC-####')),
            // 'code' => $this->faker->unique()->company(),
            'company' => $this->faker->boolean(70) ? $this->faker->word() : null,
            'image' => $this->faker->boolean(50) ? 'phone_company/' . $this->faker->uuid() . '.png' : null,
            'status' => 'active', // default to active
            'created_by' => $this->faker->numberBetween(1, 5),
            'updated_by' => $this->faker->boolean(80) ? $this->faker->numberBetween(1, 5) : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
