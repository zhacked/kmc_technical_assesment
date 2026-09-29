<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function store(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if ($ticket->customer_id !== $user->id && !$user->isAdmin() && !$user->isSupport()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $comment = $ticket->comments()->create([
            'user_id' => $user->id,
            'body' => $validated['body'],
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function destroy(Comment $comment, Request $request)
    {
        if ($comment->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();
        return response()->json(null, 204);
    }
}
