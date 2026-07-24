<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('title');
            $table->text('message');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->boolean('is_read')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['title', 'message', 'user_id', 'is_read']);
        });
    }
};
