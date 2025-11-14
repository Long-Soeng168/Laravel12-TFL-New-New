<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dtc>
 */
class DtcFactory extends Factory
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
            'short_description' => $this->faker->boolean(70) ? $this->faker->word() : null,
            'short_description_kh' => $this->faker->boolean(70) ? $this->faker->word() : null,
            'status' => 'active', // default to active
            'created_by' => $this->faker->numberBetween(1, 5),
            'updated_by' => $this->faker->boolean(80) ? $this->faker->numberBetween(1, 5) : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
