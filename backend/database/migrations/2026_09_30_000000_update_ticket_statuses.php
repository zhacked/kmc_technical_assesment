<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE tickets MODIFY status VARCHAR(255) DEFAULT 'todo'");
        DB::update("UPDATE tickets SET status = 'todo' WHERE status = 'open'");
        DB::update("UPDATE tickets SET status = 'ongoing' WHERE status = 'in_progress'");
        DB::update("UPDATE tickets SET status = 'done' WHERE status = 'closed'");
        DB::statement("ALTER TABLE tickets MODIFY status ENUM('todo', 'ongoing', 'done') DEFAULT 'todo'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE tickets MODIFY status VARCHAR(255) DEFAULT 'open'");
        DB::update("UPDATE tickets SET status = 'open' WHERE status = 'todo'");
        DB::update("UPDATE tickets SET status = 'in_progress' WHERE status = 'ongoing'");
        DB::update("UPDATE tickets SET status = 'closed' WHERE status = 'done'");
        DB::statement("ALTER TABLE tickets MODIFY status ENUM('open', 'in_progress', 'closed') DEFAULT 'open'");
    }
};
