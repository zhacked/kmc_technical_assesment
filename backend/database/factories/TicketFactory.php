<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    private static $titleCounter = 0;

    public function definition(): array
    {
        self::$titleCounter++;
        $statuses = ['todo', 'ongoing', 'done'];
        $priorities = ['low', 'medium', 'high'];

        return [
            'customer_id' => User::factory(),
            'assigned_to' => null,
            'title' => 'Test Ticket ' . self::$titleCounter,
            'description' => 'This is a test ticket description ' . self::$titleCounter,
            'status' => $statuses[self::$titleCounter % 3],
            'priority' => $priorities[self::$titleCounter % 3],
        ];
    }
}
