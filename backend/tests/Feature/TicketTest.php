<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Ticket;
use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $adminUser;
    protected $token;
    protected $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['role' => 'customer']);
        $this->adminUser = User::factory()->create(['role' => 'admin']);
        $this->token = $this->user->createToken('test-token')->plainTextToken;
        $this->adminToken = $this->adminUser->createToken('test-token')->plainTextToken;
    }

    public function test_customer_can_create_ticket()
    {
        $response = $this->postJson('/api/tickets', [
            'title' => 'Payment Issue',
            'description' => 'Cannot process payment',
            'priority' => 'high',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['title' => 'Payment Issue']);

        $this->assertDatabaseHas('tickets', [
            'customer_id' => $this->user->id,
            'title' => 'Payment Issue',
        ]);
    }

    public function test_customer_can_view_own_tickets()
    {
        $ticket1 = Ticket::factory()->create(['customer_id' => $this->user->id]);
        $ticket2 = Ticket::factory()->create(['customer_id' => User::factory()]);

        $response = $this->getJson('/api/tickets', [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $ticket1->id])
            ->assertJsonMissing(['id' => $ticket2->id]);
    }

    public function test_admin_can_view_all_tickets()
    {
        $ticket1 = Ticket::factory()->create(['customer_id' => $this->user->id]);
        $ticket2 = Ticket::factory()->create(['customer_id' => User::factory()]);

        $response = $this->getJson('/api/tickets', [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $ticket1->id])
            ->assertJsonFragment(['id' => $ticket2->id]);
    }

    public function test_customer_can_add_comment_to_own_ticket()
    {
        $ticket = Ticket::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->postJson("/api/tickets/{$ticket->id}/comments", [
            'body' => 'Please help me with this issue',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['body' => 'Please help me with this issue']);

        $this->assertDatabaseHas('comments', [
            'ticket_id' => $ticket->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_customer_cannot_add_comment_to_others_ticket()
    {
        $otherUser = User::factory()->create();
        $ticket = Ticket::factory()->create(['customer_id' => $otherUser->id]);

        $response = $this->postJson("/api/tickets/{$ticket->id}/comments", [
            'body' => 'Unauthorized comment',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(403);
    }

    public function test_customer_can_view_own_ticket_details()
    {
        $ticket = Ticket::factory()->create(['customer_id' => $this->user->id]);
        Comment::factory(2)->create(['ticket_id' => $ticket->id]);

        $response = $this->getJson("/api/tickets/{$ticket->id}", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $ticket->id]);
    }

    public function test_customer_cannot_update_ticket_status()
    {
        $ticket = Ticket::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->putJson("/api/tickets/{$ticket->id}", [
            'status' => 'done',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_ticket_status()
    {
        $ticket = Ticket::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->putJson("/api/tickets/{$ticket->id}", [
            'status' => 'ongoing',
            'assigned_to' => $this->adminUser->id,
        ], [
            'Authorization' => "Bearer {$this->adminToken}",
        ]);

        $response->assertStatus(200);
        $this->assertEquals('ongoing', $ticket->refresh()->status);
    }

    public function test_customer_can_delete_own_ticket()
    {
        $ticket = Ticket::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->deleteJson("/api/tickets/{$ticket->id}", [], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
    }

    public function test_customer_cannot_delete_others_ticket()
    {
        $otherUser = User::factory()->create();
        $ticket = Ticket::factory()->create(['customer_id' => $otherUser->id]);

        $response = $this->deleteJson("/api/tickets/{$ticket->id}", [], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('tickets', ['id' => $ticket->id]);
    }

    public function test_create_ticket_requires_title()
    {
        $response = $this->postJson('/api/tickets', [
            'description' => 'Issue description',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('title');
    }

    public function test_create_ticket_requires_description()
    {
        $response = $this->postJson('/api/tickets', [
            'title' => 'Issue title',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('description');
    }

    public function test_support_agent_can_view_all_tickets()
    {
        $supportUser = User::factory()->create(['role' => 'support']);
        $supportToken = $supportUser->createToken('test-token')->plainTextToken;

        $ticket1 = Ticket::factory()->create(['customer_id' => $this->user->id]);
        $ticket2 = Ticket::factory()->create(['customer_id' => User::factory()]);

        $response = $this->getJson('/api/tickets', [
            'Authorization' => "Bearer {$supportToken}",
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $ticket1->id])
            ->assertJsonFragment(['id' => $ticket2->id]);
    }

    public function test_customer_can_delete_own_comment()
    {
        $ticket = Ticket::factory()->create(['customer_id' => $this->user->id]);
        $comment = Comment::factory()->create([
            'ticket_id' => $ticket->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/comments/{$comment->id}", [], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_ticket_has_default_status_and_priority()
    {
        $response = $this->postJson('/api/tickets', [
            'title' => 'New Issue',
            'description' => 'Issue description',
        ], [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'todo',
                'priority' => 'medium',
            ]);
    }

    public function test_customer_can_view_ticket_with_comments()
    {
        $ticket = Ticket::factory()->create(['customer_id' => $this->user->id]);
        $comments = Comment::factory(3)->create(['ticket_id' => $ticket->id]);

        $response = $this->getJson("/api/tickets/{$ticket->id}", [
            'Authorization' => "Bearer {$this->token}",
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $ticket->id])
            ->assertJsonStructure([
                'ticket' => [
                    'id',
                    'title',
                    'description',
                    'status',
                    'comments' => [
                        '*' => ['id', 'body', 'user']
                    ]
                ],
                'can_comment'
            ]);
    }
}
