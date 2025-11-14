<?php

namespace Database\Factories;

use App\Models\VideoPlayList;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Video>
 */
class VideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $playlist = VideoPlayList::inRandomOrder()->first();
        return [
            'is_free' => fake()->boolean(),
            'title' => fake()->unique()->sentence(3),
            'title_kh' => fake()->words(3, true),
            'file_name' => fake()->optional()->word() . '.mp4',
            'image' => fake()->imageUrl(),
            'playlist_code' => $playlist?->code,
            'status' => 'active',
            'short_description' => fake()->paragraph(),
            'short_description_kh' => fake()->paragraph(),
            'total_view_counts' => fake()->numberBetween(0, 10000),
            'created_by' => $this->faker->numberBetween(1, 5),
            'updated_by' => $this->faker->boolean(80) ? $this->faker->numberBetween(1, 5) : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'video_play_list_id' => $playlist?->id,
        ];
    }
}
