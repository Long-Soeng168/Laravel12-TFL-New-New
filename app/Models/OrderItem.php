<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $guarded = [];
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id', 'id');
    }
}
