<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('support_conversations', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('subject');
            $table->enum('status', ['open', 'closed'])->default('open');
        });

        Schema::table('support_messages', function (Blueprint $table) {
            $table->foreignId('support_conversation_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('message');
        });
    }

    public function down(): void
    {
        Schema::table('support_messages', function (Blueprint $table) {
            $table->dropForeign(['support_conversation_id']);
            $table->dropForeign(['user_id']);
            $table->dropColumn(['support_conversation_id', 'user_id', 'message']);
        });

        Schema::table('support_conversations', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'subject', 'status']);
        });
    }
};
