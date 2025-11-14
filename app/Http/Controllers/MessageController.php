<?php

namespace App\Http\Controllers;

use App\Helpers\TelegramHelper;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class MessageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:message view', only: ['index', 'show']),
            new Middleware('permission:message delete', only: ['destroy']),
        ];
    }
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Message::query();

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/messages/Index', [
            'tableData' => $tableData,
        ]);
    }
    public function destroy(Message $message)
    {
        $message->delete();
        return redirect()->back()->with('success', 'Message deleted successfully.');
    }
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'name'       => 'nullable|string|max:255',
            'phone'      => 'required|string|min:8|max:20',
            'email'      => 'nullable|email|max:255',
            'message'       => 'required|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            // Create message
            $message = Message::create($validated);

            DB::commit();

            $result = TelegramHelper::sendMessage($message);
            if ($result['success']) {
                return back()->with('success', 'Message placed successfully!');
            } else {
                return back()->with('error', $result['message']);
            }
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors([
                'general' => 'Failed to place message. ' . $e->getMessage()
            ]);
        }
    }
}
