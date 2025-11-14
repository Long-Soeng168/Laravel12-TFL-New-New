<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

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
            'code' => Str::upper($this->faker->unique()->lexify('PRJ???')),
            'order_index' => $this->faker->optional()->numberBetween(1, 100),
            'parent_code' => null,
            'status' => $this->faker->randomElement(['active', 'inactive', 'pending']),
            'created_by' => 1,
            'updated_by' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
