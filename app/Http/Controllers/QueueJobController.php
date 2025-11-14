<?php

namespace App\Http\Controllers;

use App\Models\QueueJob;
use App\Jobs\ProcessQueueJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueueJobController extends Controller
{
    // Show page
    public function index()
    {
        $tableData = QueueJob::orderBy('id', 'desc')->paginate(10);
        return Inertia::render('admin/queue_jobs/Index', [
            'tableData' => $tableData,
        ]);
    }

    // Create + dispatch new job
    public function start(Request $request)
    {
        $orderPayload = [
            "order_id" => 1234,
            "order_number" => "ORD-2025-0001",
            "created_at" => "2025-09-30T14:23:00Z",
            "status" => "paid",
            "notes" => "Please deliver after 5 PM",
            "shipping_address" => "123 Main St, Phnom Penh, Cambodia",

            "shop_id" => "111",
            "buyer_id" => "123",

            "tran_id" => "TXN-56789",
            "transaction_detail" => "Paid via ABA Pay",
            "payment_method" => "aba",
            "payment_status" => "success",
            "shipping_price" => 5.5,
            "total_amount" => 120.75,
            "payout_status" => "pending",
        ];
        // 1️⃣ Create queue job record
        $queueJob = QueueJob::create([
            'job_type' => 'test',
            'payload' => $orderPayload,
            'delay_second' => 2, // time delay to run after creation (48h =  48 * 3600)
            'run_at' => null,           // not started yet
        ]);

        // 2️⃣ Dispatch to Laravel queue with delay
        ProcessQueueJob::dispatch($queueJob)->delay($queueJob->delay_second);

        // 3️⃣ Redirect to show page to poll status
        return redirect("/queue_job/$queueJob->id");
    }


    // Show job details (polled by Inertia)
    public function execute(QueueJob $queueJob)
    {
        try {
            // Prevent executing already completed jobs
            if ($queueJob->status === 'completed') {
                return redirect()->back()->with('warning', 'This job has already been completed.');
            }

            // Dispatch the job
            ProcessQueueJob::dispatch($queueJob)->delay(0);

            return redirect()->back()->with('success', 'Job dispatched successfully.');
        } catch (\Exception $e) {
            // Log the error for debugging

            // $queueJob->update(['status' => 'failed', 'note' => $e->getMessage()]);

            return redirect()->back()->with('error', 'Failed to dispatch the job. Please try again.');
        }
    }

    public function show(QueueJob $queueJob)
    {
        return Inertia::render('admin/queue_jobs/Create', [
            'job' => $queueJob,
        ]);
    }
}
