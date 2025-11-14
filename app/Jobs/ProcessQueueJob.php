<?php

namespace App\Jobs;

use App\Models\QueueJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Http\Controllers\ABAPayoutController;
use App\Models\Order;
use Illuminate\Http\Request;

class ProcessQueueJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public QueueJob $queueJob;

    public function __construct(QueueJob $queueJob)
    {
        $this->queueJob = $queueJob;
    }

    public function handle(): void
    {
        // Mark as running
        if ($this->queueJob->status == 'completed') return;

        $this->queueJob->update([
            'status' => 'running',
            'run_at' => now(),
        ]);

        try {
            $payload  = $this->queueJob->payload;
            $order_id = $this->queueJob->order_id ?? null;

            if ($this->queueJob->job_type === 'payout_to_shop' && $order_id) {

                $orderDetailOld = Order::find($order_id);
                if ($orderDetailOld->payout_status === 'paid') {
                    $this->queueJob->update([
                        'status'       => 'completed',
                        'completed_at' => now(),
                        'note'         => "Payout already done.",
                    ]);
                    return;
                }

                // Call the payout method directly
                $payoutController = new ABAPayoutController();
                $payoutController->payout($order_id); // just call it, let it run

                // Check if payout succeeded
                $orderDetail = Order::find($order_id); // simpler than where()->first()

                if ($orderDetail->payout_status === 'paid') {
                    $this->queueJob->update([
                        'status'       => 'completed',
                        'completed_at' => now(),
                        'note'         => "Payout done for order {$order_id}",
                    ]);
                } else {
                    throw new \Exception("Payout failed");
                }
            } elseif ($this->queueJob->job_type === 'test') {
                $this->queueJob->update([
                    'status'       => 'completed',
                    'completed_at' => now(),
                    'note'         => "Update Test completed",
                ]);
            }


            // If no matching type or order_id missing
        } catch (\Throwable $e) {
            // ❌ Mark as failed
            $this->queueJob->update([
                'status' => 'failed',
                'note'   => $e->getMessage(),
            ]);
        }
    }
}
