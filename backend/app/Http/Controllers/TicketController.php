<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->isSupport()) {
            $tickets = Ticket::with('customer')->paginate(20);
        } else {
            $tickets = $user->tickets()->paginate(20);
        }

        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $ticket = $request->user()->tickets()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'priority' => $validated['priority'] ?? 'medium',
            'status' => 'todo',
        ]);

        return response()->json($ticket, 201);
    }

    public function show(Ticket $ticket, Request $request)
    {
        $this->authorizeTicket($ticket);

        return response()->json([
            'ticket' => $ticket->load('customer', 'comments.user'),
            'can_comment' => true,
        ]);
    }

    public function update(Ticket $ticket, Request $request)
    {
        $this->authorizeTicket($ticket);

        $validated = $request->validate([
            'status' => 'nullable|in:todo,ongoing,done',
            'priority' => 'nullable|in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        if ($request->user()->isAdmin() || $request->user()->isSupport()) {
            $ticket->update($validated);
        } elseif (isset($validated['status'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($ticket);
    }

    public function destroy(Ticket $ticket, Request $request)
    {
        $this->authorizeTicket($ticket);
        $ticket->delete();

        return response()->json(['message' => 'Ticket deleted'], 200);
    }

    protected function authorizeTicket(Ticket $ticket)
    {
        $user = auth()->user();

        if ($user->isAdmin() || $user->isSupport()) {
            return true;
        }

        if ($ticket->customer_id !== $user->id) {
            abort(403);
        }

        return true;
    }
}
