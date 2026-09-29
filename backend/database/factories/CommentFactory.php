<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    private static $commentCounter = 0;

    public function definition(): array
    {
        self::$commentCounter++;

        return [
            'ticket_id' => Ticket::factory(),
            'user_id' => User::factory(),
            'body' => 'This is a test comment ' . self::$commentCounter,
        ];
    }
}
