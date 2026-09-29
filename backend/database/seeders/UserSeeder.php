<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);

        // Create support user
        User::create([
            'name' => 'Support Agent',
            'email' => 'support@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'support',
        ]);

        // Create test customer user
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'customer',
        ]);

        // Create additional sample customers
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => "Customer User $i",
                'email' => "customer$i@example.com",
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => 'customer',
            ]);
        }
    }
}
